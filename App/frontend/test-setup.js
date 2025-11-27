import { Window } from "happy-dom";
import "@testing-library/jest-dom";

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

// Fix for React DOM vendor prefix detection in CI
// React DOM checks for vendor prefixes using 'prop in style' during module load
// In some environments, happy-dom's style object may not be properly initialized
const ensureValidStyle = (element) => {
  if (!element || !element.style || typeof element.style !== 'object') {
    // Create a basic object that supports the 'in' operator
    const styleObj = window.CSSStyleDeclaration ? new window.CSSStyleDeclaration() : {};
    Object.defineProperty(element, 'style', {
      value: styleObj,
      writable: true,
      enumerable: true,
      configurable: true
    });
  }
};

// Ensure documentElement has a valid style before React DOM loads
if (window.document.documentElement) {
  ensureValidStyle(window.document.documentElement);
}