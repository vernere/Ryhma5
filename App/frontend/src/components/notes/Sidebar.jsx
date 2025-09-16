import { useEffect } from "react";
import { Search } from "lucide-react";
import { CgHeart } from "react-icons/cg";
import { Navigation } from "@/components/ui/Navigation";
import { useNotesStore } from "@/hooks/useNotesStore";
import { useAuth } from "@/hooks/useAuth";

const Sidebar = () => {
  const {
    notes,
    searchQuery,
    setSearchQuery,
    setSelectedNote,
    selectedNoteId,
    isFavorite,
    toggleFavorite,
    createNote,
    fetchFavouriteNotes,
  } = useNotesStore();

  const { user } = useAuth();

   useEffect(() => {
     fetchFavouriteNotes();
   }, [fetchFavouriteNotes]);


  const filteredNotes = notes.filter((note) =>
    (note.title || "").toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  return (
    <div className="w-60 bg-white border-r border-gray-200 flex flex-col">
      {/* header */}
      <div className="p-2 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-lg font-semibold">{user?.email}</h1>
        <button
          className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
          onClick={async () => {
            const n = await createNote();
            if (n) {
              // valinta tehdään store-createNotessa jo,
              // mutta tämä varmistaa scroll/UX tilanteissa
              setSelectedNote(n.note_id);
            }
          }}
        >
          + New
        </button>
      </div>

      {/* search */}
      <div className="p-2">
        <div className="flex justify-center items-center border border-gray-300 rounded-lg gap-2">
          <Search className="size-4 ml-2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full focus:outline-none focus:ring-transparent py-1"
          />
        </div>

        {searchQuery && filteredNotes.length > 0 && (
          <div className="mt-2 bg-white border border-gray-200 rounded shadow max-h-60 overflow-y-auto">
            {filteredNotes.map((note) => (
              <div
                key={note.note_id}
                onClick={async () => {
                  await setSelectedNote(note.note_id);
                  setSearchQuery("");
                }}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-50 flex flex-col space-y-1 ${
                  selectedNoteId === note.note_id
                    ? "bg-indigo-50 border-l-4 border-indigo-500"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* heart */}
                    <button
                      className="p-1 -ml-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(note.note_id);
                      }}
                      aria-label="Toggle favorite"
                      title="Favorite"
                    >
                      <CgHeart
                        className={`w-4 h-4 ${
                          isFavorite(note.note_id)
                            ? "text-red-500"
                            : "text-gray-300"
                        }`}
                      />
                    </button>

                    <span
                      className={`text-sm ${
                        selectedNoteId === note.note_id
                          ? "font-semibold text-indigo-700"
                          : "font-medium text-gray-800"
                      }`}
                    >
                      {note.title}
                    </span>
                  </div>

                  <span className="text-xs text-gray-400">
                    {note.created_at
                      ? new Date(note.created_at).toLocaleDateString()
                      : ""}
                  </span>
                </div>

                <div className="text-xs text-gray-500 truncate">
                  {note.content ? note.content.replace(/\n/g, " ") : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* list */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotes.map((note) => {
          const active = selectedNoteId === note.note_id;
          return (
            <div
              key={note.note_id}
              onClick={async () => {
                await setSelectedNote(note.note_id);
                setSearchQuery("");
              }}
              className={`px-4 py-3 cursor-pointer hover:bg-gray-50 flex flex-col space-y-1 border-b border-transparent ${
                active ? "bg-indigo-50 border-l-4 border-indigo-500" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    className="p-1 -ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(note.note_id);
                    }}
                    aria-label="Toggle favorite"
                    title="Favorite"
                  >
                    <CgHeart
                      className={`w-4 h-4 ${
                        isFavorite(note.note_id)
                          ? "text-red-500"
                          : "text-gray-300"
                      }`}
                    />
                  </button>

                  <div
                    className={`text-sm truncate ${
                      active ? "font-semibold text-indigo-700" : "text-gray-800"
                    }`}
                  >
                    {note.title}
                  </div>
                </div>

                <div className="text-xs text-gray-400">
                  {note.created_at
                    ? new Date(note.created_at).toLocaleDateString()
                    : ""}
                </div>
              </div>

              <div className="text-xs text-gray-500 truncate">
                {note.content ? note.content.replace(/\n/g, " ") : ""}
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

