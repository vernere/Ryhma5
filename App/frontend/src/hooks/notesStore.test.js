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
  const { notes, selectedNote, selectedNoteId, error } =
    useNotesStore.getState();

  expect(notes).toEqual([]);
  expect(selectedNote).toBeNull();
  expect(selectedNoteId).toBeNull();
  expect(error).toBeNull();
});

test("favorites: isFavorite returns false when nothing is set", () => {
  const s = useNotesStore.getState();
  expect(s.isFavorite("X")).toBe(false);
});

test("favorites: setFavs with a Set marks those ids as favorite", () => {
  const s = useNotesStore.getState();

  s.setFavs(new Set(["n1", "n2"]));

  expect(s.isFavorite("n1")).toBe(true);
  expect(s.isFavorite("n2")).toBe(true);
  expect(s.isFavorite("zzz")).toBe(false);
});

test("favorites: setFavs updater adds to the previous Set", () => {
  const s = useNotesStore.getState();

  s.setFavs(new Set(["a"]));
  s.setFavs((prev) => new Set([...prev, "b"]));

  expect(s.isFavorite("a")).toBe(true);
  expect(s.isFavorite("b")).toBe(true);
});

test("favorites: passing a new Set replaces the old one", () => {
  const s = useNotesStore.getState();

  s.setFavs(new Set(["old"]));
  s.setFavs(new Set(["new1", "new2"]));

  expect(s.isFavorite("old")).toBe(false);
  expect(s.isFavorite("new1")).toBe(true);
  expect(s.isFavorite("new2")).toBe(true);
});
/*
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
*/