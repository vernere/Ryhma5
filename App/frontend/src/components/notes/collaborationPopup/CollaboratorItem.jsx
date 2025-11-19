import { CollaboratorContextBadge } from "./CollaboratorContextBadge";
import { Trash2 } from "lucide-react";
import { useNotesStore } from "@/hooks/useNotesStore";
import PropTypes from 'prop-types';

export const CollaboratorItem = ({ collaborator }) => {
  const { removeCollaborator, selectedNoteId } = useNotesStore();
  const isOwner = collaborator?.role === "owner";

  const handleRemoveCollaborator = (collaborator) => async (e) => {
    e.stopPropagation();
    console.log("Removing collaborator:", collaborator);
    if (!collaborator || !collaborator.user_id || !selectedNoteId) return;
    removeCollaborator(selectedNoteId, collaborator.user_id);
  };

  return (
    <div 
      data-cy="collaboratorItem"
      className="flex items-center p-2 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
          <span className="text-indigo-600 font-medium text-sm">
            {(collaborator.username || "?")[0].toUpperCase()}
          </span>
        </div>
        <div>
          <div 
            data-cy="collaboratorUsername"
            className="text-sm font-medium text-gray-900">
            {collaborator.username || "Unknown"}
          </div>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <CollaboratorContextBadge role={collaborator.role} />
        {!isOwner && (
          <button
            data-cy="removeCollaborator"
            className="cursor-pointer"
            onClick={handleRemoveCollaborator(collaborator)}
            aria-label="Remove collaborator"
            title="Remove collaborator"
          >
            <Trash2 className="size-4 text-red-400 hover:text-red-600" />
          </button>
        )}
      </div>
    </div>
  );
};

CollaboratorItem.propTypes = {
  collaborator: PropTypes.shape({
    user_id: PropTypes.string.isRequired,
    username: PropTypes.string,
    role: PropTypes.string.isRequired,
  }).isRequired,
};

export default CollaboratorItem;