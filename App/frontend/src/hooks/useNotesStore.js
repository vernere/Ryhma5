import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";

export const useNotesStore = create((set, get) => ({
  notes: [],
  selectedNoteId: null,
  selectedNote: null,
  ydoc: null,
  provider: null,
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

  cleanup: () => {
    const state = get();
    
    if (state.provider) {
      state.provider.destroy();
    }
    
    if (state.ydoc) {
      state.ydoc.destroy();
    }
  },

  setSelectedNote: async (noteId) => {
    const state = get();

    state.cleanup();
    
    set({ selectedNoteId: noteId, loading: true, error: null });
  
    if (!noteId) {
      set({ 
        selectedNote: null, 
        loading: false, 
        ydoc: null, 
        provider: null
      });
      return;
    }
  
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*, note_tags(*, tags(name))")
        .eq("note_id", noteId)
        .single();
  
      if (error) throw error;
  
      const ydoc = new Y.Doc();
      const provider = new WebrtcProvider(`note-${noteId}`, ydoc, {
        signaling: ['wss://signaling.yjs.dev'],
      });
  
      set({
        selectedNote: data,
        selectedNoteId: noteId,
        loading: false,
        ydoc,
        provider,
      });
  
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error('Error setting selected note:', err);
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
}));