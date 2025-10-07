import { beforeEach, describe, expect, mock, test } from "bun:test";
import { useInvitationsStore } from "../useInvitationsStore";
import { mockSupabase } from "./constants";

mock.module("@/lib/supabaseClient", () => ({
    supabase: mockSupabase,
}));

beforeEach(() => {
    useInvitationsStore.setState({
        inbox: [],
        invitations: [],
        loading: false,
        error: null,
    });
    mockSupabase.from.mockClear();
});

describe("useInvitationsStore", () => {
    test("initial state", () => {
        const state = useInvitationsStore.getState();
        expect(state.inbox).toEqual([]);
        expect(state.invitations).toEqual([]);
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
    });

    test("addInvite adds an invitation", () => {
        const newInvite = { invitation_id: "inv-id-123", note_id: "note-id-456", sender_id: "user-id-678", recipient_id: "user-id-910" };
        useInvitationsStore.getState().addInvite(newInvite);
        const state = useInvitationsStore.getState();
        expect(state.invitations).toContainEqual(newInvite);
    });

    test("updateInvite updates an existing invitation", () => {
        const invite = { invitation_id: 1, note_id: 1, sender_id: 1, recipient_id: 2 };
        useInvitationsStore.setState({ invitations: [invite] });
        const updatedInvite = { ...invite, note_id: 2 };
        useInvitationsStore.getState().updateInvite(updatedInvite);
        const state = useInvitationsStore.getState();
        expect(state.invitations).toContainEqual(updatedInvite);
    });

    test("deleteInvite removes an invitation", () => {
        const invite1 = { invitation_id: 1, note_id: 1, sender_id: 1, recipient_id: 2 };
        const invite2 = { invitation_id: 2, note_id: 2, sender_id: 2, recipient_id: 3 };
        useInvitationsStore.setState({ invitations: [invite1, invite2] });
        useInvitationsStore.getState().deleteInvite(1);
        const state = useInvitationsStore.getState();
        expect(state.invitations).not.toContainEqual(invite1);
        expect(state.invitations).toContainEqual(invite2);
    });

    test("deleteInboxInvite removes an inbox invitation", () => {
        const invite1 = { invitation_id: 1, note_id: 1, sender_id: 1, recipient_id: 2 };
        const invite2 = { invitation_id: 2, note_id: 2, sender_id: 2, recipient_id: 3 };
        useInvitationsStore.setState({ inbox: [invite1, invite2] });
        useInvitationsStore.getState().deleteInboxInvite(1);
        const state = useInvitationsStore.getState();
        expect(state.inbox).not.toContainEqual(invite1);
        expect(state.inbox).toContainEqual(invite2);
    });

    test("updateInboxInvite updates an existing inbox invitation", () => {
        const invite = { invitation_id: 1, note_id: 1, sender_id: 1, recipient_id: 2 };
        useInvitationsStore.setState({ inbox: [invite] });
        const updatedInvite = { ...invite, note_id: 2 };
        useInvitationsStore.getState().updateInboxInvite(updatedInvite);
        const state = useInvitationsStore.getState();
        expect(state.inbox).toContainEqual(updatedInvite);
    });

    test("sendCollaborationInvite sends an invite and updates state", async () => {
        const senderId = "user-id-1";
        const recipientId = "user-id-2";
        const noteId = "note-id-1";
        const mockInvite = { invitation_id: "inv-id-123", note_id: noteId, sender_id: senderId, recipient_id: recipientId };

        mockSupabase.from.mockReturnValue({
            insert: () => ({
                select: () => ({
                    single: () => Promise.resolve({ data: mockInvite, error: null }),
                }),
            }),
        });

        useInvitationsStore.setState({ currentUser: { id: senderId } });

        const result = await useInvitationsStore.getState().sendCollaborationInvite(senderId, recipientId, noteId);
        const state = useInvitationsStore.getState();

        expect(result).toEqual(mockInvite);
        expect(state.invitations).toContainEqual(mockInvite);
        expect(mockSupabase.from).toHaveBeenCalledWith("collaboration_invites");
    });

    test("getInvites fetches and sets inbox invitations", async () => {
        const userId = "user-id-1";
        const mockInvites = [
            { invitation_id: "inv-id-1", note_id: "note-id-1", sender_id: "user-id-2", recipient_id: userId },
            { invitation_id: "inv-id-2", note_id: "note-id-2", sender_id: "user-id-3", recipient_id: userId },
        ];

        const mockQuery = {
            select: mock(() => mockQuery),
            eq: mock(() => mockQuery),
            order: mock(() => Promise.resolve({ data: mockInvites, error: null })),
        };

        mockSupabase.from.mockReturnValue(mockQuery);

        await useInvitationsStore.getState().getInvites(userId);
        const state = useInvitationsStore.getState();

        expect(state.inbox).toEqual(mockInvites);
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
        expect(mockSupabase.from).toHaveBeenCalledWith("collaboration_invites");
    });

    test("getInvites handles error", async () => {
        const userId = "user-id-1";
        const mockError = { message: "Error fetching invites" };

        const mockQuery = {
            select: mock(() => mockQuery),
            eq: mock(() => mockQuery),
            order: mock(() => Promise.resolve({ data: null, error: mockError })),
        };

        mockSupabase.from.mockReturnValue(mockQuery);

        await useInvitationsStore.getState().getInvites(userId);
        const state = useInvitationsStore.getState();

        expect(state.inbox).toEqual([]);
        expect(state.loading).toBe(false);
        expect(state.error).toBe(mockError.message);
        expect(mockSupabase.from).toHaveBeenCalledWith("collaboration_invites");
    });

    test("getInvites with no userId sets error", async () => {
        await useInvitationsStore.getState().getInvites(null);
        const state = useInvitationsStore.getState();

        expect(state.inbox).toEqual([]);
        expect(state.loading).toBe(false);
        expect(state.error).toBe("User ID is required");
    });

    test("getInvitesByNoteId fetches invitations by note ID", async () => {
        const noteId = "note-id-1";
        const userId = "user-id-1";
        const mockInvites = [
            { invitation_id: "inv-id-1", note_id: noteId, sender_id: "user-id-2", recipient_id: "user-id-3" },
        ];

        const mockQuery = {
            select: mock(() => mockQuery),
            eq: mock(() => mockQuery),
            neq: mock(() => mockQuery),
            order: mock(() => Promise.resolve({ data: mockInvites, error: null })),
        };

        mockSupabase.from.mockReturnValue(mockQuery);

        const result = await useInvitationsStore.getState().getInvitesByNoteId(noteId, userId);
        const state = useInvitationsStore.getState();

        expect(result).toEqual(mockInvites);
        expect(state.invitations).toEqual(mockInvites);
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
        expect(mockSupabase.from).toHaveBeenCalledWith("collaboration_invites");
    });

    test("getInvitesByNoteId handles error", async () => {
        const noteId = "note-id-1";
        const userId = "user-id-1";
        const mockError = { message: "Error fetching invites by note ID" };

        const mockQuery = {
            select: mock(() => mockQuery),
            eq: mock(() => mockQuery),
            neq: mock(() => mockQuery),
            order: mock(() => Promise.resolve({ data: null, error: mockError })),
        };

        mockSupabase.from.mockReturnValue(mockQuery);

        const result = await useInvitationsStore.getState().getInvitesByNoteId(noteId, userId);
        const state = useInvitationsStore.getState();

        expect(result).toEqual([]);
        expect(state.invitations).toEqual([]);
        expect(state.loading).toBe(false);
        expect(state.error).toBe(mockError.message);
        expect(mockSupabase.from).toHaveBeenCalledWith("collaboration_invites");
    });

    test("setStatus updates invitation status", async () => {
        const inviteId = "inv-id-123";
        const newStatus = "accepted";
        const mockInvite = { invitation_id: inviteId, note_id: "note-id-1", sender_id: "user-id-1", recipient_id: "user-id-2", status: newStatus };

        const mockQuery = {
            update: mock(() => mockQuery),
            eq: mock(() => Promise.resolve({ data: mockInvite, error: null })),
        };

        mockSupabase.from.mockReturnValue(mockQuery);

        await useInvitationsStore.getState().setStatus(inviteId, newStatus);
        const state = useInvitationsStore.getState();

        expect(state.error).toBeNull();
        expect(mockSupabase.from).toHaveBeenCalledWith("collaboration_invites");
    });

    test("setStatus handles error", async () => {
        const inviteId = "inv-id-123";
        const newStatus = "accepted";
        const mockError = { message: "Error updating status" };

        const mockQuery = {
            update: mock(() => mockQuery),
            eq: mock(() => Promise.resolve({ data: null, error: mockError })),
        };

        mockSupabase.from.mockReturnValue(mockQuery);

        await useInvitationsStore.getState().setStatus(inviteId, newStatus);
        const state = useInvitationsStore.getState();

        expect(state.error).toBe(mockError.message);
        expect(mockSupabase.from).toHaveBeenCalledWith("collaboration_invites");
    });

    test("setCurrentUser sets the current user", () => {
        const user = { id: "user-id-1", username: "testuser" };
        useInvitationsStore.getState().setCurrentUser(user);
        const state = useInvitationsStore.getState();
        expect(state.currentUser).toEqual(user);
    });

    test("clearError clears the error state", () => {
        useInvitationsStore.setState({ error: "Some error" });
        useInvitationsStore.getState().clearError();
        const state = useInvitationsStore.getState();
        expect(state.error).toBeNull();
    });
});