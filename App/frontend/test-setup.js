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

// Add CSSStyleDeclaration and getComputedStyle for React DOM
globalThis.CSSStyleDeclaration = window.CSSStyleDeclaration;
globalThis.getComputedStyle = window.getComputedStyle.bind(window);

// Ensure document.createElement returns elements with style property
const originalCreateElement = window.document.createElement.bind(window.document);
window.document.createElement = function(tagName, options) {
  const element = originalCreateElement(tagName, options);
  if (!element.style || typeof element.style !== 'object') {
    Object.defineProperty(element, 'style', {
      value: new window.CSSStyleDeclaration(),
      writable: true,
      enumerable: true,
      configurable: true
    });
  }
  return element;
};