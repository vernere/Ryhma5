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

// CRITICAL: Fix for React DOM vendor prefix detection in CI
// React DOM checks document.documentElement.style during module initialization
// In CI, happy-dom's style property may not be properly initialized
const docElement = window.document.documentElement;
if (docElement) {
  const currentStyle = docElement.style;
  // If style is not a valid object, replace it with a plain object
  // that supports the 'in' operator which React DOM uses
  if (!currentStyle || typeof currentStyle !== 'object') {
    Object.defineProperty(docElement, 'style', {
      value: {},
      writable: true,
      enumerable: true,
      configurable: true
    });
  }
}

// Import jest-dom matchers AFTER fixing the style object
import "@testing-library/jest-dom";