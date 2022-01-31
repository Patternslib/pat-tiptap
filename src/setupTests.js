// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

// need this for async/await in tests
import "core-js/stable";
import "regenerator-runtime/runtime";

import jquery from "jquery";
window.$ = window.jquery = jquery;

// jsDOM does not add ``getClientRects`` or ``getBoundingClientRect`` to a ``document.createRange()``
// We need it as tiptap tries to scroll into view when focusing the editor.
Range.prototype.getClientRects = () => [];
Range.prototype.getBoundingClientRect = () => {
    return { x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0 };
};
