import { useEffect, useMemo } from "react";
import { useNotesStore } from "@/hooks/useNotesStore";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ySyncPlugin, yUndoPlugin } from "y-prosemirror";
import { supabase } from "@/lib/supabaseClient";

export default function CollaborativeEditor() {
    const { ydoc, provider, selectedNoteId, selectedNote } = useNotesStore();

    const yXmlFragment = ydoc?.getXmlFragment("prosemirror");

    const editor = useEditor(
        {
            extensions: [
                StarterKit.configure({
                    history: false,
                }),
            ],
            editorProps: {
                attributes: {
                    class: "prose max-w-none focus:outline-none min-h-[400px] p-4",
                },
            },
        },
        [selectedNoteId]
    );

    useEffect(() => {
        if (!editor || !yXmlFragment || !provider) return;

        const hasYSyncPlugin = editor.state.plugins.some(
            (plugin) => plugin.key && plugin.key.startsWith("y-sync")
        );

        if (hasYSyncPlugin) {
            console.log("Y.js plugins already registered");
            return;
        }

        try {
            editor.registerPlugin(ySyncPlugin(yXmlFragment));
            editor.registerPlugin(yUndoPlugin());

            console.log("Y.js plugins registered successfully");
        } catch (error) {
            console.error("Error setting up collaborative plugins:", error);
        }
    }, [editor, yXmlFragment, provider]);

    useEffect(() => {
        if (editor && selectedNote?.content) {
            editor.commands.setContent(selectedNote.content);
        }
    }, [editor, selectedNoteId, selectedNote?.content]);

    useEffect(() => {
        if (!editor || !selectedNoteId) return;

        const saveContent = async () => {
            try {
                const content = editor.getHTML();
                await supabase
                    .from("notes")
                    .update({
                        content,
                        updated_at: new Date().toISOString(),
                    })
                    .eq("note_id", selectedNoteId);
                console.log("Content saved to database");
            } catch (error) {
                console.error("Error saving content:", error);
            }
        };

        let saveTimeout;
        const handleUpdate = () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(saveContent, 2000);
        };

        editor.on("update", handleUpdate);

        return () => {
            editor.off("update", handleUpdate);
            clearTimeout(saveTimeout);
        };
    }, [editor, selectedNoteId]);

    if (!selectedNote) {
        return (
            <div className="border rounded-2xl shadow-sm p-4 text-center text-gray-500">
                No note selected
            </div>
        );
    }

    if (!ydoc || !provider) {
        return (
            <div className="border rounded-2xl shadow-sm p-4 text-center text-gray-500">
                <div className="animate-pulse">
                    Connecting to collaborative session...
                </div>
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
            <EditorContent editor={editor} />
        </div>
    );
}
