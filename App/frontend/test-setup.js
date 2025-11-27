import { Window } from "happy-dom";
import "@testing-library/jest-dom";

// Create window instance
const window = new Window({
  url: 'http://localhost:3000',
  settings: {
    disableJavaScriptEvaluation: false,
    disableJavaScriptFileLoading: false,
    disableCSSFileLoading: true,
    disableComputedStyleRendering: false,
  }
});

// Create a robust CSSStyleDeclaration wrapper that works with 'in' operator
class RobustCSSStyleDeclaration extends window.CSSStyleDeclaration {
  constructor() {
    super();
    // Ensure common CSS properties exist to support 'in' operator checks
    const cssProperties = [
      'WebkitTransition', 'transition',
      'WebkitAnimation', 'animation',
      'WebkitTransform', 'transform',
      'opacity', 'color', 'backgroundColor',
      'display', 'position', 'zIndex'
    ];
    
    for (const prop of cssProperties) {
      if (!(prop in this)) {
        this[prop] = '';
      }
    }
  }
}

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
globalThis.CSSStyleDeclaration = RobustCSSStyleDeclaration;

// Ensure getComputedStyle returns proper style objects
const originalGetComputedStyle = window.getComputedStyle.bind(window);
globalThis.getComputedStyle = function(element) {
  try {
    const styles = originalGetComputedStyle(element);
    if (!styles || typeof styles !== 'object') {
      return new RobustCSSStyleDeclaration();
    }
    return styles;
  } catch {
    return new RobustCSSStyleDeclaration();
  }
};

// Helper to ensure elements have proper style
const ensureElementStyle = (element) => {
  if (!element) return;
  
  try {
    // Check if style exists and is valid
    if (!element.style || typeof element.style !== 'object' || !('length' in element.style)) {
      Object.defineProperty(element, 'style', {
        value: new RobustCSSStyleDeclaration(),
        writable: true,
        enumerable: true,
        configurable: true
      });
    }
  } catch {
    // Fallback: create new style declaration
    Object.defineProperty(element, 'style', {
      value: new RobustCSSStyleDeclaration(),
      writable: true,
      enumerable: true,
      configurable: true
    });
  }
};

// Ensure documentElement has valid style BEFORE any imports
if (window.document.documentElement) {
  ensureElementStyle(window.document.documentElement);
}

// Patch createElement to ensure all elements have proper style
const originalCreateElement = window.document.createElement.bind(window.document);
window.document.createElement = function(tagName, options) {
  const element = originalCreateElement(tagName, options);
  ensureElementStyle(element);
  return element;
};