import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from 'prop-types'

const Dropdown = ({ isOpen, anchorEl, onExport, onClose }) => {
    const dropdownRef = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !anchorEl?.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [isOpen, onClose, anchorEl]);

    if (!isOpen) return null;
    const rect = anchorEl?.getBoundingClientRect();

    return (
        <div
            ref={dropdownRef}
            className="fixed bg-white rounded-lg shadow-lg border-gray-200 border z-50"
            style={{
                top: rect ? `${rect.bottom + window.scrollY + 5}px` : '0',
                left: rect ? `${rect.right + window.scrollX - 160}px` : '0',
            }}
        >
            <button
                data-cy='exportPdf'
                onClick={() => {
                    onExport('pdf');
                    onClose();
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg"
            >
                {t('dropdown.export.pdf')}
            </button>
            <div className="h-px w-40 bg-gray-300"></div>
            <button
                data-cy='exportMd'
                onClick={() => {
                    onExport('md');
                    onClose();
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 "
            >
                {t('dropdown.export.md')}
            </button>
            <div className="h-px w-40 bg-gray-300"></div>
            <button
                data-cy='exportTxt'
                onClick={() => {
                    onExport('txt');
                    onClose();
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 "
            >
                {t('dropdown.export.txt')}
            </button>
            <div className="h-px w-40 bg-gray-300"></div>
            <button
                data-cy='exportDocx'
                onClick={() => {
                    onExport('docx');
                    onClose();
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-lg"
            >
                {t('dropdown.export.docx')}
            </button>
        </div>
    )
}

CollaborativeEditor.propTypes = {
    isOpen: PropTypes.object.isRequired,
    anchorEl: PropTypes.object.isRequired,
    onExport: PropTypes.object.isRequired,
    onClose: PropTypes.object.isRequired,
};

export default Dropdown;