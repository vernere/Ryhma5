import {
    CgFormatBold,
    CgFormatItalic,
    CgFormatUnderline,
    CgList,
    CgCode,
    CgImage,
    CgMoreAlt,
    CgExport,
} from "react-icons/cg";
import {
    exportToPdf,
    exportToTxt,
    downloadFile,
    exportToMarkDown,
    exportToDocx,
} from "@/utils/exportUtils";
import Dropdown from "./Dropdown";
import { useEffect, useState, useRef } from "react";
import { ImageUploadButton } from "../editor/ImageUploadButton";

const Toolbar = ({ editor, noteTitle = "Untitled note" }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const closeOnClickOutside = (e) => {
            if (isDropdownOpen && !e.target.closest("button")) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("click", closeOnClickOutside);
        return () => document.removeEventListener("click", closeOnClickOutside);
    }, [isDropdownOpen]);

    const handleExport = (format) => {
        const htmlContent = editor.getHTML();
        switch (format) {
            case "pdf":
                exportToPdf(htmlContent);
                break;
            case "txt":
                downloadFile(exportToTxt(htmlContent), noteTitle + ".txt");
                break;
            case "md":
                downloadFile(exportToMarkDown(htmlContent), noteTitle + ".md");
                break;
            case "docx":
                exportToDocx(htmlContent, noteTitle);
            default:
                break;
        }
    };

    const handleClick = (type) => {
        switch (type) {
            case "bold":
                editor.chain().focus().toggleBold().run();
                break;
            case "italic":
                editor.chain().focus().toggleItalic().run();
                break;
            case "underline":
                editor.chain().focus().toggleUnderline().run();
                break;
            case "list":
                editor.chain().focus().toggleBulletList().run();
                break;
            case "code":
                editor.chain().focus().toggleCodeBlock().run();
            default:
                break;
        }
    };

    if (!editor) {
        return null;
    }
    return (
        <div className="flex justify-end mt-4 bg-transparent">
            <div className="flex items-center bg-white px-4 py-0 shadow-sm rounded-full gap-2">
                <button
                    data-cy="boldButton"
                    onClick={() => handleClick("bold")}
                    className={`p-1 hover:bg-gray-100 rounded ${
                        editor.isActive("bold") ? "bg-gray-200" : ""
                    }`}
                >
                    <CgFormatBold className="w-4 h-4" />
                </button>
                <button
                    data-cy="italicButton"
                    onClick={() => handleClick("italic")}
                    className={`p-1 hover:bg-gray-100 rounded ${
                        editor.isActive("italic") ? "bg-gray-200" : ""
                    }`}
                >
                    <CgFormatItalic className="w-4 h-4" />
                </button>
                <button
                    data-cy="underlineButton"
                    onClick={() => handleClick("underline")}
                    className={`p-1 hover:bg-gray-100 rounded ${
                        editor.isActive("Underline") ? "bg-gray-200" : ""
                    }`}
                >
                    <CgFormatUnderline className="w-4 h-4" />
                </button>
                <button
                    data-cy="listButton"
                    onClick={() => handleClick("list")}
                    className={`p-1 hover:bg-gray-100 rounded ${
                        editor.isActive("bulletList") ? "bg-gray-200" : ""
                    }`}
                >
                    <CgList className="w-4 h-4" />
                </button>
                <div className="h-5 w-px bg-gray-300"></div>
                <button
                    data-cy="codeButton"
                    onClick={() => handleClick("code")}
                    className={`p-1 hover:bg-gray-100 rounded ${
                        editor.isActive("codeBlock") ? "bg-gray-200" : ""
                    }`}
                >
                    <CgCode className="w-4 h-4" />
                </button>
                <ImageUploadButton editor={editor} />
                <div className="h-5 w-px bg-gray-300"></div>
                <button
                    data-cy="exportButton"
                    ref={buttonRef}
                    onClick={(e) => {
                        setAnchorEl(buttonRef.current);
                        setIsDropdownOpen(!isDropdownOpen);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                >
                    <CgExport className="w-4 h-4" />
                </button>
                <Dropdown
                    data-cy="dropdownMenu"
                    isOpen={isDropdownOpen}
                    anchorEl={anchorEl}
                    onExport={handleExport}
                    onClose={() => setIsDropdownOpen(false)}
                ></Dropdown>
            </div>
        </div>
    );
};

export { Toolbar };
