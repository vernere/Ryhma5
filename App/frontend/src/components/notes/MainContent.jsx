import { CgNotes } from "react-icons/cg";
import { useNotesStore } from "@/hooks/useNotesStore";
import { useEffect } from "react";
import CollaborativeEditor from "@/components/notes/CollaborativeEditor";
import { Tags } from "@/components/tags/Tags";

const MainContent = () => {
  const { selectedNote, selectedNoteId, fetchNotes, activeUsers, updateNoteTitle, deleteNote } =
    useNotesStore();
import { useInvitationsStore } from "@/hooks/useInvitationsStore";
import { useState } from "react";
import { CollaboratorBalls } from "./CollaboratorBalls";
import { UserRoundPlus } from "lucide-react";
import CollaborationPopup from "./collaborationPopup/CollaborationPopup";
import { useAuth } from "@/hooks/useAuth";
import { Toolbar } from "@/components/ui/toolbar";

export const MainContent = () => {
  const {
    selectedNote,
    selectedNoteId,
    fetchNotes,
    updateNoteTitle,
    collaborators,
    fetchNoteCollaborators,
    role
  } = useNotesStore();
  const { user } = useAuth();
  const { getInvitesByNoteId } = useInvitationsStore();
  
  const [isCollaborationPopupOpen, setIsCollaborationPopupOpen] = useState(false);
  const isOwner = role === "owner";

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const getTagName = (note) => {
    if (!note || !note.note_tags) return "No tag";
    const tagObj = Array.isArray(note.note_tags)
      ? note.note_tags[0]
      : note.note_tags;
    if (!tagObj) return "No tag";
    const tagName =
      tagObj.tags?.name ||
      tagObj.tags?.[0]?.name ||
      tagObj.tag_name ||
      tagObj.name;
    return tagName || "No tag";
  };

  const tagName = getTagName(selectedNote);




  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b border-gray-200 p-2 flex items-center justify-between">
        {selectedNote ? (
          <div className="flex items-center space-x-4 w-full">
            <div className="flex flex-col w-full">
              <div className="flex items-center gap-4 w-full">
                <input
                  data-cy="noteTitle"
                  className="text-lg focus:outline-none"
                  value={selectedNote.title || ""}
                  onChange={(e) => updateNoteTitle(selectedNoteId, e.target.value)}
                  placeholder="Title…"
                />

                <div className="flex items-center ml-auto gap-3">
                  <button onClick={() => setIsCollaborationPopupOpen(true)}>
                    {isOwner && (<UserRoundPlus className="text-gray-400 hover:text-gray-600 size-5 cursor-pointer" />)}
                  </button>

                  <button 
                    className="cursor-pointer"
                    onClick={() => setIsCollaborationPopupOpen(true)}>
                    <CollaboratorBalls users={collaborators} />
                  </button>
                </div>
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

        <Toolbar />
      </div>

      <CollaborationPopup
        isOpen={isCollaborationPopupOpen}
        onClose={() => setIsCollaborationPopupOpen(false)}
        isLoading={false}
      />
    </div>
  );
};

export default MainContent;

