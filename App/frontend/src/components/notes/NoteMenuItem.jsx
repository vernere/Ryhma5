import { memo, useCallback } from "react";
import { CgHeart } from "react-icons/cg";
import { Trash2 } from "lucide-react";

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
            className="p-1 -ml-1"
            onClick={handleToggleFavorite}
            aria-label="Toggle favorite"
            title="Favorite"
          >
            <CgHeart
              className={`w-4 h-4 ${
                isNoteFavorite ? "text-red-500" : "text-gray-300"
              }`}
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

        <div className="opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-in-out">
          <button
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

NoteMenuItem.displayName = "NoteMenuItem";

export default NoteMenuItem;
