import { test, expect, beforeEach } from "bun:test";
import { useTagStore } from "./useTagStore";

beforeEach(() => {
    useTagStore.setState({
        allTags: [],
        error: null,
        loading: false,
    });
});


// Before each noteStore
//note.note_id ja tag.tag_id
//create note
// take note id
// uuid format


test("Initial state of tags store", () => {
    const { allTags, error, loading } =
        useTagStore.getState();

    expect(allTags).toEqual([]);
    expect(error).toBeNull();
    expect(loading).toBe(false);

    /*expect(selectedNote).toBeNull();
    expect(selectedNoteId).toBeNull();
    expect(error).toBeNull();
});

test("favorites: isFavorite returns false when nothing is set", () => {
    const s = useNotesStore.getState();
    expect(s.isFavorite("X")).toBe(false);
    */

});

test("tisFavorite returns false when nothing is set", () => {
    const s = useTagStore.getState();
    const noteId = 1 ;
    const tagId =  1;

    s.addTag(noteId,tagId );

    //const tags = await s.getTags(1);

    console.log("here");
    console.log(s.getTags(1));

    //expect(s.getTags(1)[0]).toEqual({ id: 1, name: "Coding" });
    //expect(s.fetchTags()) hae tag
});
