import React from "react";

const Dropdown = ({ isOpen, anchorEl, onExport, onClose }) => {
    const dropdownRef = React.useRef(null);

    React.useEffect(() => {
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
            className="fixed bg-white rounded-lg shadow-lg border z-50"
            style={{
                top: rect ? `${rect.bottom + window.scrollY + 5}px` : '0',
                left: rect ? `${rect.right + window.scrollX - 20}px` : '0',
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
                Export as pdf
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
                Export as md
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
                Export as txt
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
                Export as docx
            </button>
        </div>

    )
}

export default Dropdown;