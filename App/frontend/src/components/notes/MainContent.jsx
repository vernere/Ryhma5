import { Toolbar } from "@/components/ui/Toolbar";
import { CgNotes } from "react-icons/cg";
import { useNotesStore } from "@/hooks/useNotesStore";
import { useEffect } from "react";

const MainContent = () => {
    const { selectedNote, fetchNotes } = useNotesStore();

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const getTagName = (note) => {
        if (!note || !note.note_tags) return "No tag";

        const tagObj = Array.isArray(note.note_tags)
            ? note.note_tags[0]
            : note.note_tags;

        if (!tagObj) return "No tag";

        const tagName =
            tagObj.tags?.name ||
            tagObj.tags?.[0]?.name ||
            tagObj.tag_name ||
            tagObj.name;
        return tagName || "No tag";
    };

    const tagName = getTagName(selectedNote);

    return (
        <div className="flex-1 flex flex-col">
            <div className="bg-white border-b border-gray-200 p-2 flex items-center justify-between">
                {selectedNote ? (
                    <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                            <h1 className="text-xl font-semibold text-gray-900 truncate max-w-2xl">
                                {selectedNote.title}
                            </h1>
                            <div className="mt-1 flex items-center space-x-2">
                                <span className="inline-block bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded">
                                    {tagName}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {selectedNote.created_at
                                        ? new Date(
                                              selectedNote.created_at
                                          ).toLocaleString()
                                        : ""}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center space-x-3">
                        <CgNotes className="text-gray-400 text-2xl" />
                        <div className="text-gray-600">
                            <div className="font-semibold">
                                No note selected
                            </div>
                            <div className="text-sm text-gray-400">
                                Select a note from the sidebar to start editing
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <Toolbar />
                </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                {selectedNote ? (
                    <div className="max-w-4xl mx-auto w-full">
                        <div
                            className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
                            aria-live="polite"
                        >
                            <div className="mb-4 text-sm text-gray-500">
                                Editor
                            </div>

                            <div
                                className="prose max-w-none text-gray-800"
                                style={{ minHeight: "60vh" }}
                            >
                                {selectedNote.content || (
                                    <span className="text-gray-400">
                                        (Empty note)
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full w-full pr-10">
                        <div className="text-center">
                            <CgNotes className="text-gray-300 text-4xl mx-auto mb-4" />
                            <div className="text-gray-400 text-lg">
                                Select a note to start editing
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MainContent;
