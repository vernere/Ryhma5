import { X, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import PropTypes from 'prop-types';

export const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, noteTitle }) => {
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-96 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {t("popups.deleteConfirm.title")}
                    </h3>
                    <button
                        onClick={onClose}
                        data-cy="closeDeleteConfirm"
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="size-5" />
                    </button>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-center mb-4">
                        <Trash2 className="size-8 text-red-600"/>
                    </div>
                </div>
                <p className="text-center text-gray-700 mb-2">
                    {t("popups.deleteConfirm.message")}
                </p>
                {noteTitle && (
                    <p className="text-center text-sm text-gray-500 mb-6">
                        "{noteTitle}"
                    </p>
                )}
                <div className="flex space-x-3 p-4 m-2">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition"
                    >
                        {t("common.cancel")}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-col"
                    >
                        {t("common.delete")}
                    </button>
                </div>
            </div>
        </div>
    );
};

DeleteConfirmDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    noteTitle: PropTypes.string,
};