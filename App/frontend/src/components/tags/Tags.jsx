import {useEffect} from "react";
import {useTagStore} from "@/hooks/useTagStore";
import {useNotesStore} from "@/hooks/useNotesStore";


export const Tags = ({note}) => {
    const {allTags, fetchTags, addTag, removeTag,} = useTagStore();
    const {fetchNoteById} = useNotesStore();

    useEffect(() => {
        fetchTags();
    }, [fetchTags]);


    const handleSelectTag = async (tagId) => {

        if (!note?.note_id) {
            return
        }

        const alreadyHasTag = note.note_tags?.some((t) => t.tag_id === tagId);

        try {
            if (alreadyHasTag) {
                await removeTag(note.note_id, tagId);
            } else {
                await addTag(note.note_id, tagId);
            }
            await fetchNoteById(note.note_id);
        } catch (err) {
            console.error("Error updating tag:", err);
        }

    }


    return (<div className="flex flex-wrap gap-2">
        {allTags.map((tag) => {
            const isSelected = note.note_tags?.some((t) => t.tag_id === tag.tag_id);

            return (<span
                key={tag.tag_id}
                data-cy="noteTag"
                className={`cursor-pointer inline-block text-xs px-2 py-1 rounded ${isSelected ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                onClick={() => handleSelectTag(tag.tag_id)}
            >
            {tag.name}
          </span>);
        })}
    </div>);
};
