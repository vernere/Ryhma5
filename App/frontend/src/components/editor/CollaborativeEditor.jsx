import { Toolbar } from "@/components/ui/toolbar";
import { useNotesStore } from "@/hooks/useNotesStore";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { EditorContent, useEditor } from "@tiptap/react";
import { COLORS, EDITOR_EXTENSIONS } from "./constants";
import { useEffect } from "react";
import { useProfile } from "@/utils/ProfileContext";

export default function CollaborativeEditor({ ydoc, provider }) {
    const selectedNoteId = useNotesStore((state) => state.selectedNoteId);
    const noteTitle = useNotesStore((state) => state.selectedNote?.title);
    const { profile } = useProfile();

    const editor = useEditor(
        {
            editorProps: {
                attributes: {
                    class: "prose max-w-none focus:outline-none min-h-[400px] p-4",
                },
            },
            autofocus: "end",
            enableContentCheck: true,
            onContentError: ({ disableCollaboration }) => {
                disableCollaboration();
            },
            extensions: [
                ...EDITOR_EXTENSIONS,
                Collaboration.configure({
                    document: ydoc,
                }),
                CollaborationCaret.configure({
                    provider,
                    user: {
                        name: profile?.username || "Unknown",
                        color: COLORS[
                            Math.floor(Math.random() * COLORS.length)
                        ],
                    },
                    render: (user) => {
                        const cursor = document.createElement("span");
                        cursor.classList.add("collaboration-carets__caret");
                        cursor.setAttribute(
                            "style",
                            `border-color: ${user.color}`
                        );

                        const label = document.createElement("div");
                        label.classList.add("collaboration-carets__label");
                        label.setAttribute(
                            "style",
                            `background-color: ${user.color}`
                        );
                        label.insertBefore(
                            document.createTextNode(user.name),
                            null
                        );

                        cursor.insertBefore(label, null);
                        return cursor;
                    },
                }),
            ],
        },
        [selectedNoteId]
    );

    useEffect(() => {
        return () => {
            if (editor) {
                editor.destroy();
            }
        };
    }, [editor]);

    if (!selectedNoteId) {
        return (
            <div className="p-4 text-center text-gray-500">
                Select a note to begin.
            </div>
        );
    }

    if (!editor) {
        return (
            <div className="p-4 text-center text-gray-500 animate-pulse">
                Loading Editor...
            </div>
        );
    }

    return (
        <div className="rounded-2xl min-h-[400px]">
            <div className="sticky top-0 z-50">
                <Toolbar editor={editor} noteTitle={noteTitle || ""} />
            </div>
            <div className="prose max-w-none bg-white rounded-lg shadow-sm p-6 min-h-96">
                <EditorContent editor={editor} data-cy="noteContent" />
            </div>
        </div>
    );
}
