import CollaboratorItem from "./CollaboratorItem";
import InvitationItem from "./InvitationItem";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export const CollaboratorsList = ({ 
  collaborators = [],
  invitations = [],
  isLoading = false 
}) => {
  const { t } = useTranslation();
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
    <div className="space-y-2 max-h-72 overflow-y-auto">
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

CollaboratorsList.propTypes = {
  collaborators: PropTypes.arrayOf(
    PropTypes.shape({
      user_id: PropTypes.string.isRequired,
      username: PropTypes.string,
      role: PropTypes.string,
    })
  ),
  invitations: PropTypes.arrayOf(
    PropTypes.shape({
      invitation_id: PropTypes.string.isRequired,
      recipient_username: PropTypes.string,
      status: PropTypes.string,
    })
  ),
  isLoading: PropTypes.bool,
};

export default CollaboratorsList;