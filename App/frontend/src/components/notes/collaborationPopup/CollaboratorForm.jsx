import { useEffect, useState } from "react";
import { UserRoundPlus } from "lucide-react";
import { useNotesStore } from "@/hooks/useNotesStore";
import { useInvitationsStore } from "@/hooks/useInvitationsStore";
import { useAuth } from "@/hooks/useAuth";

export const CollaboratorForm = ({ 
  isSubmitting: externalIsSubmitting = false 
}) => {
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const { selectedNoteId, collaborators} = useNotesStore();
  const { sendCollaborationInvite, getInvitesByNoteId } = useInvitationsStore();
  const { usernameToId, user } = useAuth();

  const submitting = isSubmitting || externalIsSubmitting;

  const handleInvite = async (e) => {
    e.preventDefault();
    setError("");
    const trimmedUsername = username.trim();
    if (!trimmedUsername) return;  

    if (trimmedUsername.toLowerCase() === user?.username?.toLowerCase()) {
      setError("You cannot invite yourself to collaborate");
      return;
    }

    const recipientId = await usernameToId(trimmedUsername).catch(err => {
      console.error("Error looking up user:", err);
      setError("Failed to look up user. Please try again.");
      return null;
    });

    if (!recipientId) {
      setError(`User "${trimmedUsername}" not found`);
      return;
    }

    if (collaborators && collaborators.find(c => c.user_id === recipientId)) {
      console.log("Already a collaborator:", recipientId);
      setError(`"${trimmedUsername}" is already a collaborator on this note`);
      return;
    }
    
    if (!selectedNoteId) {
      setError("No note selected. Please select a note first.");
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
  };  return (
    <form onSubmit={handleInvite} className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Invite Collaborator
      </label>
      
      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}
      
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <UserRoundPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error) setError("");
            }}
            placeholder="Enter username"
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors ${
              error 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300'
            }`}
            required
            disabled={submitting}
          />
        </div>
        <button
          type="submit"
          disabled={submitting || !username.trim()}
          className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Inviting..." : "Invite"}
        </button>
      </div>
    </form>
  );
};

export default CollaboratorForm;