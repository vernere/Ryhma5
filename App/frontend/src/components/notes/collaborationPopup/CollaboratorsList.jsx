import CollaboratorItem from "./CollaboratorItem";
import InvitationItem from "./InvitationItem";

export const CollaboratorsList = ({ 
  collaborators = [],
  invitations = [],
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="text-sm text-gray-500 mt-2">{t("popups.collaborationPopup.loadingCollaborators")}</p>
      </div>
    );
  }

  if (collaborators.length === 0 && invitations.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        {t("popups.collaborationPopup.noCollaborators")}
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-40 overflow-y-auto">
      {collaborators.map((collaborator) => (
        <CollaboratorItem
          key={collaborator.user_id || collaborator.id}
          collaborator={collaborator}
        />
      ))}
      {invitations.map((invite) => (
        <InvitationItem
          key={invite.invitation_id}
          invite={invite}
        />
      ))}
    </div>
  );
};

export default CollaboratorsList;