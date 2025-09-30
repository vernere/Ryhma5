import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

export const useInvitationsStore = create((set, get) => ({
    inbox: [],
    invitations: [],
    loading: false,
    error: null,

    addInvite: (invite) =>
        set((state) => ({
            invites: [...state.invites, invite],
        })),

    updateInvite: (updatedInvite) =>
        set((state) => ({
            invites: state.invites.map((inv) =>
                inv.invitation_id === updatedInvite.invitation_id ? updatedInvite : inv
            ),
        })),

    deleteInvite: (invitation_id) =>
        set((state) => ({
            invitations: state.invitations.filter((inv) => inv.invitation_id !== invitation_id),
        })),

    deleteInboxInvite: (invitation_id) =>
        set((state) => ({
            inbox: state.inbox.filter((inv) => inv.invitation_id !== invitation_id),
        })),

    updateInboxInvite: (updatedInvite) =>
        set((state) => ({
            inbox: state.inbox.map((inv) =>
                inv.invitation_id === updatedInvite.invitation_id ? updatedInvite : inv
            ),
        })),

    sendCollaborationInvite: async (senderId, recipientId, noteId) => {
        const { data, error } = await supabase
            .from("collaboration_invites")
            .insert([{ sender_id: senderId, recipient_id: recipientId, note_id: noteId }])
            .select()
            .single();

        if (error) {
            set({ error: error.message });
            console.log("Error sending invite:", error.message);
            return null;
        }

        if (senderId === get().currentUser?.id) {
            set((state) => ({ invitations: [data, ...state.invitations] }));
        }
        return data;
    },

    getInvites: async (userId) => {
        if (!userId) {
            set({ error: "User ID is required", loading: false });
            return;
        }

        set({ loading: true, error: null });
        const { data, error } = await supabase
            .from("collaboration_invites")
            .select("*, sender:users!sender_id(id, username)")
            .eq("recipient_id", userId)
            .eq("status", "pending")
            .order("created_at", { ascending: false });

        if (error) {
            set({ error: error.message, loading: false });
            return;
        }

        set({ inbox: data || [], loading: false });
    },

    getInvitesByNoteId: async (noteId, userId) => {
        set({ loading: true, error: null });

        const { data, error } = await supabase
            .from("collaboration_invites")
            .select("*, recipient:users!recipient_id(id, username)")
            .eq("note_id", noteId)
            .eq("status", "pending")
            .neq("recipient_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching invites by note ID:", error.message);
            set({ error: error.message, loading: false });
            return [];
        }

        set({ invitations: data, loading: false });
        return data || [];
    },

    setStatus: async (id, status) => {
        const { data, error } = await supabase
            .from("collaboration_invites")
            .update({ status })
            .eq("invitation_id", id);

        if (error) {
            set({ error: error.message });
            return;
        }

        console.log("Updated invite status:", data);
        console.log("Error:", error);

        set({
            inbox: get().inbox.map((inv) =>
                inv.invitation_id === id ? { ...inv, status, responded_at: new Date().toISOString() } : inv
            ),
        });
    }
}));