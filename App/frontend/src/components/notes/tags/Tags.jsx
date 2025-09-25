export const Tags = ({ tagName }) => {
    // get tags fro database, maybe create a useTagsStore hook later
    // const { tags } = useTagsStore();
    // in useTagsStore getAllTags(), addTag(note_id, tag_id), removeTag(note_id, tag_id);

    return (
        <>
           <span
                data-cy="noteTag"
                className="inline-block bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded"
            >
                {tagName}
            </span>
        </>
    );
};
