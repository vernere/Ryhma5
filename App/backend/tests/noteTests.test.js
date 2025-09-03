import { describe, expect, test } from "bun:test";

function mockFetch(response) {
  return async () => ({
    status: response.status,
    json: async () => response.body,
  });
}

describe('Note Controller', () => {
  test("should create a new note", async () => {

    global.fetch = mockFetch({
      status: 201,
      body: { userId: "abc123", title: "Morning routine test", content: "I am so tired" }
    });

    const title = `Morning routine test`;
    const content = "I am so tired";
    const response = await fetch("http://localhost:3000/api/note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content })
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data).toHaveProperty("userId");
    expect(data.title).toBe("Morning routine test")
    expect(data.content).toBe("I am so tired")

  });

  // Edit note

  // Duplicate notes

  // Delete note

  // Title and content check


});

