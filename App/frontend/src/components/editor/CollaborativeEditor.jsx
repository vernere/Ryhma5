import { Toolbar } from "@/components/ui/toolbar";
import { useAuth } from "@/hooks/useAuth";
import { useNotesStore } from "@/hooks/useNotesStore";
import { supabase } from "@/lib/supabaseClient";
import { SupabaseProvider } from "@/lib/y-supabase";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { EditorContent, useEditor } from "@tiptap/react";
import * as Y from "yjs";
import { COLORS, EDITOR_EXTENSIONS } from "./constants";

export default function CollaborativeEditor() {
    const selectedNoteId = useNotesStore((state) => state.selectedNoteId);
    const initialContent = useNotesStore(
        (state) => state.selectedNote?.content
    );
    const noteTitle = useNotesStore((state) => state.selectedNote?.title);
    const { user } = useAuth();

    const ydoc = new Y.Doc();
    const channelName = `note-yjs-${selectedNoteId}`;
    const provider = new SupabaseProvider(ydoc, supabase, {
        channel: channelName,
        id: selectedNoteId,
        idName: "note_id",
        tableName: "notes",
        columnName: "content",
    });

    const editor = useEditor({
        editorProps: {
            attributes: {
                class: "prose max-w-none focus:outline-none min-h-[400px] p-4",
            },
        },
        content: initialContent,
        autofocus: "end",
        enableContentCheck: true,
        onContentError: ({ disableCollaboration }) => {
            disableCollaboration();
        },
        onCreate: ({ editor: currentEditor }) => {
            provider.on("synced", () => {
                if (currentEditor.isEmpty) {
                    currentEditor.commands.setContent(initialContent);
                }
            });
        },
        extensions: [
            ...EDITOR_EXTENSIONS,
            Collaboration.configure({
                document: ydoc,
            }),
            CollaborationCaret.configure({
                provider,
                user: {
                    name: user.username || "Unknown",
                    color: COLORS[Math.floor(Math.random() * COLORS.length)],
                },
                render: (user) => {
                    const cursor = document.createElement('span')
                    cursor.classList.add('collaboration-carets__caret')
                    cursor.setAttribute('style', `border-color: ${user.color}`)

                    const label = document.createElement('div')
                    label.classList.add('collaboration-carets__label')
                    label.setAttribute('style', `background-color: ${user.color}`)
                    label.insertBefore(document.createTextNode(user.name), null)

                    cursor.insertBefore(label, null)
                    return cursor
                },
            }),
        ],
    });

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
            <div className="sticky top-0 z-50 shadow">
                <Toolbar editor={editor} noteTitle={noteTitle || ""} />
            </div>
            <div
                className="prose max-w-none bg-white rounded-b-lg shadow-sm p-6"
                style={{ minHeight: "90vh" }}
            >
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
