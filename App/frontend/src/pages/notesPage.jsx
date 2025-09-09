import { supabase } from "../lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { Navigate, useNavigate } from "react-router";
import { CgAddR, CgClose, CgHeart, CgFormatBold, CgFormatItalic, CgFormatUnderline, CgList, CgAttachment, CgImage, CgMoreAlt, CgNotes } from "react-icons/cg";
import { Search } from "lucide-react";
import { useState } from "react";

const NotesPage = () => {
    const { signOut } = useAuth()
    const navigate = useNavigate();

    // Use state for search or auth provider? Search through backend API or through frontend authprovider. 
    // Alternatively searchProvider?. This search intended for searching all notes. Or search through notes stored locally in a notes array.
    const [searchQuery, setSearchQuery] = useState('');

    // Secondary search for searching in specific notes
    // Categories for tagging notes
    // Favorites for flagging notes

    // Notes to be implemented, through a dedicated backend API? dedicated noteProvider or something else.
    const [selectedNote, setSelectedNote] = useState('');
    const notes = [
        {
            note_id: '1',
            title: "HelloWorld",
            content: "HelloWorld1",
            creator_id: "JariEsimerkki",
            created_at: "25.06.25",
            note_tags: {
                id: "1",
                tag_id: "1",
                note_id: "1",
                tag_name: "C++"
            }

        },
        {
            note_id: '2',
            title: "HelloWorld2",
            content: "HelloWorld3",
            creator_id: "JariEsimerkki",
            created_at: "25.07.25",
            note_tags: {
                id: "2",
                tag_id: "2",
                note_id: "2",
            }
        }
    ];

    const selectedNoteObj = notes.find(note => note.note_id === selectedNote);

    const tagName = "No note selected";
    if (selectedNoteObj) {
        switch (selectedNoteObj.note_tags.tag_id) {
            case "1":
                tagName = "C++"
                break;
            case "2":
                tagName = "Java"
            default:
                break;
        }
    }

    const handleLogout = async () => {
        await signOut();
        navigate("/");
    }

    return (
        <div className="flex h-screen bg-secondary">
            {/* Sidebar */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                {/* Header and tools for adding notes */}
                <div className=" p-4 border-b border-gray-200 flex flex-row space-x-2">
                    <h1 className="text-lg font-medium">All notes</h1>
                    {/* New note button */}
                    <button className="p-1 mt-1 hover:bg-gray-300 hover:rounded-lg"><CgAddR /></button>
                </div>
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h4" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 border border-gray-200 rounder-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    {/* Remove search */}
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-gray-600"
                        >
                            <CgClose />
                        </button>
                    )}
                </div>
                {/* Navigation */}
                <div className=" px-4 py-3 border-b border-gray-200">
                    <div className="space-y-2">
                        <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
                            Search
                        </button>
                        <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
                            Tags
                        </button>
                        <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
                            Favorites
                        </button>
                        <Button className={"w-20"} onClick={handleLogout}>Logout</Button>
                    </div>
                </div>
                {/* Notes list */}
                <div className="flex-1 overflow-y-auto">
                    {notes.map((note) => (
                        <div
                            key={note.note_id}
                            onClick={() => setSelectedNote(note.note_id)}
                            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${selectedNote === note.note_id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                }`}
                        >
                            <div className="flex imtesms-start space-x-3">
                                {/* Favorite button */}
                                <button className="p-1 mt-1 hover:bg-gray-300 hover:rounded-lg"><CgHeart className="w-4 h-4 mt-1 flex-shrink-0" /></button>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium">
                                            {note.title}
                                        </h3>
                                        <span className="text-xs">
                                            {note.created_at}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs line-clamp-2">
                                        {/* Max 20 chars ? */}
                                        {note.content}
                                    </p>
                                </div>
                            </div>
                        </div>

                    ))}

                </div>
            </div>
            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Note Header */}
                <div className="bg-white border-b border-gray-200 p-4">
                    {selectedNoteObj ? (
                        <>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-lg font-semibold ">{selectedNoteObj.title}</h1>
                                    <span className="inline-block bg-gray-100 text-xs px-2 py-1 rounded mt-1">
                                        {tagName}
                                    </span>
                                </div>
                            </div>
                            {/* Toolbar */}
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
                        </>
                    ) : null}
                </div>
                {/* Note Content */}
                <div className="flex-1 p-6 overflow-y-auto bg-white">
                    {selectedNoteObj ? (
                        selectedNoteObj.content
                    ) : (
                        <div className="flex items-center justify-center h-full w-full pr-10">
                            <CgNotes className="text-gray-400 size-6 m-4" />
                            <span className="text-gray-400 text-lg">Select a note to start editing</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotesPage;
