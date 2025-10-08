import { mock } from "bun:test";

const createMockQuery = () => {
    const mockQuery = {
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
    return mockQuery;
};

export const mockSupabase = {
    from: mock(() => createMockQuery()),
    storage: {
        from: mock(() => ({
            upload: mock(),
            getPublicUrl: mock(),
            remove: mock(),
            list: mock(),
        }))
    }
};