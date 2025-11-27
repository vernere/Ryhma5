import { Window } from "happy-dom";
import "@testing-library/jest-dom";

const window = new Window();
globalThis.window = window;
globalThis.document = window.document;
globalThis.navigator = window.navigator;