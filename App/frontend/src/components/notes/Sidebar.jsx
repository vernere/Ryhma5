import { Navigation } from "@/components/ui/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useInvitationsStore } from "@/hooks/useInvitationsStore";
import { useNotesStore } from "@/hooks/useNotesStore";
import { useRealtimeStore } from "@/hooks/useRealtimeStore";
import { useTagStore } from "@/hooks/useTagStore";
import { Bell, FilePlus2, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { InvitePopup } from "./InvitePopup";
import NoteMenuItem from "./NoteMenuItem";
import { useProfile } from "@/utils/ProfileContext";
import { useTranslation } from "react-i18next";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

const Sidebar = () => {
  const notes = useNotesStore((state) => state.notes);
  const searchQuery = useNotesStore((state) => state.searchQuery);
  const selectedNoteId = useNotesStore((state) => state.selectedNoteId);
  const favs = useNotesStore((state) => state.favs);
  const setSearchQuery = useNotesStore((state) => state.setSearchQuery);
  const setSelectedNote = useNotesStore((state) => state.setSelectedNote);
  const toggleFavorite = useNotesStore((state) => state.toggleFavorite);
  const createNote = useNotesStore((state) => state.createNote);
  const fetchFavorites = useNotesStore((state) => state.fetchFavorites);
  const fetchNotes = useNotesStore((state) => state.fetchNotes);
  const setCurrentUser = useNotesStore((state) => state.setCurrentUser);
  const deleteNote = useNotesStore((state) => state.deleteNote);

  const inbox = useInvitationsStore((state) => state.inbox);
  const getInvites = useInvitationsStore((state) => state.getInvites);

  const setupNoteCollaboratorSubscription = useRealtimeStore((state) => state.setupNoteCollaboratorSubscription);
  const cleanupCollaboratorsSubscription = useRealtimeStore((state) => state.cleanupCollaboratorsSubscription);
  const setupInvitesSubscription = useRealtimeStore((state) => state.setupInvitesSubscription);
  const cleanupInvitesSubscription = useRealtimeStore((state) => state.cleanupInvitesSubscription);

  const getTags = useTagStore((state) => state.getTags);
  const noteTags = useTagStore((state) => state.noteTags);
  const { t } = useTranslation();

  const { profile } = useProfile();
  const { user } = useAuth();
  const [username, setUsername] = useState("");

  const [isInvitePopupOpen, setIsInvitePopupOpen] = useState(false);

  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    noteId: null,
    noteTitle: ""
  });

  useEffect(() => {
    if (user?.id) {
      setCurrentUser(user);
      fetchFavorites();
      fetchNotes();
      getInvites(user.id);
      getTags();
      setupInvitesSubscription(user.id);
      setupNoteCollaboratorSubscription(user.id);
    }

    return () => {
      cleanupInvitesSubscription();
      cleanupCollaboratorsSubscription();
    };
  }, [cleanupCollaboratorsSubscription, cleanupInvitesSubscription, fetchFavorites, fetchNotes, getInvites, getTags, setCurrentUser, setupInvitesSubscription, setupNoteCollaboratorSubscription, user, user.id]);

  const filteredNotes = notes.filter((note) => {
    const query = (searchQuery || "").toLowerCase();

    const inTitle = (note.title || "").toLowerCase().includes(query);

    const tagsForNote = noteTags
      .filter((t) => t.note_id === note.note_id)
      .map((t) => t.tags?.name.toLowerCase());

    const inTags = tagsForNote.some((name) =>
      name.includes(query.toLowerCase()),
    );

    return inTitle || inTags;
  });

  const handleCreateNote = useCallback(async () => {
    const n = await createNote();
    if (n) {
      setSelectedNote(n.note_id);
    }
  }, [createNote, setSelectedNote]);

  const handleSelectNote = useCallback(async (noteId) => {
    await setSelectedNote(noteId);
    setSearchQuery("");
  }, [setSelectedNote, setSearchQuery]);

  const handleToggleFavorite = useCallback((noteId) => {
    toggleFavorite(noteId);
  }, [toggleFavorite]);

  const handleDeleteNote = useCallback((noteId) => {
    const note = notes.find(n => n.note_id === noteId);
    setDeleteConfirmation({
      isOpen: true,
      noteId,
      noteTitle: note?.title || "Untitled"
    });
  }, [notes]);

  const confirmDelete = useCallback(() => {
    if (deleteConfirmation.noteId) {
      deleteNote(deleteConfirmation.noteId);
    }
    setDeleteConfirmation({ isOpen: false, noteId: null, noteTitle: "" });
  }, [deleteConfirmation.noteId, deleteNote])

  const cancelDelete = useCallback(() => {
    setDeleteConfirmation({ isOpen: false, noteId: null, noteTitle: "" })
  })

  const toggleInvitePopup = useCallback(() => {
    setIsInvitePopupOpen(!isInvitePopupOpen);
  }, [isInvitePopupOpen]);

  const isFavorite = useCallback((noteId) => {
    return favs.has(noteId);
  }, [favs]);

  useEffect(() => {
    if (profile?.username) {
      setUsername(profile.username);
    }
  }, [profile?.username]);

  return (
    <>
      <div className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-2 border-b border-gray-200 flex items-center justify-between overflow-ellipsis">
          <p data-cy="username" className="text-lg font-semibold">
            {username}
          </p>
          <button
            onClick={toggleInvitePopup}
            data-cy="inboxButton"
            className="relative p-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Bell className="size-5 text-gray-400 hover:text-gray-600" />
            {inbox.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {inbox.length > 9 ? "9+" : inbox.length}
              </span>
            )}
          </button>
        </div>

        <div className="p-2 flex gap-3">
          <div className="flex justify-center items-center border border-gray-300 rounded-lg gap-2">
            <Search className="size-4 ml-2 text-gray-400" />
            <input
              data-cy="searchInput"
              type="text"
              placeholder={t("notes.sidebar.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full focus:outline-none focus:ring-transparent py-1"
            />
          </div>
          <button className="" data-cy="createNote" onClick={handleCreateNote}>
            <FilePlus2 className="size-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredNotes.map((note) => (
            <NoteMenuItem
              key={note.note_id}
              noteId={note.note_id}
              title={note.title}
              isActive={selectedNoteId === note.note_id}
              isNoteFavorite={isFavorite(note.note_id)}
              onSelectNote={handleSelectNote}
              onToggleFavorite={handleToggleFavorite}
              onDeleteNote={handleDeleteNote}
            />
          ))}
        </div>
        <Navigation />
      </div>

      <InvitePopup isOpen={isInvitePopupOpen} onClose={toggleInvitePopup} />

      <DeleteConfirmDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        noteTitle={deleteConfirmation.noteTitle}
      />
    </>
  );
};

export default Sidebar;
