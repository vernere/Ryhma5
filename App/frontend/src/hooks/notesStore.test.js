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

test("Add note to store", () => {
  const { addNote } = useNotesStore.getState();
  const sampleNote = { note_id: 1, title: "Note 1", content: "Test content" };
  
  addNote(sampleNote);
  
  const updatedNotes = useNotesStore.getState().notes;
  expect(updatedNotes).toHaveLength(1);
  expect(updatedNotes[0]).toEqual(sampleNote);
});