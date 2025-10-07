import { useEffect, useState } from "react";
import { Search, Bell, FilePlus2 } from "lucide-react";
import { Navigation } from "@/components/ui/navigation";
import { useNotesStore } from "@/hooks/useNotesStore";
import { useAuth, useUserRow } from "@/hooks/useAuth";
import { useInvitationsStore } from "@/hooks/useInvitationsStore";
import { InvitePopup } from "./InvitePopup";
import NoteMenuItem from "./NoteMenuItem";
import { useRealtimeStore } from "@/hooks/useRealtimeStore";

const Sidebar = () => {
  const {
    notes,
    searchQuery,
    setSearchQuery,
    setSelectedNote,
    selectedNoteId,
    isFavorite,
    toggleFavorite,
    createNote,
    fetchFavorites,
    fetchNotes,
    setCurrentUser,
    deleteNote
  } = useNotesStore();

  const {
    inbox,
    getInvites
  } = useInvitationsStore();

  const {
    setupNoteCollaboratorSubscription,
    cleanupCollaboratorsSubscription,
    setupInvitesSubscription,
    cleanupInvitesSubscription
  } = useRealtimeStore();

  const { user } = useAuth();
  const { userRow, loadingUserRow } = useUserRow();

  const displayName = loadingUserRow
    ? "…"
    : (userRow?.username || user?.email || "");

  const [isInvitePopupOpen, setIsInvitePopupOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setCurrentUser(user);
      fetchFavorites();
      fetchNotes();
      getInvites(user.id);

      setupInvitesSubscription(user.id);
      setupNoteCollaboratorSubscription(user.id);
    }

    return () => {
      cleanupInvitesSubscription();
      cleanupCollaboratorsSubscription();
    };
  }, [user?.id]);

  const filteredNotes = notes.filter((note) =>
    (note.title || "").toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  const handleCreateNote = async () => {
    const n = await createNote();
    if (n) {
      setSelectedNote(n.note_id);
    }
  };

  const handleSelectNote = async (noteId) => {
    await setSelectedNote(noteId);
    setSearchQuery("");
  };

  const handleToggleFavorite = (noteId) => {
    toggleFavorite(noteId);
  };

  const handleDeleteNote = (noteId) => {
    deleteNote(noteId);
  };

  const toggleInvitePopup = () => {
    setIsInvitePopupOpen(!isInvitePopupOpen);
  };

  return (
    <>
      <div className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-2 border-b border-gray-200 flex items-center justify-between overflow-ellipsis">
          <p data-cy="userEmail" className="text-md font-semibold">{displayName}</p>
          <button
            onClick={toggleInvitePopup}
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
              placeholder="Search notes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full focus:outline-none focus:ring-transparent py-1"
            />
          </div>
          <button className="" onClick={handleCreateNote}>
            <FilePlus2 className="size-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredNotes.map((note) => (
            <NoteMenuItem
              key={note.note_id}
              note={note}
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

      <InvitePopup
        isOpen={isInvitePopupOpen}
        onClose={toggleInvitePopup}
      />
    </>
  );
};

export default Sidebar;