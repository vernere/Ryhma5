import { CollaboratorContextBadge } from "./CollaboratorContextBadge";

export const InvitationItem = ({ invite }) => {
  const username = invite.recipient?.username || invite.username || "Unknown";

  return (
    <div 
      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
      data-cy="invitationItem"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-yellow-600 font-medium text-sm">
            {username[0].toUpperCase()}
          </span>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">
            {username}
          </div>
        </div>
      </div>

      <CollaboratorContextBadge role={invite.status} />
    </div>
  );
};

export default InvitationItem;