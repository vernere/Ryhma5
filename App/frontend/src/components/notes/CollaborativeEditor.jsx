import { useAuth } from "@/hooks/useAuth";
import { useNotesStore } from "@/hooks/useNotesStore";
import { useRealtimeStore } from "@/hooks/useRealtimeStore";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";

export const CollaborativeEditor = () => {
    const {
        selectedNote,
        selectedNoteId,
        setCurrentUser,
        isLocalChange,
        setIsLocalChange,
        handleContentChange,
    } = useNotesStore();

    const {
        setupPresence,
        cleanupPresence,
        setupRealtimeSubscription,
        cleanupRealtimeSubscription,
    } = useRealtimeStore();

    const { user } = useAuth();
    const [_, setSaveStatus] = useState("saved");

    const editor = useEditor(
        {
            extensions: [StarterKit.configure({ history: false })],
            editorProps: {
                attributes: {
                    class: "prose max-w-none focus:outline-none min-h-[400px] p-4",
                },
            },
        },
        [selectedNoteId]
    );

    useEffect(() => {
        setupRealtimeSubscription();
        return () => cleanupRealtimeSubscription();
    }, []);

    useEffect(() => {
        if (editor && selectedNote?.content) {
            editor.commands.setContent(selectedNote.content);
        }
    }, [editor, selectedNoteId, selectedNote?.content]);

    useEffect(() => {
        if (user) setCurrentUser(user);
    }, [user]);

    useEffect(() => {
        if (selectedNoteId && user) {
            setupPresence(selectedNoteId, user, (content) => {
                if (editor) {
                    setIsLocalChange(true);
                    editor.commands.setContent(content);
                }
            });
        }
        return () => cleanupPresence();
    }, [
        selectedNoteId,
        user,
        editor,
    ]);

    useEffect(() => {
        if (!editor) return;

        const onUpdate = () => {
            if (isLocalChange) {
                setIsLocalChange(false);
                return;
            }

            setSaveStatus("saving");
            handleContentChange(editor.getHTML());
            setTimeout(() => setSaveStatus("saved"), 2500);
        };

        editor.on("update", onUpdate);
        return () => editor.off("update", onUpdate);
    }, [editor, isLocalChange]);

    if (!selectedNoteId) {
        return (
            <div className="border rounded-2xl shadow-sm p-4 text-center text-gray-500">
                No note selected
            </div>
        );
    }

    if (!editor) {
        return (
            <div className="border rounded-2xl shadow-sm p-4 text-center text-gray-500">
                <div className="animate-pulse">Setting up editor...</div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl min-h-[400px]">
            <div
                data-cy="noteContent"
                className="prose max-w-none text-gray-800 bg-white rounded-b-lg shadow-sm p-6"
                style={{ minHeight: "90vh" }}
            >
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};

export default CollaborativeEditor;
