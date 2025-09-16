import { Search } from "lucide-react";
import { Navigation } from "@/components/ui/navigation";
import { useNotesStore } from "@/hooks/useNotesStore";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const Sidebar = () => {
    const {
        notes,
        searchQuery,
        setSearchQuery,
        setSelectedNote,
        fetchNotes,
        selectedNoteId,
    } = useNotesStore();

    const { user } = useAuth();

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const filteredNotes = notes.filter((note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-60 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-2 border-b border-gray-200 flex items-center justify-between">
                <h1 className="text-lg font-semibold">{user.email}</h1>
            </div>

            <div className="p-2">
                <div className="flex justify-center items-center border border-gray-300 rounded-lg gap-2">
                    <Search className="size-4 ml-2 text-gray-400" />
                    <input
                        data-cy="searchInput"
                        type="text"
                        placeholder="Search notes"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full focus:outline-none focus:ring-transparent py-1"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {filteredNotes.map((note) => {
                    const active = selectedNoteId === note.note_id;
                    return (
                        <div
                            data-cy="noteSelect"
                            key={note.note_id}
                            onClick={async () => {
                                await setSelectedNote(note.note_id);
                                setSearchQuery("");
                            }}
                            className={`px-4 py-3 cursor-pointer hover:bg-gray-50 flex flex-col space-y-1 border-b border-transparent ${
                                active ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className={`text-sm truncate ${active ? 'font-semibold text-indigo-700' : 'text-gray-800'}`}>
                                    {note.title}
                                </div>
                                <div className="text-xs text-gray-400">
                                    {new Date(note.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Navigation />
        </div>
    );
};

export default Sidebar;
