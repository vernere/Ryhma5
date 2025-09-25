import React from 'react';
import { cn } from "cn-func";

const context = {
    owner:   { bg: 'bg-green-100', text: 'text-green-700', label: 'Owner' },
    editor:  { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Editor' },
    viewer:  { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Viewer' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
    declined: { bg: 'bg-red-100', text: 'text-red-700', label: 'Declined' },
};

export const CollaboratorContextBadge = ({role}) => {
    const roleContext = context[role] ?? { bg: 'bg-red-300', text: 'text-red-700', label: 'Unknown' };

    return (
        <div
            className={cn(
                roleContext.bg,
                roleContext.text,
                "text-xs font-medium px-3 py-1 rounded-full"
            )}
        >
            {roleContext.label}
        </div>
    );
};

export default CollaboratorContextBadge;
