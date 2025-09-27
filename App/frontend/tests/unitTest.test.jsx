import { test, expect, beforeEach, mock } from "bun:test";
import {times} from "@/unitTest"

test("can check if using Bun", () => {
  expect(Bun).toBeDefined();
});

test("test times", () => {
    expect(times).equal
});
