import React from 'react';
import { cn } from "cn-func";
import { useTranslation } from "react-i18next";
import PropTypes from 'prop-types';

const context = {
    owner:   { bg: 'bg-green-100', text: 'text-green-700' },
    editor:  { bg: 'bg-purple-100', text: 'text-purple-700' },
    viewer:  { bg: 'bg-gray-100', text: 'text-gray-700' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    declined: { bg: 'bg-red-100', text: 'text-red-700' },
};

export const CollaboratorContextBadge = ({role}) => {
    const { t } = useTranslation();
    const roleContext = context[role] ?? { bg: 'bg-red-300', text: 'text-red-700' };

    return (
        <div
            className={cn(
                roleContext.bg,
                roleContext.text,
                "text-xs font-medium px-3 py-1 rounded-full"
            )}
        >
            {t(`common.roles.${role}`)}
        </div>
    );
};

CollaboratorContextBadge.propTypes = {
    role: PropTypes.string.isRequired,
};

export default CollaboratorContextBadge;
