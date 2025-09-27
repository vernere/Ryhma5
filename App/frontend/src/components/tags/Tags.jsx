import {useTagStore} from "@/hooks/useTagStore";
import {useEffect, useState} from "react";

export const Tags = ({note}) => {
    const {allTags, addTag, removeTag} = useTagStore();
    const [localTags, setLocalTags] = useState(note.note_tags || []);

    useEffect(() => {
        setLocalTags(note.note_tags || []);
    }, [note]);

    const handleSelectTag = async (tagId) => {
        if (!note?.note_id) {
            console.log("Test: no note selected")
            return
        }

        const alreadyHasTag = note.note_tags?.some((t) => t.tag_id === tagId);

        if (alreadyHasTag) {
            console.log("Test: removing tag:", tagId);
            await removeTag(note.note_id, tagId);
            setLocalTags(localTags.filter((t) => t.tag_id !== tagId));
        } else {
            console.log("Test: Adding tag:", tagId);
            await addTag(note.note_id, tagId);
            setLocalTags([...localTags, {tag_id: tagId}]);
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

