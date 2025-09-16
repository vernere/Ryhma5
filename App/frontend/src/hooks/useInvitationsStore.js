import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

export const useInvitationsStore = create((set, get) => ({
    inbox: [],
    loading: false,
    error: null,
    invitesSubscription: null,

    sendCollaborationInvite: async (email, noteId) => {
        const { data, error } = await supabase
            .from("collaboration_invites")
            .insert([{ email, note_id: noteId, status: "pending" }])
            .select()
            .single();

        if (error) {
            set({ error: error.message });
            return null;
        }

        set((state) => ({ invitations: [data, ...state.invitations] }));
        return data;
    },

    getInvitations: async () => {
        set({ loading: true, error: null });
        const { data, error } = await supabase
            .from("collaboration_invites")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            set({ error: error.message, loading: false });
            return;
        }

        set({ inbox: data || [], loading: false });
    },

    getInvitesByNoteId: async (noteId) => {
        set({ loading: true, error: null });
        const { data, error } = await supabase
            .from("collaboration_invites")
            .select("*")
            .eq("note_id", noteId)
            .order("created_at", { ascending: false });

        if (error) {
            set({ error: error.message, loading: false });
            return [];
        }

        set({ loading: false });
        return data || [];
    },

    setStatus: async (id, status) => {
        const { error } = await supabase
            .from("collaboration_invites")
            .update({ status })
            .eq("invitation_id", id);

        if (error) {
            set({ error: error.message });
            return;
        }

        set({
            inbox: get().inbox.map((inv) =>
                inv.invitation_id === id ? { ...inv, status, responded_at: new Date().toISOString() } : inv
            ),
        });
    },

    setupInvitesSubscription: () => {
        if (get().invitesSubscription) return;

        const channel = supabase
            .channel("note_invitations_changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "note_invitations" },
                (payload) => {
                    const { eventType, new: newRow, old: oldRow } = payload;

                    set((state) => {
                        let updated = [...state.inbox];

                        if (eventType === "INSERT" && newRow) {
                            updated = [newRow, ...updated];
                        }

                        if (eventType === "UPDATE" && newRow) {
                            updated = updated.map((inv) =>
                                inv.invitation_id === newRow.invitation_id ? newRow : inv
                            );
                        }

                        if (eventType === "DELETE" && oldRow) {
                            updated = updated.filter(
                                (inv) => inv.invitation_id !== oldRow.invitation_id
                            );
                        }

                        return { inbox: updated };
                    });
                }
            )
            .subscribe();

        set({ invitesSubscription: channel });
    },

    cleanupInvitesSubscription: () => {
        const { invitesSubscription } = get();
        if (invitesSubscription) {
            supabase.removeChannel(invitesSubscription);
            set({ invitesSubscription: null });
        }
    },
}));