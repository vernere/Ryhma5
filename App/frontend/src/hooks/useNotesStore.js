import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

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

  setSelectedNote: async (noteId) => {
    set({ selectedNoteId: noteId, loading: true, error: null });
    await get().fetchNoteById(noteId);
  },
  setActiveUsers: (users) => set({ activeUsers: users }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveUsers: (users) => set({ activeUsers: users }),
  setIsLocalChange: (flag) => set({ isLocalChange: flag }),
  setCurrentUser: (user) => set({ currentUser: user }),

  fetchNotes: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      set({ notes: data, loading: false });
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

      set({ selectedNote: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

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
        get().setIsLocalChange(true);
        if (onContentReceive) onContentReceive(payload.content);
      }
    });

    await channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        channel.track({
          user_id: user.id,
          email: user.email,
        });
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

  broadcastContentChange: debounce(async (newContent) => {
    const { presenceChannel, isLocalChange } = get();
    const user = get().currentUser;

    if (!presenceChannel || !user || isLocalChange) {
      set({ isLocalChange: false });
      return;
    }

    await presenceChannel.send({
      type: "broadcast",
      event: "content_change",
      payload: {
        user: { id: user.id, email: user.email },
        content: newContent,
      },
    });
  }, 100),

  handleContentChange: (newContent) => {
    get().broadcastContentChange(newContent);
  },
}));