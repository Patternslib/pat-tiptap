import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "@patternslib/patternslib/src/core/base";
import logging from "@patternslib/patternslib/src/core/logging";
import Parser from "@patternslib/patternslib/src/core/parser";
import utils from "@patternslib/patternslib/src/core/utils";

const log = logging.getLogger("tiptap");

export const parser = new Parser("tiptap");
parser.addArgument("collaboration-server", null);
parser.addArgument("collaboration-document", null);

parser.addArgument("toolbar-external", null);

export default Base.extend({
    name: "tiptap",
    trigger: ".pat-tiptap",

    toolbar: {},

    async init() {
        const TipTap = (await import("@tiptap/core")).Editor;
        const ExtDocument = (await import("@tiptap/extension-document")).default;
        const ExtParagraph = (await import("@tiptap/extension-paragraph")).default;
        const ExtText = (await import("@tiptap/extension-text")).default;

        this.options = parser.parse(this.el, this.options);

        // Hide element which will be replaced with tiptap instance
        this.el.style.display = "none";
        // Create container for tiptap
        const container = document.createElement("div");
        container.setAttribute("class", "tiptap-container");
        this.el.after(container);

        const is_form_el = ["TEXTAREA", "INPUT"].includes(this.el.tagName);

        const getText = () => {
            // Textarea value getter
            return is_form_el ? this.el.value : this.el.innerHTML;
        };

        const setText = (text) => {
            // Textarea value setter
            if (is_form_el) {
                this.el.value = text;
            } else {
                this.el.innerHTML = text;
            }
        };

        this.toolbar_pre_init();
        this.editor = new TipTap({
            element: container,
            extensions: [
                ExtDocument,
                ExtText,
                ExtParagraph,
                ...(await this.toolbar_extensions()),
            ],
            content: getText(),
            onUpdate() {
                setText(this.getHTML());
            },
        });
        this.toolbar_post_init();
    },

    toolbar_pre_init() {
        // pre-initialization step:
        // Search for available toolbar buttons.

        const tb = this.options.toolbarExternal
            ? document.querySelector(this.options.toolbarExternal)
            : null;
        if (!tb) {
            return;
        }

        // paragraph formating
        this.toolbar.heading_level_1 = tb.querySelector(".button-heading-level-1");
        this.toolbar.heading_level_2 = tb.querySelector(".button-heading-level-2");
        this.toolbar.heading_level_3 = tb.querySelector(".button-heading-level-3");
        this.toolbar.heading_level_4 = tb.querySelector(".button-heading-level-4");
        this.toolbar.heading_level_5 = tb.querySelector(".button-heading-level-5");
        this.toolbar.heading_level_6 = tb.querySelector(".button-heading-level-6");
        this.toolbar.paragraph = tb.querySelector(".button-paragraph");
        this.toolbar.blockquote = tb.querySelector(".button-blockquote");
        this.toolbar.code_block = tb.querySelector(".button-code-block");

        // character formating
        this.toolbar.bold = tb.querySelector(".button-bold");
        this.toolbar.italic = tb.querySelector(".button-italic");
        this.toolbar.strike = tb.querySelector(".button-strike");
        this.toolbar.code = tb.querySelector(".button-code");

        // lists
        this.toolbar.unordered_list = tb.querySelector(".button-unordered-list");
        this.toolbar.ordered_list = tb.querySelector(".button-ordered-list");

        // tables
        this.toolbar.table_create = tb.querySelector(".button-table-create");
        this.toolbar.table_add_row_above = tb.querySelector(".button-table-add-row-above"); // prettier-ignore
        this.toolbar.table_add_row_below = tb.querySelector(".button-table-add-row-below"); // prettier-ignore
        this.toolbar.table_add_column_left = tb.querySelector(".button-table-add-column-left"); // prettier-ignore
        this.toolbar.table_add_column_right = tb.querySelector(".button-table-add-column-right"); // prettier-ignore
        this.toolbar.table_header_cell = tb.querySelector(".button-table-header-cell");
        this.toolbar.table_header_row = tb.querySelector(".button-table-header-row");
        this.toolbar.table_header_column = tb.querySelector(".button-table-header-column"); // prettier-ignore
        this.toolbar.table_merge_cells = tb.querySelector(".button-table-merge-cells");
        this.toolbar.table_remove = tb.querySelector(".button-table-remove");
        this.toolbar.table_remove_row = tb.querySelector(".button-table-remove-row");
        this.toolbar.table_remove_column = tb.querySelector(".button-table-remove-column"); // prettier-ignore

        // other
        this.toolbar.horizontal_rule = tb.querySelector(".button-horizontal-rule");

        // functionality
        this.toolbar.undo = tb.querySelector(".button-undo");
        this.toolbar.redo = tb.querySelector(".button-redo");

        // media/links
        this.toolbar.link = tb.querySelector(".button-link");
        this.toolbar.image = tb.querySelector(".button-image");
    },

    async toolbar_extensions() {
        // Compile a list of TipTap extensions based on available toolbar buttons.

        // Btw, we need to import the toolbar extensions upfront for the editor to be initialized.
        // See: https://github.com/ueberdosis/tiptap/issues/1044

        const extensions = [];

        if (Object.values(this.toolbar).length === 0) {
            return [];
        }

        let has_tables = false;

        const tb = this.toolbar;
        if (
            tb.heading_level_1 ||
            tb.heading_level_2 ||
            tb.heading_level_3 ||
            tb.heading_level_4 ||
            tb.heading_level_5 ||
            tb.heading_level_6
        ) {
            extensions.push((await import("@tiptap/extension-heading")).Heading);
        }

        if (tb.blockquote) {
            extensions.push((await import("@tiptap/extension-blockquote")).Blockquote);
        }

        if (tb.code_block) {
            extensions.push((await import("@tiptap/extension-code-block")).CodeBlock);
        }

        if (tb.bold) {
            extensions.push((await import("@tiptap/extension-bold")).Bold);
        }

        if (tb.italic) {
            extensions.push((await import("@tiptap/extension-italic")).Italic);
        }

        if (tb.strike) {
            extensions.push((await import("@tiptap/extension-strike")).Strike);
        }

        if (tb.code) {
            extensions.push((await import("@tiptap/extension-code")).Code);
        }

        if (tb.unordered_list || tb.ordered_list) {
            extensions.push((await import("@tiptap/extension-list-item")).ListItem);
        }

        if (tb.unordered_list) {
            extensions.push((await import("@tiptap/extension-bullet-list")).BulletList);
        }

        if (tb.ordered_list) {
            extensions.push(
                (await import("@tiptap/extension-ordered-list")).OrderedList
            );
        }

        if (
            tb.table_create ||
            tb.table_add_row_above ||
            tb.table_add_row_below ||
            tb.table_add_column_left ||
            tb.table_add_column_right ||
            tb.table_header_cell ||
            tb.table_header_row ||
            tb.table_header_column ||
            tb.table_merge_cells ||
            tb.table_remove ||
            tb.table_remove_column ||
            tb.table_remove_row
        ) {
            extensions.push(
                (await import("@tiptap/extension-table")).default.configure({
                    resizable: true,
                })
            );
            extensions.push((await import("@tiptap/extension-table-cell")).default);
            extensions.push((await import("@tiptap/extension-table-header")).default);
            extensions.push((await import("@tiptap/extension-table-row")).default);
            has_tables = true;
        }

        if (tb.horizontal_rule) {
            extensions.push(
                (await import("@tiptap/extension-horizontal-rule")).HorizontalRule
            );
        }

        if (tb.undo || tb.redo) {
            extensions.push((await import("@tiptap/extension-history")).History);
        }

        if (tb.link) {
            extensions.push(
                (await import("@tiptap/extension-link")).default.configure({
                    HTMLAttributes: { target: null, rel: null }, // don't set these attributes.
                    openOnClick: false, // don't open documents while editing.
                    linkOnPaste: false,
                })
            );
        }

        if (tb.image) {
            extensions.push((await import("@tiptap/extension-image")).default);
        }

        if (tb.image || has_tables) {
            extensions.push((await import("@tiptap/extension-dropcursor")).default);
        }

        return extensions;
    },

    toolbar_post_init() {
        if (Object.values(this.toolbar).length === 0) {
            return;
        }

        const connect_button = (btn, method, active_name, check_disabled, args = []) => {
            if (!btn) {
                return;
            }
            btn.addEventListener("click", () => {
                this.editor
                    .chain()
                    .focus()
                    [method](...args)
                    .run();
                if (active_name || check_disabled) {
                    this.editor.emit("selectionUpdate");
                }
            });
            if (active_name || check_disabled) {
                this.editor.on("selectionUpdate", () => {
                    if (active_name) {
                        this.editor.isActive(active_name, ...args)
                            ? btn.classList.add("active")
                            : btn.classList.remove("active");
                    }
                    if (check_disabled) {
                        btn.disabled = !this.editor.can()[method];
                    }
                });
            }
        };

        const tb = this.toolbar;

        connect_button(tb.heading_level_1, "toggleHeading", "heading", false, [{ level: 1 }]); // prettier-ignore
        connect_button(tb.heading_level_2, "toggleHeading", "heading", false, [{ level: 2 }]); // prettier-ignore
        connect_button(tb.heading_level_3, "toggleHeading", "heading", false, [{ level: 3 }]); // prettier-ignore
        connect_button(tb.heading_level_4, "toggleHeading", "heading", false, [{ level: 4 }]); // prettier-ignore
        connect_button(tb.heading_level_5, "toggleHeading", "heading", false, [{ level: 5 }]); // prettier-ignore
        connect_button(tb.heading_level_6, "toggleHeading", "heading", false, [{ level: 6 }]); // prettier-ignore
        connect_button(tb.paragraph, "setParagraph", "paragraph");
        connect_button(tb.blockquote, "toggleBlockquote", "blockquote");
        connect_button(tb.code_block, "toggleCodeBlock", "codeBlock");
        connect_button(tb.bold, "toggleBold", "bold");
        connect_button(tb.italic, "toggleItalic", "italic");
        connect_button(tb.strike, "toggleStrike", "strike");
        connect_button(tb.code, "toggleCode", "code");
        connect_button(tb.unordered_list, "toggleBulletList", "bulletList");
        connect_button(tb.ordered_list, "toggleOrderedList", "orderedList");
        connect_button(tb.table_create, "insertTable", null, false, [{ rows: 3, cols: 3, withHeaderRow: true }]); // prettier-ignore
        connect_button(tb.table_add_row_above, "addRowBefore", null, true);
        connect_button(tb.table_add_row_below, "addRowAfter", null, true);
        connect_button(tb.table_add_column_left, "addColumnBefore", null, true);
        connect_button(tb.table_add_column_right, "addColumnAfter", null, true);
        connect_button(tb.table_header_cell, "toggleHeaderCell", null, true);
        connect_button(tb.table_header_row, "toggleHeaderRow", null, true);
        connect_button(tb.table_header_column, "toggleHeaderColumn", null, true);
        connect_button(tb.table_remove, "deleteTable", null, true);
        connect_button(tb.table_remove_row, "deleteRow", null, true);
        connect_button(tb.table_remove_column, "deleteColumn", null, true);
        connect_button(tb.horizontal_rule, "setHorizontalRule");
        connect_button(tb.undo, "undo");
        connect_button(tb.redo, "redo");

        if (tb.table_merge_cells) {
            tb.table_merge_cells.addEventListener("click", () => {
                this.editor.chain().focus().mergeOrSplit().run();
                this.editor.emit("selectionUpdate");
            });
            this.editor.on("selectionUpdate", () => {
                if (this.editor.can().mergeCells()) {
                    tb.table_merge_cells.classList.add("active");
                }
                if (this.editor.can().splitCell()) {
                    tb.table_merge_cells.classList.remove("active");
                }
                tb.table_merge_cells.disabled = !this.editor.can().mergeOrSplit();
            });
        }

        // non-standard functionality
        if (tb.link) {
            tb.link.addEventListener("click", () => {
                // Add the document event listener on link selector click only once.
                // That way we can register this handler each time for any number of tiptap instances.
                document.addEventListener(
                    "editor-link-widget--link-selected",
                    (e) => {
                        const form_data = e?.detail?.form_data;
                        const url = form_data?.get?.("url");
                        if (!url) {
                            log.warn("No link defined.");
                            return;
                        }
                        this.editor.chain().focus().setLink({ href: url }).run();
                        this.editor.emit("selectionUpdate");
                    },
                    { once: true }
                );

                this.editor.on("selectionUpdate", () => {
                    this.editor.isActive("link")
                        ? tb.link.classList.add("active")
                        : tb.link.classList.remove("active");
                    this.editor.can().chain().setLink().run()
                        ? tb.link.classList.remove("disabled")
                        : tb.link.classList.add("disabled");
                });
            });
        }

        if (tb.image) {
            tb.image.addEventListener("click", () => {
                // Add the document event listener on image selector click only once.
                // That way we can register this handler each time for any number of tiptap instances.
                document.addEventListener(
                    "editor-image-widget--image-selected",
                    (e) => {
                        const form_data = e?.detail?.form_data;
                        const src = form_data?.get?.("src");
                        if (!src) {
                            log.warn("No image selected.");
                            return;
                        }
                        this.editor
                            .chain()
                            .focus()
                            .setImage({
                                src: src,
                                alt: form_data.get("alt"),
                                title: form_data.get("title"),
                            })
                            .run();
                    },
                    { once: true }
                );
            });
        }
    },
});
