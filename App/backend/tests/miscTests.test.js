import { resolve } from "bun";
import { describe, expect, test } from "bun:test";

function createMockFetch(response) {
    const calls = [];
    const mock = async (...args) => {
        calls.push(args);
        return {
            status: response.status,
            json: async () => response.body,
        };
    };
    mock.calls = calls;
    return mock;
}

test("should register a user with valid data", async () => {
    const mockFetch = createMockFetch({
        status: 201,
        body: { email: "user@example.com", userId: "abc123" }
    });
    global.fetch = mockFetch;
    /*
    const email = "user@example.com";
    const password = "password123";
    const passwordConfirmation = "password123";
    const response = await fetch("http://localhost:3000/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, passwordConfirmation })
    });

    */
    // Check that fetch was called with expected arguments
    expect(mockFetch.calls.length).toBe(1);
    expect(mockFetch.calls[0][0]).toBe("http://localhost:3000/api/auth");
    expect(mockFetch.calls[0][1]).toEqual(expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, passwordConfirmation }),
    }));

    const data = await response.json();
    expect(data.email).toBe("user@example.com");
    expect(data).toHaveProperty("userId");


});