import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { useRealtimeStore } from "./useRealtimeStore";

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const debouncedSave = debounce(async (noteId, content) => {
  try {
    const now = new Date().toISOString();

    const { error } = await supabase
      .from("notes")
      .update({ content, updated_at: now })
      .eq("note_id", noteId);

    if (error) throw error;

    useNotesStore.setState((state) => ({
      notes: state.notes.map((note) =>
        note.note_id === noteId ? { ...note, content, updated_at: now } : note
      ),
    }));
  } catch (err) {
    useNotesStore.setState({ error: err.message });
    console.error("Failed to save note:", err);
  }
}, 1000);

export const useNotesStore = create((set, get) => ({
  notes: [],
  selectedNoteId: null,
  selectedNote: null,
  searchQuery: "",
  loading: false,
  error: null,
  activeUsers: [],
  presenceChannel: null,
  isLocalChange: false,
  currentUser: null,
  favs: new Set(),
  collaborators: [],
  role: null,

  setCurrentUser: (user) => set({ currentUser: user }),
  setIsLocalChange: (flag) => set({ isLocalChange: flag }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  
  addNote: (note) =>
    set((state) => ({
      notes: [note, ...state.notes],
    })),

  updateNote: (updatedNote) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.note_id === updatedNote.note_id ? updatedNote : note
      ),
    })),

  deleteNote: (deletedId) =>
    set((state) => {
      const nextNotes = state.notes.filter((note) => note.note_id !== deletedId);
      const deletingSelected = state.selectedNoteId === deletedId;
      return {
        notes: nextNotes,
        selectedNote: deletingSelected ? null : state.selectedNote,
        selectedNoteId: deletingSelected ? null : state.selectedNoteId,
      };
    }),

  setFavs: (updater) =>
    set((state) => {
      const next = typeof updater === "function" ? updater(state.favs) : updater;
      return { favs: next };
    }),

  fetchFavorites: async () => {
    const { data, error } = await supabase.from("favorites").select("note_id");
    if (error) {
      set({ error: error.message });
      return;
    }
    set({ favs: new Set((data ?? []).map((r) => r.note_id)) });
  },

  fetchNotes: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      set({ notes: data || [], loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchNoteById: async (noteId) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*, note_tags(*, tags(name))")
        .eq("note_id", noteId)
        .single();
      if (error) throw error;

      set({ selectedNote: data, selectedNoteId: noteId, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  setSelectedNote: async (noteId) => {
    await get().fetchNoteById(noteId);
  },

  fetchNoteCollaborators: async (noteId) => {
    if (!noteId) return;
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("note_collaborators")
        .select("role, users(id, username)")
        .eq("note_id", noteId);
      if (error) throw error;
      const users = data?.map(nc => ({ user_id: nc.users.id, username: nc.users.username, role: nc.role })) || [];
      const userRole = users.find(u => u.user_id === get().currentUser?.id)?.role || null;
      set({ role: userRole });
      set({ collaborators: users || [], loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      return [];
    }
  },

  createNote: async (title = "Untitled note") => {
    const { currentUser } = get();
    if (!currentUser?.id) return null;

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("notes")
      .insert({
        title,
        content: "",
        creator_id: currentUser.id,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      set({ error: error.message });
      return null;
    }

    set((state) => ({
      notes: [data, ...state.notes],
      selectedNote: data,
      selectedNoteId: data.note_id,
    }));

    return data;
  },

  updateNoteTitle: async (noteId, newTitle) => {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("notes")
      .update({ title: newTitle, updated_at: now })
      .eq("note_id", noteId);

    if (error) {
      set({ error: error.message });
      return;
    }

    set((state) => ({
      notes: state.notes.map((note) =>
        note.note_id === noteId ? { ...note, title: newTitle, updated_at: now } : note
      ),
      selectedNote:
        state.selectedNote?.note_id === noteId
          ? { ...state.selectedNote, title: newTitle, updated_at: now }
          : state.selectedNote,
    }));
  },

  deleteNote: async (noteId) => {
    const { error } = await supabase.from("notes").delete().eq("note_id", noteId);

    if (error) {
      set({ error: error.message });
      return;
    }

    set((state) => {
      const next = state.notes.filter((note) => note.note_id !== noteId);
      const deletingSelected = state.selectedNoteId === noteId;
      return {
        notes: next,
        selectedNote: deletingSelected ? null : state.selectedNote,
        selectedNoteId: deletingSelected ? null : state.selectedNoteId,
      };
    });
  },

  isFavorite: (noteId) => get().favs.has(noteId),

  addFavorite: async (noteId) => {
    const uid = get().currentUser?.id;
    if (!uid) return;

    set((state) => {
      const s = new Set(state.favs);
      s.add(noteId);
      return { favs: s };
    });

    const { error } = await supabase.from("favorites").insert({ user_id: uid, note_id: noteId });

    if (error) {
      set((state) => {
        const s = new Set(state.favs);
        s.delete(noteId);
        return { favs: s, error: error.message };
      });
      throw error;
    }
  },

  removeFavorite: async (noteId) => {
    const uid = get().currentUser?.id;
    if (!uid) return;

    set((state) => {
      const s = new Set(state.favs);
      s.delete(noteId);
      return { favs: s };
    });

    const { error } = await supabase.from("favorites").delete().eq("note_id", noteId);

    if (error) {
      set((state) => {
        const s = new Set(state.favs);
        s.add(noteId);
        return { favs: s, error: error.message };
      });
      throw error;
    }
  },

  toggleFavorite: async (noteId) => {
    const { isFavorite, addFavorite, removeFavorite } = get();
    if (isFavorite(noteId)) await removeFavorite(noteId);
    else await addFavorite(noteId);
  },

  removeCollaborator: async (noteId, userId) => {
    if (!(noteId && userId)) return;

    const { error } = await supabase
      .from("note_collaborators")
      .delete()
      .eq("note_id", noteId)
      .eq("user_id", userId);

    if (error) {
      set({ error: error.message });
      return;
    }

    set((state) => ({
      collaborators: state.collaborators.filter((c) => c.user_id !== userId),
    }));
  },
  
  saveNoteToDatabase: (noteId, content) => {
    debouncedSave(noteId, content);
  },

  handleContentChange: (newContent) => {
    const { selectedNoteId } = get();
    if (!selectedNoteId) return;
    debouncedSave(selectedNoteId, newContent);
  },
}));