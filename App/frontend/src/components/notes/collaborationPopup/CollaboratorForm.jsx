import { useAuth } from "@/hooks/useAuth";
import { useInvitationsStore } from "@/hooks/useInvitationsStore";
import { useNotesStore } from "@/hooks/useNotesStore";
import { UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const CollaboratorForm = () => {
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { selectedNoteId } = useNotesStore();
  const { sendCollaborationInvite, getInvitesByNoteId } = useInvitationsStore();
  const { usernameToId, user } = useAuth();
  const { collaborators } = useNotesStore();
  const { invitations } = useInvitationsStore();
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const handleInvite = async (e) => {
    e.preventDefault();
    setError("");
    const trimmedUsername = username.trim();
    if (!trimmedUsername) return;  

    if (trimmedUsername.toLowerCase() === user?.username?.toLowerCase()) {
      setError(t("popups.collaborationPopup.errors.selfInvite"));
      return;
    }

    const recipientId = await usernameToId(trimmedUsername).catch(err => {
      console.error("Error looking up user:", err);
      setError(t("popups.collaborationPopup.errors.lookupFailed"));
      return null;
    });

    if (!recipientId) {
      setError(t("popups.collaborationPopup.errors.userNotFound", { username: trimmedUsername }));
      return;
    }

    if (invitations?.find(invite => invite.recipient_id === recipientId)) {
      console.log("Invite already sent to:", recipientId);
      setError(t("popups.collaborationPopup.errors.inviteAlreadySent", { username: trimmedUsername }));
      return;
    }

    if (collaborators?.find(c => c.user_id === recipientId)) {
      console.log("Already a collaborator:", recipientId);
      setError(t("popups.collaborationPopup.errors.alreadyCollaborator", { username: trimmedUsername }));
      return;
    }
    
    if (!selectedNoteId) {
      setError(t("popups.collaborationPopup.errors.noNoteSelected"));
      return;
    }
    
    setIsSubmitting(true);
    try {
      await sendCollaborationInvite(user.id, recipientId, selectedNoteId);
      await getInvitesByNoteId(selectedNoteId, user.id);
      setUsername("");
    } catch (error) {
      console.error("Failed to invite user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleInvite} className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t("popups.collaborationPopup.title")}
      </label>
      
      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          <p data-cy="inviteError">
            {error}
          </p>
        </div>
      )}
      
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <UserRoundPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
          <input
            type="text"
            data-cy="addCollaboratorInput"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error) setError("");
            }}
            placeholder={t("popups.collaborationPopup.inviteFieldPlaceholder")}
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors ${
              error 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300'
            }`}
            required
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          data-cy="sendInvite"
          disabled={isSubmitting || !username.trim()}
          className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? t("popups.collaborationPopup.buttons.inviting") : t("popups.collaborationPopup.buttons.invite")}
        </button>
      </div>
    </form>
  );
};

export default CollaboratorForm;