import { memo, useCallback } from "react";
import { Trash2, Heart } from "lucide-react";
import PropTypes from 'prop-types';

const NoteMenuItem = memo(({
  noteId,
  title,
  isActive,
  isNoteFavorite,
  onSelectNote,
  onToggleFavorite,
  onDeleteNote,
}) => {
  const handleToggleFavorite = useCallback((e) => {
    e.stopPropagation();
    onToggleFavorite(noteId);
  }, [noteId, onToggleFavorite]);

  const handleDeleteNote = useCallback((e) => {
    e.stopPropagation();
    onDeleteNote(noteId);
  }, [noteId, onDeleteNote]);

  const handleClick = useCallback(() => {
    onSelectNote(noteId);
  }, [noteId, onSelectNote]);

  return (
    <div
      data-cy="noteSelect"
      onClick={handleClick}
      className={`px-4 py-3 cursor-pointer hover:bg-gray-50 flex flex-col space-y-1 border-b border-transparent group ${
        isActive ? "bg-indigo-50 border-indigo-500" : ""
      }`}
    >
      <div className="flex items-center justify-between relative">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            className="p-1 -ml-1"
            onClick={handleToggleFavorite}
            aria-label="Toggle favorite"
            title="Favorite"
          >
            <Heart
              className={`w-4 h-4`}
              fill={isNoteFavorite ? "red": "none"}
              stroke={isNoteFavorite ? "red": "gray"}
            />
          </button>

          <div
            className={`text-sm truncate ${
              isActive ? "font-semibold text-indigo-700" : "text-gray-800"
            }`}
          >
            {title}
          </div>
        </div>

        <div className="opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-in-out flex items-center">
          <button
            type="button"
            data-cy="deleteNote"
            className="cursor-pointer"
            onClick={handleDeleteNote}
            aria-label="Delete note"
            title="Delete note"
          >
            <Trash2 className="size-4 text-red-400 hover:text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
});

NoteMenuItem.propTypes = {
  noteId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  isNoteFavorite: PropTypes.bool.isRequired,
  onSelectNote: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  onDeleteNote: PropTypes.func.isRequired,
};

NoteMenuItem.displayName = "NoteMenuItem";

export default NoteMenuItem;
