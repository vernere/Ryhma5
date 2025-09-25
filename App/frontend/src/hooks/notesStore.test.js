import { test, expect, beforeEach, mock } from "bun:test";
import { useNotesStore } from "./useNotesStore";

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
});

test("Initial state of notes store", () => {
  const { notes, selectedNote, selectedNoteId, error } = useNotesStore.getState();
  expect(notes).toEqual([]);
  expect(selectedNote).toBeNull();
  expect(selectedNoteId).toBeNull();
  expect(error).toBeNull();
});