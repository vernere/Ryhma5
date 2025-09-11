
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { CgAddR, CgClose, CgHeart, CgNotes } from "react-icons/cg";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Toolbar } from "@/components/ui/Toolbar"
import { Navigation } from "@/components/ui/Navigation"
// [FAVORITES] UUSI
import { supabase } from "@/lib/supabaseClient";
// [FAVORITES] UUSI
import { getFavoritesSet, toggleFavorite } from "@/lib/notesApi";


const NotesPage = () => {
    // Secondary search for searching in specific notes
    // Categories for tagging notes
    // Favorites for flagging notes

    // Notes to be implemented, through a dedicated backend API? dedicated noteProvider or something else.
    const [selectedNote, setSelectedNote] = useState('');
    let [searchParams, setSearchParams] = useSearchParams();
    let [searchQuery, setSearchQuery] = useState('');


    // [FAVORITES] UUSI
    const [uid, setUid] = useState(null);
    // [FAVORITES] UUSI
    const [favs, setFavs] = useState(new Set()); // Set(note_id)


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

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setSearchParams({ search: value })
    }

    useEffect(() => {
        const param = searchParams.get('search') || '';
        setSearchQuery(param);
    }, [searchParams]);

    // [FAVORITES] UUSI
    useEffect(() => {
        (async () => {
            const { data } = await supabase.auth.getUser();
            const user = data?.user;
            if (user) {
                setUid(user.id);
                const favSet = await getFavoritesSet(user.id);
                setFavs(favSet);
            }
        })();
    }, []);


    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Selecting elements in notes
    const selectedNoteObj = notes.find(note => note.note_id === selectedNote);

    const getTagName = () => {
        if (!selectedNoteObj) return "No note selected";

        switch (selectedNoteObj.note_tags.tag_id) {
            case "1":
                return "C++";
            case "2":
                return "Java";
            default:
                return "No tag";
        }
    };

    const tagName = getTagName();

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
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-10 py-2 border border-gray-200 rounder-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />

                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 transfrom -translate-y-1/2 hover:text-gray-600"
                        >
                            <CgClose />
                        </button>
                    )}
                    {/* Dropdown list for search*/}
                    {searchQuery && filteredNotes.length > 0 && (
                        <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto">
                            {filteredNotes.map(note => (
                                <div
                                    key={note.note_id}
                                    onClick={() => {
                                        setSelectedNote(note.note_id);
                                        setSearchQuery('');
                                        setSearchParams({ search: '' });
                                    }}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                >
                                    {note.title}
                                </div>
                            ))}
                        </div>
                    )}

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
                <Navigation />
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
                                {/* Favorite button — TOIMINNALLINEN */}
                                <button
                                    className="p-1 mt-1 hover:bg-gray-300 hover:rounded-lg"
                                    onClick={async (e) => {
                                        e.stopPropagation();         // ei valitse korttia
                                        if (!uid) return;

                                        const isFav = favs.has(note.note_id);
                                        const next = !isFav;

                                        // Optimistinen UI
                                        setFavs(prev => {
                                            const copy = new Set(prev);
                                            if (next) copy.add(note.note_id);
                                            else copy.delete(note.note_id);
                                            return copy;
                                        });

                                        // Kirjoitus kantaan
                                        try {
                                            await toggleFavorite(uid, note.note_id, next);
                                        } catch (err) {
                                            console.error(err);
                                            // Peru UI jos virhe
                                            setFavs(prev => {
                                                const copy = new Set(prev);
                                                if (next) copy.delete(note.note_id);
                                                else copy.add(note.note_id);
                                                return copy;
                                            });
                                        }
                                    }}
                                >
                                    <CgHeart
                                        className={`w-4 h-4 mt-1 flex-shrink-0 ${favs.has(note.note_id) ? "text-red-500" : "text-gray-400"
                                            }`}
                                    />
                                </button>

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
                            <Toolbar />
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
