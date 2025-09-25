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

const RETRY_CONFIG = {
    maxAttempts: 5,
    initialDelay: 500,
    factor: 2,
};

export const useRealtimeStore = create((set, get) => ({
    invitesSubscription: null,
    collaboratorsSubscription: null,
    realtimeSubscription: null,
    presenceSubscription: null,
    reconnectTimers: {},

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
                    get().reconnect('realtimeSubscription', get().setupRealtimeSubscription);
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
                    get().reconnect('collaboratorsSubscription', () => get().setupNoteCollaboratorSubscription(userId));
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
                "postgres_changes", { event: "*", schema: "public", table: "collaboration_invites" },
                (payload) => {
                    console.log("New invitation EVENT", payload);
                }
            )
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
                    console.log("Invitation deleted EVENT", payload);
                    if (!deleted) return;
                    useInvitationsStore.getState().deleteInboxInvite(deleted.invitation_id);
                    useInvitationsStore.getState().deleteInvite(deleted.invitation_id);
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
                    get().reconnect('invitesSubscription', () => get().setupInvitesSubscription(userId));
                } else if (status === 'CLOSED') {
                    console.log("🔒 invitesSubscription closed");
                }
            });

        set({ invitesSubscription: channel });
    },

    reconnect: (key, setupFn) => {
        get().cleanupSubscription(key);

        const attempt = (attemptNum = 1) => {
            if (attemptNum > RETRY_CONFIG.maxAttempts) {
                console.error(`🚨 Reconnection failed for ${key} after ${RETRY_CONFIG.maxAttempts} attempts.`);
                return;
            }

            const delay = RETRY_CONFIG.initialDelay * Math.pow(RETRY_CONFIG.factor, attemptNum - 1);
            console.log(`Retrying ${key} connection... Attempt ${attemptNum} in ${delay}ms`);

            const timer = setTimeout(() => {
                setupFn();
            }, delay);

            set(state => ({
                reconnectTimers: { ...state.reconnectTimers, [key]: timer }
            }));
        };

        attempt();
    },

    cleanupSubscription: (key) => {
        const channel = get()[key];
        if (channel) {
            console.log(`🔒 Cleaning up ${key}`);
            channel.unsubscribe();
            set({ [key]: null });
        }
        
        const timer = get().reconnectTimers[key];
        if (timer) {
            clearTimeout(timer);
            set(state => {
                const newTimers = { ...state.reconnectTimers };
                delete newTimers[key];
                return { reconnectTimers: newTimers };
            });
        }
    },

    cleanupInvitesSubscription: () => get().cleanupSubscription('invitesSubscription'),
    cleanupCollaboratorsSubscription: () => get().cleanupSubscription('collaboratorsSubscription'),
    cleanupPresence: () => get().cleanupSubscription('presenceSubscription'),
    cleanupRealtimeSubscription: () => get().cleanupSubscription('realtimeSubscription'),

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