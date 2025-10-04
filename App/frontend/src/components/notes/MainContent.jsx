import { CgNotes } from "react-icons/cg";
import { useNotesStore } from "@/hooks/useNotesStore";
import { useEffect, useState, useCallback, memo } from "react";
import CollaborativeEditor from "@/components/editor/CollaborativeEditor";
import { Tags } from "@/components/tags/Tags";
import { useAuth } from "@/hooks/useAuth";
import { CollaborationPopup } from "./collaborationPopup/CollaborationPopup";
import { CollaboratorBalls } from "./CollaboratorBalls";
import { UserRoundPlus } from "lucide-react";
import { useInvitationsStore } from "@/hooks/useInvitationsStore";

export const MainContent = () => {
  const selectedNote = useNotesStore((state) => state.selectedNote);
  const selectedNoteId = useNotesStore((state) => state.selectedNoteId);
  const fetchNotes = useNotesStore((state) => state.fetchNotes);
  const updateNoteTitle = useNotesStore((state) => state.updateNoteTitle);
  const collaborators = useNotesStore((state) => state.collaborators);
  const fetchNoteCollaborators = useNotesStore((state) => state.fetchNoteCollaborators);
  const role = useNotesStore((state) => state.role);
  
  const { user } = useAuth();
  const userId = user?.id;
  const getInvitesByNoteId = useInvitationsStore((state) => state.getInvitesByNoteId);
  
  const [isCollaborationPopupOpen, setIsCollaborationPopupOpen] = useState(false);
  const isOwner = role === "owner";

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    if (!selectedNoteId || !userId) return;
    fetchNoteCollaborators(selectedNoteId);
    getInvitesByNoteId(selectedNoteId, userId);
  }, [selectedNoteId, userId, fetchNoteCollaborators, getInvitesByNoteId]);

  const handleTitleChange = useCallback((e) => {
    updateNoteTitle(selectedNoteId, e.target.value);
  }, [selectedNoteId, updateNoteTitle]);

  const handleOpenPopup = useCallback(() => {
    setIsCollaborationPopupOpen(true);
  }, []);

  const handleClosePopup = useCallback(() => {
    setIsCollaborationPopupOpen(false);
  }, []);
  
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
                  onChange={handleTitleChange}
                  placeholder="Title…"
                />

                <div className="flex items-center ml-auto gap-3">
                  {isOwner && (
                    <button onClick={handleOpenPopup}>
                      <UserRoundPlus className="text-gray-400 hover:text-gray-600 size-5 cursor-pointer" />
                    </button>
                  )}

                  <button 
                    className="cursor-pointer"
                    onClick={handleOpenPopup}>
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
      </div>
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        {selectedNote ? (
          <div className="max-w-4xl mx-auto w-full">
            <CollaborativeEditor />
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

      <CollaborationPopup
        isOpen={isCollaborationPopupOpen}
        onClose={handleClosePopup}
        isLoading={false}
      />
    </div>
  );
};

export default MainContent;