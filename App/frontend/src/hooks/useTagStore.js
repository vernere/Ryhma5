import {create} from "zustand";
import {supabase} from "@/lib/supabaseClient";

export const useTagStore = create((set, get) => ({
    allTags: [], loading: false, error: null,

    fetchTags: async () => {
        set({loading: true, error: null});
        try {
            const {data, error} = await supabase
                .from("tags")
                .select("*")
                .order("name", {ascending: true});

            if (error) throw error;
            set({allTags: data || [], loading: false});
        } catch (err) {
            set({error: err.message, loading: false});
        }
    },

    addTag: async (noteId, tagId) => {
        if (!noteId || !tagId) return;

        try {
            const {data: existingNoteTags, error: fetchError} = await supabase
                .from("note_tags")
                .select("*")
                .eq("note_id", noteId);

            if (fetchError) throw fetchError;

            if (existingNoteTags.some((t) => t.tag_id === tagId)) {
                return null;
            }

            const {data, error} = await supabase
                .from("note_tags")
                .insert({
                    note_id: noteId, tag_id: tagId,
                })
                .select();

            if (error) throw error;
            return data;
        } catch (error) {
            set({error: error.message});
            throw error;
        }
    },

    removeTag: async (noteId, tagId) => {
        if (!noteId || !tagId) return;

        try {
            const {error} = await supabase
                .from("note_tags")
                .delete()
                .eq("note_id", noteId)
                .eq("tag_id", tagId);

            if (error) throw error;
            return true;
        } catch (error) {
            set({error: error.message});
            throw error;
        }
    },

    init: () => {
        get().fetchTags();
    }
}));

useTagStore.getState().init();