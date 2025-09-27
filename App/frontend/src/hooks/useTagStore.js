import {useEffect, useState} from "react";
import {supabase} from "@/lib/supabaseClient";

export const useTagStore = () => {
    const [allTags, setAllTags] = useState([]);

    const fetchTags = async () => {
        const { data, error } = await supabase
            .from("tags")
            .select("*")
            .order("name", { ascending: true });

        if (error) {
            console.error("Error fetching tags:", error);
            return;
        }

        setAllTags(data);
    };

    const addTag = async (noteId, tagId = []) => {
        if (!noteId || !tagId) return;

        const { data: existingNoteTags, error: fetchError } = await supabase
            .from("note_tags")
            .select("*")
            .eq("note_id", noteId);

        if (fetchError) {
            console.error("Error fetching current note_tags:", fetchError);
            return null;
        }

        if (existingNoteTags.some((t) => t.tag_id === tagId)) {
            console.log("Tag already added to note");
            return null;
        }

        const { data, error } = await supabase
            .from("note_tags")
            .insert({
            note_id: noteId,
            tag_id: tagId,
        })
            .select();

        if (error) {
            console.error("Error adding tag:", error);
            return null;
        }
        return data;
    };

    const removeTag = async (noteId, tagId) => {
        if (!noteId || !tagId) return;

        const { error } = await supabase
            .from("note_tags")
            .delete()
            .eq("note_id", noteId)
            .eq("tag_id", tagId);

        if (error) {
            console.error("Error removing tag:", error);
            return null;
        }
        return true;
    };

    useEffect(() => {
        fetchTags();
    }, []);

    return { allTags, fetchTags, addTag, removeTag };
};