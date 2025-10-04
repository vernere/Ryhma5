import { mock } from "bun:test";

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