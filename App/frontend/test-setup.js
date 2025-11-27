import { Window } from "happy-dom";
import "@testing-library/jest-dom";

// Create and configure window before any React imports
const window = new Window({
  url: 'http://localhost:3000',
  settings: {
    disableJavaScriptEvaluation: false,
    disableJavaScriptFileLoading: false,
    disableCSSFileLoading: true,
    disableComputedStyleRendering: false,
  }
});

// Set globals immediately
globalThis.window = window;
globalThis.document = window.document;
globalThis.navigator = window.navigator;
globalThis.HTMLAnchorElement = window.HTMLAnchorElement;
globalThis.Blob = window.Blob;
globalThis.URL = window.URL;
globalThis.MouseEvent = window.MouseEvent;
globalThis.DOMParser = window.DOMParser;
globalThis.Node = window.Node;
globalThis.Element = window.Element;
globalThis.HTMLElement = window.HTMLElement;
globalThis.CSSStyleDeclaration = window.CSSStyleDeclaration;

// Critical: Ensure getComputedStyle returns proper style objects
const originalGetComputedStyle = window.getComputedStyle.bind(window);
globalThis.getComputedStyle = function(element) {
  const styles = originalGetComputedStyle(element);
  // Ensure it returns a proper object that can be used with 'in' operator
  if (!styles || typeof styles !== 'object') {
    return new window.CSSStyleDeclaration();
  }
  return styles;
};

// Ensure document.documentElement has a valid style before React loads
const ensureElementStyle = (element) => {
  if (!element) return;
  if (!element.style || typeof element.style !== 'object') {
    const styleDeclaration = new window.CSSStyleDeclaration();
    Object.defineProperty(element, 'style', {
      value: styleDeclaration,
      writable: true,
      enumerable: true,
      configurable: true
    });
  }
};

// Apply to documentElement immediately
ensureElementStyle(window.document.documentElement);

// Ensure all created elements have proper style
const originalCreateElement = window.document.createElement.bind(window.document);
window.document.createElement = function(tagName, options) {
  const element = originalCreateElement(tagName, options);
  ensureElementStyle(element);
  return element;
};