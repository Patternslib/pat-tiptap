import registry from "@patternslib/patternslib/src/core/registry";
import "./src/tiptap";

// Include patterns for the demo
import "@patternslib/patternslib/src/pat/modal/modal";
import "@patternslib/patternslib/src/pat/auto-submit/auto-submit";
import "@patternslib/patternslib/src/pat/checklist/checklist";

// Importing pattern styles in JavaScript
window.__patternslib_import_styles = true;

registry.init();
