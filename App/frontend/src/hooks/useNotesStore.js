import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

/* Hae käyttäjän suosikit Set-muotoon */
async function fetchFavoritesSet(userId) {
  const { data, error } = await supabase
    .from("favorites")
    .select("note_id")
    .eq("user_id", userId);

  if (error) throw error;
  return new Set((data || []).map((r) => r.note_id));
}

export const useNotesStore = create((set, get) => ({
  // ---------- STATE ----------
  notes: [],
  selectedNoteId: null,
  selectedNote: null,
  searchQuery: "",
  loading: false,
  error: null,

  // Presence & user
  activeUsers: [],
  presenceChannel: null,
  isLocalChange: false,
  currentUser: null,

  // Realtime
  realtimeSubscription: null,

  // Favorites
  uid: null,
  favs: new Set(), // Set(note_id)

  // ---------- SETTERIT ----------
  setCurrentUser: (user) => set({ currentUser: user }),
  setIsLocalChange: (flag) => set({ isLocalChange: flag }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedNoteIdOnly: (noteId) => set({ selectedNoteId: noteId }),
  setUid: (id) => set({ uid: id }),
  setFavs: (updater) =>
    set((state) => {
      const next =
        typeof updater === "function" ? updater(state.favs) : updater;
      return { favs: next };
    }),

  // ---------- INIT käyttäjä + suosikit ----------
  initAuthAndFavs: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      set({ uid: null, favs: new Set() });
      return;
    }
    const user = data?.user ?? null;
    set({ uid: user?.id ?? null, currentUser: user });

    if (user?.id) {
      const favSet = await fetchFavoritesSet(user.id);
      set({ favs: favSet });
    } else {
      set({ favs: new Set() });
    }
  },

  // ---------- NOTES: LISTA & HAKU ----------
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
    set({ selectedNoteId: noteId, loading: true, error: null });
    await get().fetchNoteById(noteId);
  },

  // ---------- NOTES: CRUD ----------
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
      notes: state.notes.map((n) =>
        n.note_id === noteId ? { ...n, title: newTitle, updated_at: now } : n
      ),
      selectedNote:
        state.selectedNote?.note_id === noteId
          ? { ...state.selectedNote, title: newTitle, updated_at: now }
          : state.selectedNote,
    }));
  },

  deleteNote: async (noteId) => {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("note_id", noteId);

    if (error) {
      set({ error: error.message });
      return;
    }

    set((state) => {
      const next = state.notes.filter((n) => n.note_id !== noteId);
      const deletingSelected = state.selectedNoteId === noteId;
      return {
        notes: next,
        selectedNote: deletingSelected ? null : state.selectedNote,
        selectedNoteId: deletingSelected ? null : state.selectedNoteId,
      };
    });
  },

  // ---------- FAVORITES ----------
  isFavorite: (noteId) => get().favs.has(noteId),

  addFavorite: async (noteId) => {
    const uid = get().uid;
    if (!uid) return;

    set((state) => {
      const s = new Set(state.favs);
      s.add(noteId);
      return { favs: s };
    });

    const { error } = await supabase
      .from("favorites")
      .insert({ user_id: uid, note_id: noteId });

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
    const uid = get().uid;
    if (!uid) return;

    set((state) => {
      const s = new Set(state.favs);
      s.delete(noteId);
      return { favs: s };
    });

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", uid)
      .eq("note_id", noteId);

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

  /* <-- UUSI yhdistelmä-funktio Sidebarin kutsuun */
  fetchFavouriteNotes: async () => {
    const { initAuthAndFavs, fetchNotes } = get();
    await initAuthAndFavs();
    await fetchNotes();
  },

  // ---------- REALTIME ----------
  setupPresence: async (noteId, user, onContentReceive) => {
    if (!noteId || !user) return;

    const prev = get().presenceChannel;
    if (prev) prev.unsubscribe();

    const channel = supabase.channel(`note-presence-${noteId}`, {
      config: { presence: { key: user.id } },
    });

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const users = Object.keys(state).map((key) => state[key][0]);
      set({ activeUsers: users });
    });

    channel.on("broadcast", { event: "content_change" }, ({ payload }) => {
      if (payload.user.id !== user.id) {
        set({ isLocalChange: true });
        if (onContentReceive) onContentReceive(payload.content);
      }
    });

    await channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        channel.track({ user_id: user.id, email: user.email });
      }
    });

    set({ presenceChannel: channel });
  },

  cleanupPresence: () => {
    const channel = get().presenceChannel;
    if (channel) {
      channel.unsubscribe();
      set({ presenceChannel: null, activeUsers: [] });
    }
  },

  setupRealtimeSubscription: () => {
    const subscription = supabase
      .channel("notes-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notes" },
        (payload) => {
          const inserted = payload.new;
          set((state) => ({
            notes: [inserted, ...state.notes],
          }));
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "notes" },
        (payload) => {
          const updatedNote = payload.new;
          const { selectedNoteId, currentUser } = get();

          set((state) => ({
            notes: state.notes.map((n) =>
              n.note_id === updatedNote.note_id ? updatedNote : n
            ),
          }));

          if (
            selectedNoteId === updatedNote.note_id &&
            updatedNote.updated_by !== currentUser?.id
          ) {
            set({ selectedNote: updatedNote });
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "notes" },
        (payload) => {
          const deletedId = payload.old?.note_id;
          set((state) => {
            const next = state.notes.filter((n) => n.note_id !== deletedId);
            const deletingSelected = state.selectedNoteId === deletedId;
            return {
              notes: next,
              selectedNote: deletingSelected ? null : state.selectedNote,
              selectedNoteId: deletingSelected ? null : state.selectedNoteId,
            };
          });
        }
      )
      .subscribe();

    set({ realtimeSubscription: subscription });
  },

  cleanupRealtimeSubscription: () => {
    const sub = get().realtimeSubscription;
    if (sub) {
      sub.unsubscribe();
      set({ realtimeSubscription: null });
    }
  },

  broadcastContentChange: debounce(async (newContent) => {
    const { presenceChannel, isLocalChange, currentUser } = get();
    if (!presenceChannel || !currentUser) return;

    if (isLocalChange) {
      set({ isLocalChange: false });
      return;
    }

    await presenceChannel.send({
      type: "broadcast",
      event: "content_change",
      payload: {
        user: { id: currentUser.id, email: currentUser.email },
        content: newContent,
      },
    });
  }, 100),

  saveNoteToDatabase: debounce(async (noteId, content) => {
    try {
      const now = new Date().toISOString();

      const { error } = await supabase
        .from("notes")
        .update({ content, updated_at: now })
        .eq("note_id", noteId);

      if (error) throw error;

      set((state) => ({
        notes: state.notes.map((n) =>
          n.note_id === noteId ? { ...n, content, updated_at: now } : n
        ),
        selectedNote:
          state.selectedNote?.note_id === noteId
            ? { ...state.selectedNote, content, updated_at: now }
            : state.selectedNote,
      }));
    } catch (err) {
      set({ error: err.message });
      console.error("Failed to save note:", err);
    }
  }, 1000),

  handleContentChange: (newContent) => {
    const { selectedNoteId, broadcastContentChange, saveNoteToDatabase } = get();
    if (!selectedNoteId) return;
    broadcastContentChange(newContent);
    saveNoteToDatabase(selectedNoteId, newContent);
  },
}));


