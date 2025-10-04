import { mock } from "bun:test";

export const mockSupabase = {
    from: mock(() => ({
        select: mock().mockReturnThis(),
        insert: mock().mockReturnThis(),
        update: mock().mockReturnThis(),
        delete: mock().mockReturnThis(),
        eq: mock().mockReturnThis(),
        order: mock().mockReturnThis(),
        single: mock().mockReturnThis(),
    })),
    storage: {
        from: mock(() => ({
            upload: mock(),
            getPublicUrl: mock(),
            remove: mock(),
            list: mock(),
        }))
    }
};

export const mockRealtimeStore = {
    getState: mock(() => ({
        broadcastContentChange: mock(),
    })),
};