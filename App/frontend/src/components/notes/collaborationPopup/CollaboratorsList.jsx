import CollaboratorItem from "./CollaboratorItem";
import InvitationItem from "./InvitationItem";
import { useNotesStore } from "@/hooks/useNotesStore";
import { useInvitationsStore } from "@/hooks/useInvitationsStore";

export const CollaboratorsList = ({ 
  isLoading = false 
}) => {
  const { collaborators } = useNotesStore();
  const { invitations } = useInvitationsStore();

  const handleRemoveCollaborator = async (userId) => {
    console.log("Remove collaborator:", userId);
  };

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="text-sm text-gray-500 mt-2">Loading collaborators...</p>
      </div>
    );
  }

  if (collaborators.length === 0 && invitations.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        No collaborators yet
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
          onRemoveCollaborator={handleRemoveCollaborator}
        />
      ))}
    </div>
  );
};

export default CollaboratorsList;