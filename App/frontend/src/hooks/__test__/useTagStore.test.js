import { beforeEach, describe, expect, mock, test } from "bun:test";
import { useTagStore } from "../useTagStore";
import { mockSupabase } from "./constants";

mock.module("@/lib/supabaseClient", () => ({
    supabase: mockSupabase,
}));

let mockQuery;

beforeEach(() => {
    useTagStore.setState({
        allTags: [],
        noteTags: [],
        loading: false,
        error: null,
    });
    
    mockQuery = {
        select: mock(() => mockQuery),
        insert: mock(() => mockQuery),
        update: mock(() => mockQuery),
        delete: mock(() => mockQuery),
        eq: mock(() => mockQuery),
        neq: mock(() => mockQuery),
        order: mock(() => mockQuery),
        limit: mock(() => mockQuery),
        single: mock(() => mockQuery),
        or: mock(() => mockQuery),
    };
    
    mockSupabase.from.mockClear();
    mockSupabase.from.mockReturnValue(mockQuery);
});

describe("useTagStore", () => {
    test("fetchTags fetches and sets allTags", async () => {
        const mockTags = [
            { id: 1, name: "Tag1" },
            { id: 2, name: "Tag2" },
        ];
        mockQuery.order.mockResolvedValueOnce({ data: mockTags, error: null });

        await useTagStore.getState().fetchTags();

        const state = useTagStore.getState();
        expect(state.allTags).toEqual(mockTags);
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
    });

    test("fetchTags handles errors", async () => {
        const mockError = new Error("Fetch error");
        mockQuery.order.mockResolvedValueOnce({ data: null, error: mockError });

        await useTagStore.getState().fetchTags();

        const state = useTagStore.getState();
        expect(state.allTags).toEqual([]);
        expect(state.loading).toBe(false);
        expect(state.error).toBe(mockError.message);
    });

    test("addTag adds a tag to a note", async () => {
        const noteId = 1;
        const tagId = 2;
        const mockNoteTags = [{ id: 1, note_id: noteId, tag_id: 3 }];
        const newTag = { id: 2, note_id: noteId, tag_id: tagId };

        mockQuery.select.mockReturnValueOnce(mockQuery);
        mockQuery.eq.mockResolvedValueOnce({ data: mockNoteTags, error: null });
        
        mockQuery.insert.mockReturnValueOnce(mockQuery);
        mockQuery.select.mockResolvedValueOnce({ data: [newTag], error: null });

        const result = await useTagStore.getState().addTag(noteId, tagId);

        expect(result).toEqual([newTag]);
        const state = useTagStore.getState();
        expect(state.error).toBeNull();
    });

    test("addTag does not add duplicate tags", async () => {
        const noteId = 1;
        const tagId = 2;
        const mockNoteTags = [{ id: 1, note_id: noteId, tag_id: tagId }];

        mockQuery.select.mockReturnValueOnce(mockQuery);
        mockQuery.eq.mockResolvedValueOnce({ data: mockNoteTags, error: null });

        const result = await useTagStore.getState().addTag(noteId, tagId);

        expect(result).toBeNull();
        const state = useTagStore.getState();
        expect(state.error).toBeNull();
    });

    test("addTag handles errors", async () => {
        const noteId = 1;
        const tagId = 2;
        const mockError = new Error("Insert error");
        const mockNoteTags = [{ id: 1, note_id: noteId, tag_id: 3 }];

        mockQuery.select.mockReturnValueOnce(mockQuery);
        mockQuery.eq.mockResolvedValueOnce({ data: mockNoteTags, error: null });
        
        mockQuery.insert.mockReturnValueOnce(mockQuery);
        mockQuery.select.mockResolvedValueOnce({ data: null, error: mockError });

        await expect(useTagStore.getState().addTag(noteId, tagId)).rejects.toThrow("Insert error");

        const state = useTagStore.getState();
        expect(state.error).toBe(mockError.message);
    });

    test("removeTag removes a tag from a note", async () => {
        const noteId = 1;
        const tagId = 2;

        mockQuery.delete.mockReturnValueOnce(mockQuery);
        mockQuery.eq.mockReturnValueOnce(mockQuery);
        mockQuery.eq.mockResolvedValueOnce({ error: null });

        await useTagStore.getState().removeTag(noteId, tagId);

        const state = useTagStore.getState();
        expect(state.error).toBeNull();
    });

    test("removeTag handles errors", async () => {
        const noteId = 1;
        const tagId = 2;
        const mockError = new Error("Delete error");

        mockQuery.delete.mockReturnValueOnce(mockQuery);
        mockQuery.eq.mockReturnValueOnce(mockQuery);
        mockQuery.eq.mockResolvedValueOnce({ error: mockError });

        await expect(useTagStore.getState().removeTag(noteId, tagId)).rejects.toThrow("Delete error");

        const state = useTagStore.getState();
        expect(state.error).toBe(mockError.message);
    });

    test("getTags fetches and sets noteTags", async () => {
        const noteId = 1;
        const mockNoteTags = [
            { id: 1, note_id: noteId, tag_id: 2 },
            { id: 2, note_id: noteId, tag_id: 3 },
        ];
        mockQuery.select.mockReturnValueOnce(mockQuery);
        mockQuery.eq.mockResolvedValueOnce({ data: mockNoteTags, error: null });

        await useTagStore.getState().getTags(noteId);

        const state = useTagStore.getState();
        expect(state.noteTags).toEqual(mockNoteTags);
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
    });

    test("getTags handles errors", async () => {
        const noteId = 1;
        const mockError = new Error("Fetch error");
        mockQuery.select.mockReturnValueOnce(mockQuery);
        mockQuery.eq.mockResolvedValueOnce({ data: null, error: mockError });

        await useTagStore.getState().getTags(noteId);

        const state = useTagStore.getState();
        expect(state.noteTags).toEqual([]);
        expect(state.loading).toBe(false);
        expect(state.error).toBe(mockError.message);
    });
});