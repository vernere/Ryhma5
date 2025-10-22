import { CgNotes } from "react-icons/cg";
import { useNotesStore } from "@/hooks/useNotesStore";
import { useEffect, useState, useCallback, useRef } from "react";
import CollaborativeEditor from "@/components/editor/CollaborativeEditor";
import { Tags } from "@/components/tags/Tags";
import { useAuth } from "@/hooks/useAuth";
import { CollaborationPopup } from "./collaborationPopup/CollaborationPopup";
import { CollaboratorBalls } from "./CollaboratorBalls";
import { UserRoundPlus } from "lucide-react";
import { useInvitationsStore } from "@/hooks/useInvitationsStore";
import { useMemo } from "react";
import * as Y from "yjs";
import { supabase } from "@/lib/supabaseClient";
import { SupabaseProvider } from "@/lib/y-supabase";
import { Toolbar } from "../ui/toolbar";
import { useTranslation } from "react-i18next";

export const MainContent = () => {
  const selectedNote = useNotesStore((state) => state.selectedNote);
  const selectedNoteId = useNotesStore((state) => state.selectedNoteId);
  const collaborators = useNotesStore((state) => state.collaborators);
  const role = useNotesStore((state) => state.role);
  const updateNoteTitle = useNotesStore((state) => state.updateNoteTitle);
  const fetchNoteCollaborators = useNotesStore((state) => state.fetchNoteCollaborators);
  const getInvitesByNoteId = useInvitationsStore((state) => state.getInvitesByNoteId);

  const { t } = useTranslation();
  const { user } = useAuth();
  const userId = user?.id;
  const isOwner = role === "owner";
  
  const lastFetchedNoteId = useRef(null);
  const [isCollaborationPopupOpen, setIsCollaborationPopupOpen] = useState(false);
  const [isProviderReady, setIsProviderReady] = useState(false);

  useEffect(() => {
    if (!selectedNoteId || !userId) return;
    
    if (lastFetchedNoteId.current === selectedNoteId) return;
    lastFetchedNoteId.current = selectedNoteId;
    
    fetchNoteCollaborators(selectedNoteId);
    getInvitesByNoteId(selectedNoteId, userId);
  }, [selectedNoteId, userId, fetchNoteCollaborators, getInvitesByNoteId]);

  const handleTitleChange = useCallback((e) => {
    if (!selectedNoteId) return;
    updateNoteTitle(selectedNoteId, e.target.value);
  }, [selectedNoteId, updateNoteTitle]);

  const handleOpenPopup = useCallback(() => {
    setIsCollaborationPopupOpen(true);
  }, []);

  const handleClosePopup = useCallback(() => {
    setIsCollaborationPopupOpen(false);
  }, []);

  const { ydoc, provider } = useMemo(() => {
    if (!selectedNoteId) return { ydoc: null, provider: null };

    const doc = new Y.Doc();
    const channelName = `note-yjs-${selectedNoteId}`;
    const prov = new SupabaseProvider(doc, supabase, {
      channel: channelName,
      id: selectedNoteId,
      idName: "note_id",
      tableName: "notes",
      columnName: "content",
    });

    prov.on("synced", () => {
      console.log("🔄 Provider synced, ready to create editor");
    });

    return { ydoc: doc, provider: prov };
  }, [selectedNoteId]);

  useEffect(() => {
    if (!provider) return;

    const handleSynced = () => {
      console.log("✅ Supabase provider synced");
      setIsProviderReady(true);
    };

    const handleError = (error) => {
      console.error("❌ Supabase provider error:", error);
    };

    provider.on("synced", handleSynced);
    provider.on("error", handleError);

    return () => {
      provider.off("synced", handleSynced);
      provider.off("error", handleError);
      setIsProviderReady(false);
    };
  }, [provider]);

  useEffect(() => {
    return () => {
      if (provider) {
        console.log("🧹 Cleaning up provider");
        provider.destroy();
      }
      if (ydoc) {
        console.log("🧹 Destroying Y.Doc");
        ydoc.destroy();
      }
    };
  }, [selectedNoteId]);

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b border-gray-200 p-2 flex items-center justify-between">
        {selectedNote ? (
          <div className="flex items-center space-x-4 w-full">
            <div className="flex flex-col w-full">
              <div className="flex items-center gap-4 w-full">
                <input
                  data-cy="noteTitle"
                  className="text-lg focus:outline-none max-w-fit w-32 overflow-ellipsis"
                  value={selectedNote.title || ""}
                  onChange={handleTitleChange}
                  placeholder="Title…"
                />
                
                <div className="flex items-center ml-auto gap-3">
                <Tags note={selectedNote} />
                  {isOwner && (
                    <button 
                    onClick={handleOpenPopup}
                    >
                      <UserRoundPlus className="text-gray-400 hover:text-gray-600 size-5 cursor-pointer" />
                    </button>
                  )}

                  <button 
                    className="cursor-pointer"
                    data-cy="openCollaborationPopup"
                    onClick={handleOpenPopup}>
                    <CollaboratorBalls users={collaborators} />
                  </button>
                </div>
              </div>
              <Toolbar />
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <CgNotes className="text-gray-400 text-2xl" />
            <div className="text-gray-600">
              <div className="font-semibold">{t("notes.mainContent.noNoteSelected")}</div>
              <div className="text-sm text-gray-400">
                {t("notes.mainContent.selectNotePrompt")}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        {selectedNote ? (
          <div className="max-w-4xl mx-auto w-full">
            {isProviderReady ? (
              <CollaborativeEditor provider={provider} ydoc={ydoc} />
            ) : (
              <div className="p-4 text-gray-500">Connecting...</div>
            )}
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