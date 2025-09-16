import { CgFormatBold, CgFormatItalic, CgFormatUnderline, CgList, CgAttachment, CgImage, CgMoreAlt, CgExport } from "react-icons/cg";


const Toolbar = ({ editor }) => {
    if (!editor) {
        return null
    }
    return (
        <div className="flex items-center mt-4 bg-white">
            <button
                data-cy='boldButton'
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 hover:bg-gray-100 rounded ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
            >
                <CgFormatBold className="w-4 h-4" />
            </button>
            <button
                data-cy='italicButton'
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 hover:bg-gray-100 rounded ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
            >
                <CgFormatItalic className="w-4 h-4" />
            </button>
            <button
                data-cy='underlineButton'
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 hover:bg-gray-100 rounded ${editor.isActive('Underline') ? 'bg-gray-200' : ''}`}
            >
                <CgFormatUnderline className="w-4 h-4" />
            </button>
            <button
                data-cy='listButton'
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 hover:bg-gray-100 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
            >
                <CgList className="w-4 h-4" />
            </button>
            <div className="h-5 w-px bg-gray-300"></div>
            <button className="p-2 hover:bg-gray-100 rounded">
                <CgAttachment className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
                <CgImage className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
                <CgExport className="w-4 h-4" />
            </button>
            <div className="h-5 w-px bg-gray-300"></div>
            <button className="p-2 hover:bg-gray-100 rounded">
                <CgMoreAlt className="w-4 h-4" />
            </button>
        </div>
    );
};

export { Toolbar };