import { Search, Bell } from "lucide-react";
import { Navigation } from "@/components/ui/navigation";
import { useNotesStore } from "@/hooks/useNotesStore";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useInvitationsStore } from "@/hooks/useInvitationsStore";
import { InvitePopup } from "./InvitePopup";

const Sidebar = () => {
    const {
        notes,
        searchQuery,
        setSearchQuery,
        setSelectedNote,
        fetchNotes,
        selectedNoteId,
    } = useNotesStore();

    const {
        inbox,
        getInvitations,
        setupInvitesSubscription,
        cleanupInvitesSubscription,
    } = useInvitationsStore();

    const { user } = useAuth();

    const [isInvitePopupOpen, setIsInvitePopupOpen] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    useEffect(() => {
        getInvitations();
        setupInvitesSubscription();
        return () => cleanupInvitesSubscription();
    }, [getInvitations, setupInvitesSubscription, cleanupInvitesSubscription]);

    const filteredNotes = notes.filter((note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAcceptInvite = (invite) => async (e) => {
        e.stopPropagation();
        console.log("Accepting invite:", invite);
    };

    const handleDeclineInvite = (invite) => async (e) => {
        e.stopPropagation();
        console.log("Declining invite:", invite);
    };

    const toggleInvitePopup = () => {
        console.log("Toggling invite popup");
        setIsInvitePopupOpen(!isInvitePopupOpen);
    };

    return (
        <>
            <div className="w-60 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-2 border-b border-gray-200 flex items-center justify-between overflow-ellipsis">
                    <p className="text-md font-semibold">{user.email}</p>
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

                <div className="p-2">
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
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredNotes.map((note) => {
                        const active = selectedNoteId === note.note_id;
                        return (
                            <div
                                data-cy="noteSelect"
                                key={note.note_id}
                                onClick={async () => {
                                    await setSelectedNote(note.note_id);
                                    setSearchQuery("");
                                }}
                                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 flex flex-col space-y-1 border-b border-transparent ${
                                    active
                                        ? "bg-indigo-50 border-l-4 border-indigo-500"
                                        : ""
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div
                                        className={`text-sm truncate ${
                                            active
                                                ? "font-semibold text-indigo-700"
                                                : "text-gray-800"
                                        }`}
                                    >
                                        {note.title}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {new Date(
                                            note.created_at
                                        ).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <Navigation />
            </div>

            {/* Invite Popup */}
            <InvitePopup
                isOpen={isInvitePopupOpen}
                onClose={() => setIsInvitePopupOpen(false)}
                invitations={inbox}
                onAccept={handleAcceptInvite}
                onDecline={handleDeclineInvite}
            />
        </>
    );
};

export default Sidebar;
