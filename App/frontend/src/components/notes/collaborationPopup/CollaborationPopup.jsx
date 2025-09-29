import { useEffect, useState } from "react";
import { X, UserRoundPlus } from "lucide-react";
import CollaboratorForm from "./CollaboratorForm";
import CollaboratorsList from "./CollaboratorsList";
import { useNotesStore } from "@/hooks/useNotesStore";
import { useInvitationsStore } from "@/hooks/useInvitationsStore";

export const CollaborationPopup = ({ 
  isOpen, 
  onClose,
  isLoading = false 
}) => {
  const { role } = useNotesStore();
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
            {isOwner ? "Manage Collaborators" : "View Collaborators"}
          </h3>
          <button
            onClick={onClose}
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
              Current Collaborators
            </h4>
            <CollaboratorsList 
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationPopup;