import { CgFormatBold, CgFormatItalic, CgFormatUnderline, CgList, CgAttachment, CgImage, CgMoreAlt } from "react-icons/cg";


const Toolbar = () => {

    return (
        <div className="flex items-center space-x-4 mt-4">
            <button className="p-2 hover:bg-gray-100 rounded">
                <CgFormatBold className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
                <CgFormatItalic className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
                <CgFormatUnderline className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
                <CgList className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
                <CgAttachment className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
                <CgImage className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
                <CgMoreAlt className="w-4 h-4" />
            </button>
        </div>
    );
};

export { Toolbar };