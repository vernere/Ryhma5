import { useAuth } from "@/hooks/useAuth";
import { useNotesStore } from "@/hooks/useNotesStore";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useMemo, useRef, useCallback, useState } from "react";
import { Toolbar } from "@/components/ui/toolbar";

import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Collaboration from "@tiptap/extension-collaboration";
import * as Y from "yjs";

import { supabase } from "@/lib/supabaseClient";
import { setupSupabaseProvider } from "@/lib/y-supabase";

const editorExtensions = [
    StarterKit.configure({
        history: false,
    }),
    TextAlign.configure({ types: ["heading", "paragraph"] }),
];

export default function CollaborativeEditor() {
    const selectedNoteId = useNotesStore((state) => state.selectedNoteId);
    const initialContent = useNotesStore((state) => state.selectedNote?.content);
    const noteTitle = useNotesStore((state) => state.selectedNote?.title);
    const saveNoteToDatabase = useNotesStore((state) => state.saveNoteToDatabase);
    
    const { user } = useAuth();
    const userId = user?.id;

    const renderCount = useRef(0);
    renderCount.current++;

    console.log("=== RENDER #", renderCount.current, "===");

    const [collabState, setCollabState] = useState({ ydoc: null, provider: null });

    useEffect(() => {
        console.log("🔄 Setting up collaboration for note:", selectedNoteId);
        
        if (!selectedNoteId || !userId) {
            console.log("No note or user, clearing collab state");
            setCollabState({ ydoc: null, provider: null });
            return;
        }

        console.log("📝 Creating new Yjs doc and provider for note:", selectedNoteId);
        const doc = new Y.Doc();
        
        const channelName = `note-yjs-${selectedNoteId}`;
        console.log("📡 Creating channel:", channelName);
        
        const channel = supabase.channel(channelName, {
            config: {
                broadcast: { self: true },
                presence: { key: userId },
            },
        });
        
        const supProvider = setupSupabaseProvider(doc, channel);

        doc.on("update", (update, origin) => {
            console.log("🔥 Yjs doc update detected! Origin:", origin);
        });

        setCollabState({ ydoc: doc, provider: supProvider });

        // Cleanup function
        return () => {
            console.log("🧹 Cleaning up collaboration for note:", selectedNoteId);
            supProvider.destroy();
            doc.destroy();
        };
    }, [selectedNoteId, userId]);

    const editorConfig = useMemo(() => ({
        enabled: !!collabState.ydoc && !!collabState.provider,
        content: "",
        extensions: [
            ...editorExtensions,
            ...(collabState.ydoc ? [Collaboration.configure({ document: collabState.ydoc })] : []),
        ],
        editorProps: {
            attributes: {
                class: "prose max-w-none focus:outline-none min-h-[400px] p-4",
            },
        },
    }), [collabState.ydoc, collabState.provider]);

    const editor = useEditor(editorConfig, [collabState.ydoc, collabState.provider]);

    const hasSetInitialContent = useRef(new Set());
    
    useEffect(() => {
        if (!editor || !collabState.ydoc || !initialContent || !selectedNoteId) {
            return;
        }
        
        if (hasSetInitialContent.current.has(selectedNoteId)) {
            console.log("📄 Initial content already set for this note");
            return;
        }
        
        const isDocEmpty = collabState.ydoc.getXmlFragment("default").length === 0;
        console.log("📄 Checking if should set initial content. Doc empty:", isDocEmpty, "Content length:", initialContent?.length);
        
        if (initialContent && initialContent.trim()) {
            console.log("📄 Setting initial content for note:", selectedNoteId);
            editor.commands.setContent(initialContent);
            hasSetInitialContent.current.add(selectedNoteId);
        } else if (isDocEmpty && (!initialContent || !initialContent.trim())) {
            console.log("📄 Note has empty content, skipping");
            hasSetInitialContent.current.add(selectedNoteId);
        }
    }, [editor, collabState.ydoc, initialContent, selectedNoteId]);

    useEffect(() => {
        const currentNoteId = selectedNoteId;
        return () => {
            if (hasSetInitialContent.current.size > 10) {
                const newSet = new Set();
                if (currentNoteId) {
                    newSet.add(currentNoteId);
                }
                hasSetInitialContent.current = newSet;
            }
        };
    }, [selectedNoteId]);

    const handleUpdate = useCallback(() => {
        if (!editor || !selectedNoteId) return;
        const content = editor.getHTML();
        console.log("💾 Saving to database, content length:", content.length);
        saveNoteToDatabase(selectedNoteId, content);
    }, [editor, selectedNoteId, saveNoteToDatabase]);

    useEffect(() => {
        if (!editor) return;

        editor.on("update", handleUpdate);
        return () => {
            editor.off("update", handleUpdate);
        };
    }, [editor, handleUpdate]);

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
                <Toolbar
                    editor={editor}
                    noteTitle={noteTitle || ""}
                />
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