import { X, Bell } from "lucide-react";
import { useInvitationsStore } from "@/hooks/useInvitationsStore";
import { useNotesStore } from "@/hooks/useNotesStore";
import { useAuth } from "@/hooks/useAuth";

export const InvitePopup = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    const { user } = useAuth();
    const { inbox, setStatus, getInvites } = useInvitationsStore();
    const { fetchNotes } = useNotesStore();

    const handleAcceptInvite = (invite) => async (e) => {
        await setStatus(invite.invitation_id, "accepted");
        await getInvites(user.id);
        await fetchNotes();
    };

    const handleDeclineInvite = (invite) => async (e) => {
        await setStatus(invite.invitation_id, "declined");
        await getInvites(user.id);
        await fetchNotes();
    };

    return (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-96 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Invitations ({inbox.length})
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="max-h-80 overflow-y-auto">
                    {inbox.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            <Bell className="size-8 mx-auto mb-2 text-gray-300" />
                            <p>No new invitations</p>
                        </div>
                    ) : (
                        <div className="p-4 space-y-3">
                            {inbox.map((inv) => (
                                <div
                                    key={inv.invitation_id}
                                    className="p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <div className="text-sm font-medium text-gray-900 mb-1">
                                        {inv.sender?.username || 'Someone'} invited you to a note
                                    </div>
                                    <div className="text-xs text-gray-500 mb-3">
                                        {new Date(
                                            inv.created_at
                                        ).toLocaleDateString()}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            data-cy="acceptInvite"
                                            className="flex-1 bg-green-500 text-white text-xs py-2 px-3 rounded hover:bg-green-600 transition-colors font-medium"
                                            onClick={(e) => handleAcceptInvite(inv)(e)}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            data-cy="declineInvite"
                                            className="flex-1 bg-red-500 text-white text-xs py-2 px-3 rounded hover:bg-red-600 transition-colors font-medium"
                                            onClick={(e) => handleDeclineInvite(inv)(e)}
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
