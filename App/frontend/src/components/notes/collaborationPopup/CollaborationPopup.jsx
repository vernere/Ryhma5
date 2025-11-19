import { useNotesStore } from "@/hooks/useNotesStore";
import { UserRoundPlus, X } from "lucide-react";
import CollaboratorForm from "./CollaboratorForm";
import CollaboratorsList from "./CollaboratorsList";
import { useInvitationsStore } from "@/hooks/useInvitationsStore";
import { useTranslation } from "react-i18next";
import PropTypes from 'prop-types';

export const CollaborationPopup = ({ 
  isOpen, 
  onClose,
  isLoading = false 
}) => {
  const { role } = useNotesStore();
  const { collaborators } = useNotesStore();
  const { invitations } = useInvitationsStore();
  const { t } = useTranslation();
  const isOwner = role === "owner";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-60">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-96 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            {isOwner && (
              <UserRoundPlus className="size-5" />
            )}
            {isOwner ? t("popups.collaborationPopup.manageCollaborators") : t("popups.collaborationPopup.viewCollaborators")}
          </h3>
          <button
            onClick={onClose}
            data-cy="closeCollaborationPopup"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-4">
          {isOwner && (
            <CollaboratorForm />
          )}

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              {t("popups.collaborationPopup.currentCollaborators")}
            </h4>
            <CollaboratorsList
              collaborators={collaborators}
              invitations={invitations}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

CollaborationPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default CollaborationPopup;