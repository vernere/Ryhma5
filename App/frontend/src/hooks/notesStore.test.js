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

test("favorites: isFavorite on false kun mitään ei ole asetettu", () => {
  const s = useNotesStore.getState();
  expect(s.isFavorite("X")).toBe(false);
});

test("favorites: setFavs toimii Setillä", () => {
  const s = useNotesStore.getState();

  s.setFavs(new Set(["n1", "n2"]));

  expect(s.isFavorite("n1")).toBe(true);
  expect(s.isFavorite("n2")).toBe(true);
  expect(s.isFavorite("zzz")).toBe(false);
});

test("favorites: setFavs toimii updater-funktiolla", () => {
  const s = useNotesStore.getState();

  s.setFavs(new Set(["a"]));
  s.setFavs((prev) => new Set([...prev, "b"]));

  expect(s.isFavorite("a")).toBe(true);
  expect(s.isFavorite("b")).toBe(true);
});

test("favorites: setFavs korvaa koko setin kun annat suoraan uuden Setin", () => {
  const s = useNotesStore.getState();

  s.setFavs(new Set(["old"]));
  s.setFavs(new Set(["new1", "new2"]));  

  expect(s.isFavorite("old")).toBe(false);
  expect(s.isFavorite("new1")).toBe(true);
  expect(s.isFavorite("new2")).toBe(true);
});

