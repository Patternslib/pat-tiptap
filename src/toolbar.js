import dom from "@patternslib/patternslib/src/core/dom";

export function init_pre({ app }) {
    // pre-initialization step:
    // Search for available toolbar buttons.

    const tb = app.toolbar_el;
    const toolbar = {};

    if (!tb) {
        return toolbar;
    }

    // paragraph formating
    toolbar.heading_level_1 = tb.querySelector(".button-heading-level-1");
    toolbar.heading_level_2 = tb.querySelector(".button-heading-level-2");
    toolbar.heading_level_3 = tb.querySelector(".button-heading-level-3");
    toolbar.heading_level_4 = tb.querySelector(".button-heading-level-4");
    toolbar.heading_level_5 = tb.querySelector(".button-heading-level-5");
    toolbar.heading_level_6 = tb.querySelector(".button-heading-level-6");
    toolbar.paragraph = tb.querySelector(".button-paragraph");
    toolbar.blockquote = tb.querySelector(".button-blockquote");
    toolbar.code_block = tb.querySelector(".button-code-block");

    // character formating
    toolbar.bold = tb.querySelector(".button-bold");
    toolbar.italic = tb.querySelector(".button-italic");
    toolbar.strike = tb.querySelector(".button-strike");
    toolbar.code = tb.querySelector(".button-code");

    // lists
    toolbar.unordered_list = tb.querySelector(".button-unordered-list");
    toolbar.ordered_list = tb.querySelector(".button-ordered-list");

    // tables
    toolbar.table_create = tb.querySelector(".button-table-create");
    toolbar.table_add_row_above = tb.querySelector(".button-table-add-row-above"); // prettier-ignore
    toolbar.table_add_row_below = tb.querySelector(".button-table-add-row-below"); // prettier-ignore
    toolbar.table_add_column_left = tb.querySelector(".button-table-add-column-left"); // prettier-ignore
    toolbar.table_add_column_right = tb.querySelector(".button-table-add-column-right"); // prettier-ignore
    toolbar.table_header_cell = tb.querySelector(".button-table-header-cell");
    toolbar.table_header_row = tb.querySelector(".button-table-header-row");
    toolbar.table_header_column = tb.querySelector(".button-table-header-column"); // prettier-ignore
    toolbar.table_merge_cells = tb.querySelector(".button-table-merge-cells");
    toolbar.table_remove = tb.querySelector(".button-table-remove");
    toolbar.table_remove_row = tb.querySelector(".button-table-remove-row");
    toolbar.table_remove_column = tb.querySelector(".button-table-remove-column"); // prettier-ignore

    // other
    toolbar.horizontal_rule = tb.querySelector(".button-horizontal-rule");

    // functionality
    toolbar.undo = tb.querySelector(".button-undo");
    toolbar.redo = tb.querySelector(".button-redo");

    // media/links
    toolbar.link = tb.querySelector(".button-link");
    toolbar.image = tb.querySelector(".button-image");
    toolbar.embed = tb.querySelector(".button-embed");
    toolbar.source = tb.querySelector(".button-source");

    return toolbar;
}

export async function init_extensions({ app }) {
    // Compile a list of TipTap extensions based on available toolbar buttons.

    // Btw, we need to import the toolbar extensions upfront for the editor to be initialized.
    // See: https://github.com/ueberdosis/tiptap/issues/1044

    const extensions = [];

    if (Object.values(app.toolbar).length === 0) {
        return extensions;
    }

    let has_tables = false;

    const tb = app.toolbar;
    if (
        tb.heading_level_1 ||
        tb.heading_level_2 ||
        tb.heading_level_3 ||
        tb.heading_level_4 ||
        tb.heading_level_5 ||
        tb.heading_level_6
    ) {
        extensions.push((await import("./extensions/heading")).factory());
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
        extensions.push((await import("@tiptap/extension-ordered-list")).OrderedList);
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
            (await import("./extensions/link")).factory().configure({
                HTMLAttributes: { target: null, rel: null }, // don't set these attributes.
                openOnClick: false, // don't open documents while editing.
                linkOnPaste: true,
            })
        );
    }

    if (tb.image) {
        extensions.push((await import("./extensions/image-inline")).factory());
        extensions.push((await import("./extensions/image-figure")).factory());
    }

    if (tb.embed) {
        extensions.push((await import("./extensions/embed")).factory());
    }

    if (tb.image || tb.embed || has_tables) {
        extensions.push((await import("@tiptap/extension-dropcursor")).default);
        extensions.push((await import("./extensions/figure")).factory());
        extensions.push((await import("./extensions/figcaption")).factory());
    }

    return extensions;
}

export async function init_post({ app }) {
    if (Object.values(app.toolbar).length === 0) {
        return;
    }

    const connect_button = (btn, method, active_name, check_disabled, args = []) => {
        if (!btn) {
            return;
        }
        btn.addEventListener("click", () => {
            if (dom.get_data(app.toolbar_el, "tiptap-instance", null) !== app) {
                // If this pat-tiptap instance is not the one which was last
                // focused, just return and do nothing.
                // This might be due to one toolbar shared by multiple editors.
                return;
            }

            app.editor
                .chain()
                .focus()
                [method](...args)
                .run();
            if (active_name || check_disabled) {
                app.editor.emit("selectionUpdate");
            }
            // Dispatch a custom event for further customization
            app.editor.options.element.dispatchEvent(new Event(`pat-tiptap--${method}`));
        });
        if (active_name || check_disabled) {
            app.editor.on("selectionUpdate", () => {
                if (active_name) {
                    app.editor.isActive(active_name, ...args)
                        ? btn.classList.add("active")
                        : btn.classList.remove("active");
                }
                if (check_disabled) {
                    btn.disabled = !app.editor.can()[method];
                }
            });
        }
    };

    const tb = app.toolbar;

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
            if (dom.get_data(app.toolbar_el, "tiptap-instance", null) !== app) {
                // If this pat-tiptap instance is not the one which was last
                // focused, just return and do nothing.
                // This might be due to one toolbar shared by multiple editors.
                return;
            }
            app.editor.chain().focus().mergeOrSplit().run();
            app.editor.emit("selectionUpdate");
        });
        app.editor.on("selectionUpdate", () => {
            if (app.editor.can().mergeCells()) {
                tb.table_merge_cells.classList.add("active");
            }
            if (app.editor.can().splitCell()) {
                tb.table_merge_cells.classList.remove("active");
            }
            tb.table_merge_cells.disabled = !app.editor.can().mergeOrSplit();
        });
    }

    if (tb.link && app.options.link?.panel) {
        (await import("./extensions/link")).init({ app: app, button: tb.link });
    }

    if (tb.image && app.options.imagePanel) {
        (await import("./extensions/image-figure")).init({ app: app, button: tb.image }); // prettier-ignore
    }

    if (tb.embed && app.options.embedPanel) {
        (await import("./extensions/embed")).init({ app: app, button: tb.embed });
    }

    if (tb.source && app.options.sourcePanel) {
        (await import("./extensions/source")).init({ app: app, button: tb.source });
    }
}
