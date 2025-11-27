import { Window } from "happy-dom";

const window = new Window();
globalThis.window = window;
globalThis.document = window.document;
globalThis.navigator = window.navigator;

// Add DOM APIs needed by file-saver and other libraries
globalThis.HTMLAnchorElement = window.HTMLAnchorElement;
globalThis.Blob = window.Blob;
globalThis.URL = window.URL;
globalThis.MouseEvent = window.MouseEvent;
globalThis.DOMParser = window.DOMParser;
globalThis.Node = window.Node;
