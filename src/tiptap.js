import "regenerator-runtime/runtime"; // needed for ``await`` support
import "@patternslib/patternslib/src/core/form-data-event";
import Base from "@patternslib/patternslib/src/core/base";
import logging from "@patternslib/patternslib/src/core/logging";
import Parser from "@patternslib/patternslib/src/core/parser";
import utils from "@patternslib/patternslib/src/core/utils";
import dom from "@patternslib/patternslib/src/core/dom";

const log = logging.getLogger("tiptap");

export const parser = new Parser("tiptap");
parser.addArgument("collaboration-server", null);
parser.addArgument("collaboration-document", null);

parser.addArgument("toolbar-external", null);
parser.addArgument("image-panel", null);
parser.addArgument("link-panel", null);
parser.addArgument("source-panel", null);

export default Base.extend({
    name: "tiptap",
    trigger: ".pat-tiptap",

    toolbar: {},

    observer_image_panel: null,

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
        this.toolbar.source = tb.querySelector(".button-source");
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
        if (tb.link && this.options.linkPanel) {
            tb.link.addEventListener("click", async () => {
                await utils.timeout(10); // wait for modal to be shown

                const link_panel = document.querySelector(this.options.linkPanel);
                if (!link_panel) {
                    log.warn("No link panel found.");
                    return;
                }

                function reinit() {
                    const link_href = link_panel.querySelector("[name=tiptap-href]");
                    const link_text = link_panel.querySelector("[name=tiptap-text]");
                    const link_target = link_panel.querySelector("[name=tiptap-target]");
                    const link_confirm = link_panel.querySelector(".tiptap-confirm, [name=tiptap-confirm]"); // prettier-ignore
                    const link_remove = link_panel.querySelector("[name=tiptap-remove]");

                    // FORM INITIALIZATION
                    this.editor.commands.extendMarkRange("link");
                    const attrs = this.editor.getAttributes("link");
                    if (attrs?.href) {
                        link_href.value = attrs.href;
                    }
                    if (attrs?.target && link_target) {
                        link_target.checked = true;
                    }
                    const text_content = this.editor.state.doc.textBetween(
                        this.editor.state.selection.from,
                        this.editor.state.selection.to
                    );
                    if (text_content && link_text) {
                        link_text.value = text_content;
                    }

                    function update_callback(set_focus) {
                        const cmd = this.editor.chain();
                        if (set_focus === true) {
                            cmd.focus();
                        }
                        const link_text_value =
                            (link_text ? link_text.value : text_content) || "";
                        cmd.command(({ tr }) => {
                            // create prosemirror tree mark and node
                            const link_mark = this.editor.state.schema.marks.link.create(
                                {
                                    href: link_href.value,
                                    target:
                                        link_target && link_target.checked
                                            ? link_target?.value
                                            : null,
                                }
                            );
                            const link_node = this.editor.state.schema
                                .text(link_text_value)
                                .mark([link_mark]);
                            tr.replaceSelectionWith(link_node, false);
                            return true;
                        });
                        cmd.run();
                    }

                    // FORM UPDATE
                    if (link_confirm) {
                        // update on click on confirm
                        dom.add_event_listener(
                            link_confirm,
                            "click",
                            "tiptap_link_confirm",
                            () => update_callback(true)
                        );
                    } else {
                        // update on input/change
                        dom.add_event_listener(
                            link_href,
                            "input",
                            "tiptap_link_href",
                            update_callback.bind(this)
                        );
                        dom.add_event_listener(
                            link_text,
                            "input",
                            "tiptap_link_text",
                            update_callback.bind(this)
                        );
                        dom.add_event_listener(
                            link_target,
                            "change",
                            "tiptap_link_target",
                            update_callback.bind(this)
                        );
                    }

                    dom.add_event_listener(
                        link_remove,
                        "click",
                        "tiptap_link_remove",
                        () => this.editor.chain().focus().unsetLink().run()
                    );
                }

                reinit();
                const observer = new MutationObserver(reinit.bind(this));
                observer.observe(link_panel, {
                    childList: true,
                    subtree: true,
                    attributes: false,
                    characterData: false,
                });

                this.editor.on("selectionUpdate", () => {
                    this.editor.isActive("link")
                        ? tb.link.classList.add("active")
                        : tb.link.classList.remove("active");
                    this.editor.can().setLink()
                        ? tb.link.classList.remove("disabled")
                        : tb.link.classList.add("disabled");
                });
            });
        }

        if (tb.image && this.options.imagePanel) {
            tb.image.addEventListener("click", async () => {
                await utils.timeout(10); // wait for modal to be shown

                const image_panel = document.querySelector(this.options.imagePanel);
                if (!image_panel) {
                    log.warn("No image panel found.");
                    return;
                }

                function reinit() {
                    const image_src = image_panel.querySelector("[name=tiptap-src]");
                    const image_alt = image_panel.querySelector("[name=tiptap-alt]");
                    const image_title = image_panel.querySelector("[name=tiptap-title]");
                    const image_confirm = image_panel.querySelector(".tiptap-confirm, [name=tiptap-confirm]"); // prettier-ignore

                    function update_callback(set_focus) {
                        // Get the selected image on time of submitting
                        const selected_image_src = image_panel.querySelector(
                            `[name=tiptap-src][type=radio]:checked,
                                 [name=tiptap-src][type=checkbox]:checked,
                                 [name=tiptap-src][type=option]:checked,
                                 [name=tiptap-src][type=hidden],
                                 [name=tiptap-src][type=text]`
                        );

                        const cmd = this.editor.chain();
                        cmd.setImage({
                            src: selected_image_src.value,
                            alt: image_alt?.value || null,
                            title: image_title?.value || null,
                        });
                        if (set_focus === true) {
                            // set focus after setting image, otherwise image is
                            // selected and right away deleted when starting typing.
                            cmd.focus();
                        }
                        cmd.run();
                    }

                    // FORM UPDATE
                    if (image_confirm) {
                        // update on click on confirm
                        dom.add_event_listener(
                            image_confirm,
                            "click",
                            "tiptap_image_confirm",
                            () => update_callback(true)
                        );
                    } else {
                        // update on input/change
                        dom.add_event_listener(
                            image_src,
                            "change",
                            "tiptap_image_src",
                            update_callback.bind(this)
                        );
                        dom.add_event_listener(
                            image_alt,
                            "change",
                            "tiptap_image_alt",
                            update_callback.bind(this)
                        );
                        dom.add_event_listener(
                            image_title,
                            "change",
                            "tiptap_image_title",
                            update_callback.bind(this)
                        );
                    }
                }

                reinit();
                if (this.observer_image_panel) {
                    this.observer_image_panel.disconnect();
                }
                this.observer_image_panel = new MutationObserver(reinit.bind(this));
                this.observer_image_panel.observe(image_panel, {
                    childList: true,
                    subtree: true,
                    attributes: false,
                    characterData: false,
                });
            });
        }

        if (tb.source) {
            tb.source.addEventListener("click", async () => {
                await utils.timeout(10); // wait for modal to be shown

                const source_panel = document.querySelector(this.options.sourcePanel);
                if (!source_panel) {
                    log.warn("No source panel found.");
                    return;
                }

                function reinit() {
                    const source_text = source_panel.querySelector("[name=tiptap-source]"); // prettier-ignore
                    const source_confirm = source_panel.querySelector(".tiptap-confirm, [name=tiptap-confirm]"); // prettier-ignore

                    // set form to initial values
                    source_text.value = this.editor.getHTML();

                    function update_callback(set_focus) {
                        const cmd = this.editor.chain();
                        if (set_focus === true) {
                            cmd.focus();
                        }
                        cmd.setContent(source_text.value);
                        cmd.run();
                    }

                    if (source_confirm) {
                        // update on click on confirm
                        dom.add_event_listener(
                            source_confirm,
                            "click",
                            "tiptap_source_confirm",
                            () => update_callback(true)
                        );
                    } else {
                        // update on input/change
                        dom.add_event_listener(
                            source_text,
                            "input",
                            "tiptap_source_text",
                            update_callback.bind(this)
                        );
                    }
                }

                reinit();
                const observer = new MutationObserver(reinit.bind(this));
                observer.observe(source_panel, {
                    childList: true,
                    subtree: true,
                    attributes: false,
                    characterData: false,
                });
            });
        }
    },
});
