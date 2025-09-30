import { Toolbar } from "@/components/ui/toolbar";
import { CgNotes } from "react-icons/cg";
import { useNotesStore } from "@/hooks/useNotesStore";
import { useEffect } from "react";
import CollaborativeEditor from "@/components/notes/CollaborativeEditor";
import { Tags } from "@/components/tags/Tags";

const MainContent = () => {
  const { selectedNote, selectedNoteId, fetchNotes, activeUsers, updateNoteTitle, deleteNote } =
    useNotesStore();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b border-gray-200 p-2 flex items-center justify-between">
        {selectedNote ? (
          <div className="flex items-center space-x-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-4">
                <input
                  data-cy="noteTitle" 
                  className="text-xl font-semibold text-gray-900 truncate max-w-2xl border-b focus:outline-none"
                  value={selectedNote.title || ""}
                  onChange={(e) => updateNoteTitle(selectedNoteId, e.target.value)}
                  placeholder="Title…"
                />
                {activeUsers.map((user) => (
                  <span
                    data-cy="userEmail"
                    key={user.user_id}
                    className="text-xs px-2 py-0.5 bg-gray-200 rounded-full"
                  >
                    {user.email}
                  </span>
                ))}
              </div>
              <div className="mt-1 flex items-center space-x-2">
                <span data-cy="noteCreatedAt" className="text-xs text-gray-400">
                  {selectedNote.created_at
                    ? new Date(selectedNote.created_at).toLocaleString()
                    : ""}
                </span>
                <Tags note={selectedNote} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <CgNotes className="text-gray-400 text-2xl" />
            <div className="text-gray-600">
              <div className="font-semibold">No note selected</div>
              <div className="text-sm text-gray-400">
                Select a note from the sidebar to start editing
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          {selectedNote && (
            <>
              <button
                className="px-2 py-1 text-sm border rounded text-red-600 hover:bg-red-50"
                onClick={() => deleteNote(selectedNoteId)}
              >
                Delete
              </button>
            </>
          )}
        </div>
        <Toolbar />
      </div>
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        {selectedNote ? (
          <div className="max-w-4xl mx-auto w-full">
            <CollaborativeEditor Toolbar={Toolbar} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full w-full pr-10">
            <div className="text-center">
              <CgNotes className="text-gray-300 text-4xl mx-auto mb-4" />
              <div className="text-gray-400 text-lg">Select a note to start editing</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;
