import { useEffect, useCallback, memo } from "react";
import { useTagStore } from "@/hooks/useTagStore";
import { useNotesStore } from "@/hooks/useNotesStore";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export const Tags = memo(({ note }) => {
  const allTags = useTagStore((state) => state.allTags);
  const fetchTags = useTagStore((state) => state.fetchTags);
  const addTag = useTagStore((state) => state.addTag);
  const removeTag = useTagStore((state) => state.removeTag);
  const fetchNoteById = useNotesStore((state) => state.fetchNoteById);
  const { t } = useTranslation();

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleSelectTag = useCallback(async (tagId) => {
    if (!note?.note_id) {
      return;
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
  }, [note?.note_id, note?.note_tags, addTag, removeTag, fetchNoteById]);

  return (
    <div className="flex flex-wrap gap-2">
      {allTags.map((tag) => {
        const isSelected = note.note_tags?.some((t) => t.tag_id === tag.tag_id);
          return (
            <button
              key={tag.tag_id}
              data-cy="noteTag"
              className={`cursor-pointer inline-block text-xs px-3 py-1 rounded-full ${
                isSelected
                  ? "bg-green-200 text-green-800"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => handleSelectTag(tag.tag_id)}
            >
              {t(`tags.${tag.name}`)}
            </button>
          );
      })}
    </div>
  );
});

Tags.propTypes = {
  note: PropTypes.object.isRequired
};