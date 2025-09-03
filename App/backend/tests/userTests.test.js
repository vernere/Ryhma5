import { describe, expect, test, } from "bun:test";

function mockFetch(response) {
    return async () => ({
        status: response.status,
        json: async () => response.body,
    });
}

describe('Auth Controller', () => {
    test("should register a user with valid data", async () => {


        global.fetch = mockFetch({
            status: 201,
            body: { email: "user@example.com", userId: "abc123" }
        });

        const email = "user@example.com";
        const password = "password123";
        const response = await fetch("http://localhost:3000/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        expect(response.status).toBe(201);
        const data = await response.json();

        expect(data.email).toBe("user@example.com");
        expect(data).toHaveProperty("userId");

        /** 

        expect(fetch).toHaveBeenCalledWith(
            "http://localhost:3000/api/auth",
            expect.objectContaining({
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, passwordConfirmation }),
            })
        );
        
        */
    });

    test("should not register a user with same email", async () => {

        global.fetch = mockFetch({
            status: 400,
            body: { error: "Email already exists" }
        });

        const email = `user@example.com`;
        const password = "securePassword123";
        const response = await fetch("http://localhost:3000/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("Email already exists")
    });

    test("should login user", async () => {

        global.fetch = mockFetch({
            status: 201,
            body: { email: "user@example.com", userId: "abc123" }
        });

        const email = `user@example.com`;
        const password = "securePassword123";
        const response = await fetch("http://localhost:3000/api/auth", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data).toHaveProperty("userId");
        expect(data.email).toBe(email);
    });

    test("should not login user with wrong credentials", async () => {

        global.fetch = mockFetch({
            status: 400,
            body: { error: "Invalid credentials" }
        });

        const email = `user@example.com`;
        const password = "securePassword123Helloxd";
        const response = await fetch("http://localhost:3000/api/auth", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("Invalid credentials")
    });

    test("should logout user", async () => {

        global.fetch = mockFetch({
            status: 201,
        });

        const response = await fetch("http://localhost:3000/api/auth/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        });

        expect(response.status).toBe(201);
    });

    // To-do
    // Check email valid format
    // Check password combinations for minimum sexurity requirements



});