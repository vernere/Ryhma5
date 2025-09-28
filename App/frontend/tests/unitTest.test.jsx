import { test, expect, beforeEach, mock } from "bun:test";
import {times} from "../src/unitTest.jsx"

test("can check if using Bun", () => {
  expect(Bun).toBeDefined();
});

test("test times result 41", () => {
    expect(times()).toBe(4);
});
