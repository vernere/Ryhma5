import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { useNotesStore } from "./useNotesStore";
import { useInvitationsStore } from "./useInvitationsStore";

const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
};

export const useRealtimeStore = create((set, get) => ({
    setupPresence: async (noteId, user, onContentReceive) => {
        if (!noteId || !user) return;

        const prev = get().presenceSubscription;
        if (prev) prev.unsubscribe();

        const channel = supabase.channel(`note-presence-${noteId}`, {
            config: { presence: { key: user.id } },
        });

        channel.on("presence", { event: "sync" }, () => {
            const state = channel.presenceState();
            const users = Object.keys(state).map((key) => state[key][0]);
            useNotesStore.setState({ activeUsers: users });
        });

        channel.on("broadcast", { event: "content_change" }, ({ payload }) => {
            if (payload.user.id !== user.id) {
                set({ isLocalChange: true });
                if (onContentReceive) onContentReceive(payload.content);
            }
        });

        channel.subscribe((status) => {
            if (status === "SUBSCRIBED") {
                channel.track({ user_id: user.id, email: user.email });
            }
        });

        set({ presenceSubscription: channel });
    },

    setupRealtimeSubscription: () => {
        if (get().realtimeSubscription) return;

        const channel = supabase
            .channel("notes-changes")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "notes" },
                (payload) => {
                    const inserted = payload.new;
                    useNotesStore.getState().addNote(inserted);
                }
            )
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: "notes" },
                (payload) => {
                    const updatedNote = payload.new;
                    const { selectedNoteId, currentUser } = useNotesStore.getState();

                    useNotesStore.getState().updateNote(updatedNote);

                    if (
                        selectedNoteId === updatedNote.note_id &&
                        updatedNote.updated_by !== currentUser?.id
                    ) {
                        useNotesStore.setState({ selectedNote: updatedNote });
                    }
                }
            )
            .on(
                "postgres_changes",
                { event: "DELETE", schema: "public", table: "notes" },
                (payload) => {
                    const deletedId = payload.old?.note_id;
                    useNotesStore.getState().deleteNote(deletedId);
                }
            )
            .subscribe((status, err) => {
                console.log("📡 realtimeSubscription status:", status, err);
                if (status === 'SUBSCRIBED') {
                    console.log("✅ Successfully subscribed to realtimeSubscription");
                } else if (status === 'CHANNEL_ERROR') {
                    console.error("❌ Channel error:", err);
                } else if (status === 'TIMED_OUT') {
                    console.error("⏰ realtimeSubscription timed out");
                } else if (status === 'CLOSED') {
                    console.log("🔒 realtimeSubscription closed");
                }
            });

        set({ realtimeSubscription: channel });
    },

    setupNoteCollaboratorSubscription: async (userId) => {
        if (get().collaboratorsSubscription) return;

        if (!userId) {
            console.log("No user ID provided for collaboratorsSubscription");
            return;
        }

        const channel = supabase
            .channel(`note_collaborators_${userId}`)
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "note_collaborators" },
                (payload) => {
                    console.log("🔥 REALTIME note_collaborators event:", payload);
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "DELETE",
                    schema: "public",
                    table: "note_collaborators",
                },
                (payload) => {
                    const deleted = payload.old;
                    if (!deleted) return;

                    if (deleted.user_id === userId) {
                        useNotesStore.getState().deleteNote(
                            deleted.note_id
                        );
                    }
                }
            )
            .subscribe((status, err) => {
                console.log("📡 collaboratorsSubscription status:", status, err);
                if (status === 'SUBSCRIBED') {
                    console.log("✅ Successfully subscribed to collaboratorsSubscription for user:", userId);
                } else if (status === 'CHANNEL_ERROR') {
                    console.error("❌ Channel error:", err);
                } else if (status === 'TIMED_OUT') {
                    console.error("⏰ collaboratorsSubscription timed out");
                } else if (status === 'CLOSED') {
                    console.log("🔒 collaboratorsSubscription closed");
                }
            });

        set({ collaboratorsSubscription: channel });
    },

    setupInvitesSubscription: (userId) => {
        if (get().invitesSubscription) return;

        if (!userId) {
            console.log("No user ID provided for subscription");
            return;
        }

        const channel = supabase
            .channel(`collaboration_invites_changes_${userId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "collaboration_invites",
                },
                (payload) => {
                    console.log("New invitation sent by user:", payload);
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "collaboration_invites",
                },
                (payload) => {
                    const updated = payload.new;
                    console.log("Invitation updated for user:", updated);
                    set((state) => ({
                        inbox: state.inbox.map((inv) =>
                            inv.invitation_id === updated.invitation_id ? { ...inv, ...updated } : inv
                        ),
                    }));
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "DELETE",
                    schema: "public",
                    table: "collaboration_invites",
                },
                (payload) => {
                    const deleted = payload.old;
                    if (!deleted) return;

                    const isRecipient = deleted.recipient_id === userId;
                    const isSender = deleted.sender_id === userId;
                    
                    if (!isRecipient && !isSender) return;

                    if (isRecipient) {
                        useInvitationsStore.getState().deleteInboxInvite(deleted.invitation_id);
                    }
                    if (isSender) {
                        useInvitationsStore.getState().deleteInvite(deleted.invitation_id);
                    }
                }
            )
            .subscribe((status, err) => {
                console.log("📡 invitesSubscription status:", status, err);
                if (status === 'SUBSCRIBED') {
                    console.log("✅ Successfully subscribed to invitesSubscription for user:", userId);
                } else if (status === 'CHANNEL_ERROR') {
                    console.error("❌ Channel error:", err);
                } else if (status === 'TIMED_OUT') {
                    console.error("⏰ invitesSubscription timed out");
                } else if (status === 'CLOSED') {
                    console.log("🔒 invitesSubscription closed");
                }
            });

        set({ invitesSubscription: channel });
    },

    cleanupInvitesSubscription: () => {
        const { invitesSubscription } = get();
        console.log("Cleaning up invites subscription");
        if (invitesSubscription) {
            invitesSubscription.unsubscribe();
            set({ invitesSubscription: null });
        }
    },

    cleanupPresence: () => {
        const { presenceSubscription } = get();
        if (presenceSubscription) {
            presenceSubscription.unsubscribe();
            useNotesStore.setState({ activeUsers: [] });
            set({ presenceSubscription: null });
        }
    },

    cleanupRealtimeSubscription: () => {
        const { realtimeSubscription } = get();
        if (realtimeSubscription) {
            realtimeSubscription.unsubscribe();
            set({ realtimeSubscription: null });
        }
    },

    cleanupCollaboratorsSubscription: () => {
        const { collaboratorsSubscription } = get();
        if (collaboratorsSubscription) {
            collaboratorsSubscription.unsubscribe();
            set({ collaboratorsSubscription: null });
        }
    },

    broadcastContentChange: debounce(async (newContent) => {
        const { presenceSubscription } = get();
        const { isLocalChange, currentUser } = useNotesStore.getState();
        if (!presenceSubscription || !currentUser) return;

        if (isLocalChange) {
            set({ isLocalChange: false });
            return;
        }

        await presenceSubscription.send({
            type: "broadcast",
            event: "content_change",
            payload: {
                user: { id: currentUser.id, email: currentUser.email },
                content: newContent,
            },
        });
    }, 100)
}));