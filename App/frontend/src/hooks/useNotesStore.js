import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

export const useNotesStore = create((set, get) => ({
  notes: [],
  selectedNoteId: null,
  selectedNote: null,
  searchQuery: "",
  loading: false,
  error: null,

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

  // setSelectedNote now accepts a note id; it updates selectedNoteId and fetches the full note
  setSelectedNote: async (noteId) => {
    set({ selectedNoteId: noteId, loading: true, error: null });
    if (!noteId) {
      set({ selectedNote: null, loading: false });
      return;
    }

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

  setSearchQuery: (query) => set({ searchQuery: query }),
}));
