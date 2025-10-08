import { beforeEach, describe, expect, mock, test } from "bun:test";
import { mockSupabase } from "./constants";

mock.module("@/lib/supabaseClient", () => ({
  supabase: mockSupabase,
}));

import { useNotesStore } from "../useNotesStore";

beforeEach(() => {
  useNotesStore.setState({
    notes: [],
    selectedNote: null,
    selectedNoteId: null,
    error: null,
    loading: false,
    searchQuery: "",
    activeUsers: [],
    presenceChannel: null,
    isLocalChange: false,
    currentUser: null,
    favs: new Set(),
    collaborators: [],
    role: null,
  });

  mockSupabase.from.mockClear();
});

describe("useNotesStore", () => {
  describe("Initial state", () => {
    test("has correct initial state", () => {
      const state = useNotesStore.getState();

      expect(state.notes).toEqual([]);
      expect(state.selectedNote).toBeNull();
      expect(state.selectedNoteId).toBeNull();
      expect(state.error).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.searchQuery).toBe("");
      expect(state.activeUsers).toEqual([]);
      expect(state.presenceChannel).toBeNull();
      expect(state.isLocalChange).toBe(false);
      expect(state.currentUser).toBeNull();
      expect(state.favs).toBeInstanceOf(Set);
      expect(state.favs.size).toBe(0);
      expect(state.collaborators).toEqual([]);
      expect(state.role).toBeNull();
    });
  });

  describe("Basic setters", () => {
    test("setCurrentUser updates current user", () => {
      const user = { id: "user1", username: "testuser" };
      const { setCurrentUser } = useNotesStore.getState();

      setCurrentUser(user);

      expect(useNotesStore.getState().currentUser).toEqual(user);
    });

    test("setIsLocalChange updates local change flag", () => {
      const { setIsLocalChange } = useNotesStore.getState();

      setIsLocalChange(true);

      expect(useNotesStore.getState().isLocalChange).toBe(true);
    });

    test("setSearchQuery updates search query", () => {
      const { setSearchQuery } = useNotesStore.getState();

      setSearchQuery("test query");

      expect(useNotesStore.getState().searchQuery).toBe("test query");
    });
  });

  describe("Note management", () => {
    test("addNote adds note to beginning of array", () => {
      const { addNote } = useNotesStore.getState();
      const note1 = { note_id: 1, title: "Note 1", content: "Content 1" };
      const note2 = { note_id: 2, title: "Note 2", content: "Content 2" };

      addNote(note1);
      addNote(note2);

      const notes = useNotesStore.getState().notes;
      expect(notes).toHaveLength(2);
      expect(notes[0]).toEqual(note2);
      expect(notes[1]).toEqual(note1);
    });

    test("updateNote updates existing note", () => {
      const { addNote, updateNote } = useNotesStore.getState();
      const originalNote = { note_id: 1, title: "Original", content: "Original content" };
      const updatedNote = { note_id: 1, title: "Updated", content: "Updated content" };

      addNote(originalNote);
      updateNote(updatedNote);

      const notes = useNotesStore.getState().notes;
      expect(notes[0]).toEqual(updatedNote);
    });

    test("updateNote doesn't affect other notes", () => {
      const { addNote, updateNote } = useNotesStore.getState();
      const note1 = { note_id: 1, title: "Note 1", content: "Content 1" };
      const note2 = { note_id: 2, title: "Note 2", content: "Content 2" };
      const updatedNote1 = { note_id: 1, title: "Updated", content: "Updated content" };

      addNote(note1);
      addNote(note2);
      updateNote(updatedNote1);

      const notes = useNotesStore.getState().notes;
      expect(notes[0]).toEqual(note2);
      expect(notes[1]).toEqual(updatedNote1);
    });

    test("deleteNote removes note from array", async () => {
      const mockQuery = {
        delete: mock().mockReturnThis(),
        eq: mock(() => Promise.resolve({ error: null })),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      const { addNote, deleteNote } = useNotesStore.getState();
      const note1 = { note_id: 1, title: "Note 1" };
      const note2 = { note_id: 2, title: "Note 2" };

      addNote(note1);
      addNote(note2);
      await deleteNote(1);

      const notes = useNotesStore.getState().notes;
      expect(notes).toHaveLength(1);
      expect(notes[0]).toEqual(note2);
    });

    test("deleteNote clears selection if deleting selected note", async () => {
      const mockQuery = {
        delete: mock().mockReturnThis(),
        eq: mock(() => Promise.resolve({ error: null })),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      const { addNote, deleteNote } = useNotesStore.getState();
      const note = { note_id: 1, title: "Note 1" };

      addNote(note);
      useNotesStore.setState({ selectedNoteId: 1, selectedNote: note });

      await deleteNote(1);

      const state = useNotesStore.getState();
      expect(state.selectedNote).toBeNull();
      expect(state.selectedNoteId).toBeNull();
    });

    test("deleteNote preserves selection if deleting different note", async () => {
      const mockQuery = {
        delete: mock().mockReturnThis(),
        eq: mock(() => Promise.resolve({ error: null })),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      const { addNote, deleteNote } = useNotesStore.getState();
      const note1 = { note_id: 1, title: "Note 1" };
      const note2 = { note_id: 2, title: "Note 2" };

      addNote(note1);
      addNote(note2);
      useNotesStore.setState({ selectedNoteId: 2, selectedNote: note2 });

      await deleteNote(1);

      const state = useNotesStore.getState();
      expect(state.selectedNote).toEqual(note2);
      expect(state.selectedNoteId).toBe(2);
    });

    test("deleteNote handles error", async () => {
      const mockQuery = {
        delete: mock().mockReturnThis(),
        eq: mock(() => Promise.resolve({ error: { message: "Delete failed" } })),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      const { addNote, deleteNote } = useNotesStore.getState();
      const note = { note_id: 1, title: "Note 1" };

      addNote(note);
      await deleteNote(1);

      const state = useNotesStore.getState();
      expect(state.error).toBe("Delete failed");
      expect(state.notes).toHaveLength(1);
    });
  });

  describe("Favorites management", () => {
    test("isFavorite returns false when nothing is set", () => {
      const { isFavorite } = useNotesStore.getState();
      expect(isFavorite("nonexistent")).toBe(false);
    });

    test("setFavs with a Set marks those ids as favorite", () => {
      const { setFavs, isFavorite } = useNotesStore.getState();

      setFavs(new Set(["n1", "n2"]));

      expect(isFavorite("n1")).toBe(true);
      expect(isFavorite("n2")).toBe(true);
      expect(isFavorite("n3")).toBe(false);
    });

    test("setFavs with updater function works correctly", () => {
      const { setFavs, isFavorite } = useNotesStore.getState();

      setFavs(new Set(["a"]));
      setFavs((prev) => new Set([...prev, "b"]));

      expect(isFavorite("a")).toBe(true);
      expect(isFavorite("b")).toBe(true);
    });

    test("setFavs replaces previous Set when passed directly", () => {
      const { setFavs, isFavorite } = useNotesStore.getState();

      setFavs(new Set(["old"]));
      setFavs(new Set(["new1", "new2"]));

      expect(isFavorite("old")).toBe(false);
      expect(isFavorite("new1")).toBe(true);
      expect(isFavorite("new2")).toBe(true);
    });
  });

  describe("Async operations", () => {
    describe("fetchFavorites", () => {
      test("successfully fetches and sets favorites", async () => {
        const mockData = [{ note_id: "note1" }, { note_id: "note2" }];
        const mockQuery = {
          select: mock(() => Promise.resolve({ data: mockData, error: null })),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        const { fetchFavorites, isFavorite } = useNotesStore.getState();

        await fetchFavorites();

        expect(mockSupabase.from).toHaveBeenCalledWith("favorites");
        expect(mockQuery.select).toHaveBeenCalledWith("note_id");
        expect(isFavorite("note1")).toBe(true);
        expect(isFavorite("note2")).toBe(true);
      });

      test("handles error in fetchFavorites", async () => {
        const mockQuery = {
          select: mock(() => Promise.resolve({ data: null, error: { message: "Fetch error" } })),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        const { fetchFavorites } = useNotesStore.getState();

        await fetchFavorites();

        expect(useNotesStore.getState().error).toBe("Fetch error");
      });

      test("handles null data in fetchFavorites", async () => {
        const mockQuery = {
          select: mock(() => Promise.resolve({ data: null, error: null })),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        const { fetchFavorites } = useNotesStore.getState();

        await fetchFavorites();

        expect(useNotesStore.getState().favs.size).toBe(0);
      });
    });

    describe("fetchNotes", () => {
      test("successfully fetches notes", async () => {
        const mockNotes = [
          { note_id: 1, title: "Note 1", created_at: "2023-01-01" },
          { note_id: 2, title: "Note 2", created_at: "2023-01-02" }
        ];
        const mockQuery = {
          select: mock(() => ({
            order: mock(() => Promise.resolve({ data: mockNotes, error: null })),
          })),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        const { fetchNotes } = useNotesStore.getState();

        await fetchNotes();

        const state = useNotesStore.getState();
        expect(state.notes).toEqual(mockNotes);
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
      });

      test("handles error in fetchNotes", async () => {
        const mockQuery = {
          select: mock(() => ({
            order: mock(() => Promise.resolve({ data: null, error: new Error("Database error") })),
          })),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        const { fetchNotes } = useNotesStore.getState();

        await fetchNotes();

        const state = useNotesStore.getState();
        expect(state.error).toBe("Database error");
        expect(state.loading).toBe(false);
      });

      test("sets loading state during fetchNotes", async () => {
        let resolvePromise;
        const promise = new Promise(resolve => { resolvePromise = resolve; });
        const mockQuery = {
          select: mock(() => ({
            order: mock(() => promise),
          })),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        const { fetchNotes } = useNotesStore.getState();

        const fetchPromise = fetchNotes();

        expect(useNotesStore.getState().loading).toBe(true);

        resolvePromise({ data: [], error: null });
        await fetchPromise;

        expect(useNotesStore.getState().loading).toBe(false);
      });
    });

    describe("fetchNoteById", () => {
      test("successfully fetches note by ID", async () => {
        const mockNote = {
          note_id: 1,
          title: "Test Note",
          note_tags: [{ tags: { name: "tag1" } }]
        };
        const mockQuery = {
          select: mock(() => ({
            eq: mock(() => ({
              single: mock(() => Promise.resolve({ data: mockNote, error: null })),
            })),
          })),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        const { fetchNoteById } = useNotesStore.getState();

        await fetchNoteById(1);

        const state = useNotesStore.getState();
        expect(state.selectedNote).toEqual(mockNote);
        expect(state.selectedNoteId).toBe(1);
        expect(state.loading).toBe(false);
      });

      test("handles error in fetchNoteById", async () => {
        const mockQuery = {
          select: mock(() => ({
            eq: mock(() => ({
              single: mock(() => Promise.resolve({ data: null, error: new Error("Not found") })),
            })),
          })),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        const { fetchNoteById } = useNotesStore.getState();

        await fetchNoteById(999);

        const state = useNotesStore.getState();
        expect(state.error).toBe("Not found");
        expect(state.loading).toBe(false);
      });
    });

    describe("createNote", () => {
      test("successfully creates note", async () => {
        const mockUser = { id: "user123" };
        const mockNote = {
          note_id: 1,
          title: "New Note",
          content: "",
          creator_id: "user123"
        };
        const mockQuery = {
          insert: mock(() => ({
            select: mock(() => ({
              single: mock(() => Promise.resolve({ data: mockNote, error: null })),
            })),
          })),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        useNotesStore.setState({ currentUser: mockUser });
        const { createNote } = useNotesStore.getState();

        const result = await createNote("New Note");

        expect(result).toEqual(mockNote);
        const state = useNotesStore.getState();
        expect(state.notes[0]).toEqual(mockNote);
        expect(state.selectedNote).toEqual(mockNote);
        expect(state.selectedNoteId).toBe(1);
      });

      test("returns null when no current user", async () => {
        const { createNote } = useNotesStore.getState();

        const result = await createNote("New Note");

        expect(result).toBeNull();
      });

      test("handles error in createNote", async () => {
        const mockUser = { id: "user123" };
        const mockQuery = {
          insert: mock(() => ({
            select: mock(() => ({
              single: mock(() => Promise.resolve({ data: null, error: { message: "Creation failed" } })),
            })),
          })),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        useNotesStore.setState({ currentUser: mockUser });
        const { createNote } = useNotesStore.getState();

        const result = await createNote("New Note");

        expect(result).toBeNull();
        expect(useNotesStore.getState().error).toBe("Creation failed");
      });
    });

    describe("addFavorite", () => {
      test("successfully adds favorite", async () => {
        const mockUser = { id: "user123" };
        const mockQuery = {
          insert: mock(() => Promise.resolve({ error: null })),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        useNotesStore.setState({ currentUser: mockUser });
        const { addFavorite, isFavorite } = useNotesStore.getState();

        await addFavorite("note1");

        expect(isFavorite("note1")).toBe(true);
        expect(mockQuery.insert).toHaveBeenCalledWith({ user_id: "user123", note_id: "note1" });
      });

      test("reverts state on error", async () => {
        const mockUser = { id: "user123" };
        const mockQuery = {
          insert: mock(() => Promise.resolve({ error: new Error("Insert failed") })),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        useNotesStore.setState({ currentUser: mockUser });
        const { addFavorite, isFavorite } = useNotesStore.getState();

        try {
          await addFavorite("note1");
        } catch (error) {
          expect(error.message).toBe("Insert failed");
        }

        expect(isFavorite("note1")).toBe(false);
        expect(useNotesStore.getState().error).toBe("Insert failed");
      });

      test("returns early when no current user", async () => {
        const { addFavorite } = useNotesStore.getState();

        await addFavorite("note1");

        expect(mockSupabase.from).not.toHaveBeenCalled();
      });
    });

    describe("removeFavorite", () => {
      test("successfully removes favorite", async () => {
        const mockUser = { id: "user123" };
        const mockEq2 = {
          eq: mock(() => Promise.resolve({ error: null })),
        };
        const mockEq1 = {
          eq: mock(() => mockEq2),
        };
        const mockQuery = {
          delete: mock(() => mockEq1),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        useNotesStore.setState({
          currentUser: mockUser,
          favs: new Set(["note1"])
        });
        const { removeFavorite, isFavorite } = useNotesStore.getState();

        await removeFavorite("note1");

        expect(isFavorite("note1")).toBe(false);
        expect(mockQuery.delete).toHaveBeenCalled();
      });

      test("reverts state on error", async () => {
        const mockUser = { id: "user123" };
        const mockEq2 = {
          eq: mock(() => Promise.resolve({ error: new Error("Delete failed") })),
        };
        const mockEq1 = {
          eq: mock(() => mockEq2),
        };
        const mockQuery = {
          delete: mock(() => mockEq1),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        useNotesStore.setState({
          currentUser: mockUser,
          favs: new Set(["note1"])
        });
        const { removeFavorite, isFavorite } = useNotesStore.getState();

        try {
          await removeFavorite("note1");
        } catch (error) {
          expect(error.message).toBe("Delete failed");
        }

        expect(isFavorite("note1")).toBe(true);
        expect(useNotesStore.getState().error).toBe("Delete failed");
      });
    });

    describe("toggleFavorite", () => {
      test("adds favorite when not favorited", async () => {
        const mockUser = { id: "user123" };
        const mockQuery = {
          insert: mock(() => Promise.resolve({ error: null })),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        useNotesStore.setState({ currentUser: mockUser });
        const { toggleFavorite, isFavorite } = useNotesStore.getState();

        await toggleFavorite("note1");

        expect(isFavorite("note1")).toBe(true);
      });

      test("removes favorite when already favorited", async () => {
        const mockUser = { id: "user123" };
        const mockEq2 = {
          eq: mock(() => Promise.resolve({ error: null })),
        };
        const mockEq1 = {
          eq: mock(() => mockEq2),
        };
        const mockQuery = {
          delete: mock(() => mockEq1),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        useNotesStore.setState({
          currentUser: mockUser,
          favs: new Set(["note1"])
        });
        const { toggleFavorite, isFavorite } = useNotesStore.getState();

        await toggleFavorite("note1");

        expect(isFavorite("note1")).toBe(false);
      });
    });

    describe("updateNoteTitle", () => {
      test("successfully updates note title", async () => {
        const mockQuery = {
          update: mock().mockReturnThis(),
          eq: mock(() => Promise.resolve({ error: null })),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        const { addNote, updateNoteTitle } = useNotesStore.getState();
        const note = { note_id: 1, title: "Original Title", updated_at: "2023-01-01" };

        addNote(note);
        useNotesStore.setState({ selectedNote: note, selectedNoteId: 1 });

        await updateNoteTitle(1, "New Title");

        const state = useNotesStore.getState();
        expect(state.notes[0].title).toBe("New Title");
        expect(state.selectedNote.title).toBe("New Title");
        expect(mockQuery.update).toHaveBeenCalled();
      });

      test("handles error in updateNoteTitle", async () => {
        const mockQuery = {
          update: mock().mockReturnThis(),
          eq: mock(() => Promise.resolve({ error: { message: "Update failed" } })),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        const { updateNoteTitle } = useNotesStore.getState();

        await updateNoteTitle(1, "New Title");

        expect(useNotesStore.getState().error).toBe("Update failed");
      });
    });

    describe("fetchNoteCollaborators", () => {
      test("successfully fetches collaborators", async () => {
        const mockData = [
          { role: "owner", users: { id: "user1", username: "owner" } },
          { role: "editor", users: { id: "user2", username: "editor" } },
        ];
        const mockQuery = {
          select: mock().mockReturnThis(),
          eq: mock(() => Promise.resolve({ data: mockData, error: null })),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        useNotesStore.setState({ currentUser: { id: "user1" } });
        const { fetchNoteCollaborators } = useNotesStore.getState();

        await fetchNoteCollaborators("note1");

        const state = useNotesStore.getState();
        expect(state.collaborators).toHaveLength(2);
        expect(state.role).toBe("owner");
        expect(state.loading).toBe(false);
      });

      test("returns early when no noteId", async () => {
        const { fetchNoteCollaborators } = useNotesStore.getState();

        await fetchNoteCollaborators(null);

        expect(mockSupabase.from).not.toHaveBeenCalled();
      });

      test("handles error in fetchNoteCollaborators", async () => {
        const mockQuery = {
          select: mock().mockReturnThis(),
          eq: mock(() => Promise.resolve({ data: null, error: { message: "Fetch error" } })),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        const { fetchNoteCollaborators } = useNotesStore.getState();

        await fetchNoteCollaborators("note1");

        expect(useNotesStore.getState().error).toBe("Fetch error");
      });
    });

    describe("removeCollaborator", () => {
      test("successfully removes collaborator", async () => {
        const mockEq2 = {
          eq: mock(() => Promise.resolve({ error: null })),
        };
        const mockEq1 = {
          eq: mock().mockReturnValue(mockEq2),
        };
        const mockQuery = {
          delete: mock().mockReturnValue(mockEq1),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        useNotesStore.setState({
          collaborators: [
            { user_id: "user1", username: "user1" },
            { user_id: "user2", username: "user2" },
          ]
        });
        const { removeCollaborator } = useNotesStore.getState();

        await removeCollaborator("note1", "user1");

        const state = useNotesStore.getState();
        expect(state.collaborators).toHaveLength(1);
        expect(state.collaborators[0].user_id).toBe("user2");
      });

      test("returns early when missing parameters", async () => {
        const { removeCollaborator } = useNotesStore.getState();

        await removeCollaborator(null, "user1");
        await removeCollaborator("note1", null);

        expect(mockSupabase.from).not.toHaveBeenCalled();
      });

      test("handles error in removeCollaborator", async () => {
        const mockEq2 = {
          eq: mock(() => Promise.resolve({ error: { message: "Remove failed" } })),
        };
        const mockEq1 = {
          eq: mock().mockReturnValue(mockEq2),
        };
        const mockQuery = {
          delete: mock().mockReturnValue(mockEq1),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        const { removeCollaborator } = useNotesStore.getState();

        await removeCollaborator("note1", "user1");

        expect(useNotesStore.getState().error).toBe("Remove failed");
      });
    });

    describe("setSelectedNote", () => {
      test("sets selected note and fetches by ID", async () => {
        const mockNote = { note_id: 1, title: "Test Note" };
        const mockQuery = {
          select: mock().mockReturnThis(),
          eq: mock().mockReturnThis(),
          single: mock(() => Promise.resolve({ data: mockNote, error: null })),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        const { setSelectedNote } = useNotesStore.getState();

        await setSelectedNote(1);

        const state = useNotesStore.getState();
        expect(state.selectedNote).toEqual(mockNote);
        expect(state.selectedNoteId).toBe(1);
        expect(state.loading).toBe(false);
      });
    });
  });
});