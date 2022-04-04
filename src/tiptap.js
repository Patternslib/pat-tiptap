import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "@patternslib/patternslib/src/core/base";
import Parser from "@patternslib/patternslib/src/core/parser";
import events from "@patternslib/patternslib/src/core/events";
import logging from "@patternslib/patternslib/src/core/logging";
import utils from "@patternslib/patternslib/src/core/utils";

export const log = logging.getLogger("tiptap");

export const parser = new Parser("tiptap");
parser.addArgument("collaboration-server", null);
parser.addArgument("collaboration-document", null);

parser.addArgument("toolbar-external", null);

parser.addArgument("image-panel", null);
parser.addArgument("embed-panel", null);
parser.addArgument("link-panel", null);
parser.addArgument("source-panel", null);

parser.addArgument("link-menu", null);
parser.addArgument("mentions-menu", null);
parser.addArgument("tags-menu", null);

// TODO: Remove with next major version.
// BBB - Compatibility aliases
parser.addAlias("context-menu-link", "link-menu");
parser.addAlias("context-menu-mentions", "mentions-menu");
parser.addAlias("context-menu-tags", "tags-menu");

export default Base.extend({
    name: "tiptap",
    trigger: ".pat-tiptap",

    async init() {
        // Constructor
        this.toolbar = {};
        this.toolbar_el = null;
        //
        this.observer_embed_panel = null;
        this.observer_source_panel = null;

        const TipTap = (await import("@tiptap/core")).Editor;
        const ExtDocument = (await import("@tiptap/extension-document")).default;
        const ExtParagraph = (await import("@tiptap/extension-paragraph")).default;
        const ExtText = (await import("@tiptap/extension-text")).default;

        this.focus_handler = (await import("./focus-handler")).focus_handler;

        this.options = parser.parse(this.el, this.options);

        // Hide element which will be replaced with tiptap instance
        this.el.style.display = "none";
        // Create container for tiptap
        const container = document.createElement("div");
        container.setAttribute("class", "tiptap-container");
        this.el.after(container);

        // Support for pat-autofocus and autofocus: Set focus depending on textarea's focus setting.
        const set_focus =
            this.el.classList.contains("pat-autofocus") ||
            this.el.hasAttribute("autofocus");

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

        const extra_extensions = [
            // Allow non-paragraph line-breaks by default.
            (await import("@tiptap/extension-hard-break")).default.configure(),
            // Gapcursor for images, tables etc to be able to add content below/above.
            (await import("@tiptap/extension-gapcursor")).Gapcursor.configure(),
        ];
        const placeholder = this.el.getAttribute("placeholder");
        if (placeholder) {
            extra_extensions.push(
                (await import("@tiptap/extension-placeholder")).Placeholder.configure({
                    placeholder: placeholder,
                })
            );
        }

        // Mentions extension
        if (this.options.mentionsMenu) {
            extra_extensions.push(
                (await import("./extensions/suggestion"))
                    .SuggestionFactory({
                        app: this,
                        name: "mention",
                        char: "@",
                        plural: "mentions",
                    })
                    .configure({
                        url: this.options.mentionsMenu,
                    })
            );
        }

        // Tags extension
        if (this.options.tagsMenu) {
            extra_extensions.push(
                (await import("./extensions/suggestion"))
                    .SuggestionFactory({
                        app: this,
                        name: "tag",
                        char: "#",
                        plural: "tags",
                    })
                    .configure({
                        url: this.options.tagsMenu,
                    })
            );
        }

        this.toolbar_el = this.options.toolbarExternal
            ? document.querySelector(this.options.toolbarExternal)
            : null;
        if (this.toolbar_el) {
            const focus_handler_targets = (await import("./focus-handler")).TARGETS; // prettier-ignore
            focus_handler_targets.push(this.toolbar_el); // We register the focus handler on itself.
            this.focus_handler(this.toolbar_el);
        }

        this.toolbar_pre_init();
        this.editor = new TipTap({
            element: container,
            extensions: [
                ExtDocument,
                ExtText,
                ExtParagraph,
                ...(await this.toolbar_extensions()),
                ...extra_extensions,
            ],
            content: getText(),
            onUpdate() {
                // Note: ``this`` is the editor instance.
                setText(this.getHTML());
            },
            onFocus: async () => {
                // Note: ``this`` is the pattern instance.
                utils.timeout(1); // short timeout to ensure focus class is set even if tiptap_blur_handler is called concurrently.
                this.toolbar_el?.classList.add("tiptap-focus");
            },
            onBlur: () => {
                // Note: ``this`` is the pattern instance.
                this.toolbar_el?.classList.remove("tiptap-focus");
            },
            autofocus: set_focus,
        });
        this.toolbar_post_init();
    },

    toolbar_pre_init() {
        // pre-initialization step:
        // Search for available toolbar buttons.

        const tb = this.toolbar_el;
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
        this.toolbar.embed = tb.querySelector(".button-embed");
        this.toolbar.source = tb.querySelector(".button-source");
    },

    async toolbar_extensions() {
        // Compile a list of TipTap extensions based on available toolbar buttons.

        // Btw, we need to import the toolbar extensions upfront for the editor to be initialized.
        // See: https://github.com/ueberdosis/tiptap/issues/1044

        const extensions = [];

        if (Object.values(this.toolbar).length === 0) {
            return extensions;
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
            extensions.push((await import("./extensions/heading")).Heading);
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
                (await import("./extensions/link")).factory().configure({
                    HTMLAttributes: { target: null, rel: null }, // don't set these attributes.
                    openOnClick: false, // don't open documents while editing.
                    linkOnPaste: false,
                })
            );
        }

        if (tb.image) {
            extensions.push((await import("./extensions/image-inline")).default);
            extensions.push((await import("./extensions/image-figure")).factory());
        }

        if (tb.embed) {
            extensions.push((await import("./extensions/embed")).default);
        }

        if (tb.image || tb.embed || has_tables) {
            extensions.push((await import("@tiptap/extension-dropcursor")).default);
            extensions.push((await import("./extensions/figure")).default);
            extensions.push((await import("./extensions/figcaption")).default);
        }

        return extensions;
    },

    async toolbar_post_init() {
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
                // Dispatch a custom event for further customization
                this.editor.options.element.dispatchEvent(
                    new Event(`pat-tiptap--${method}`)
                );
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

        if (tb.link && this.options.link?.panel) {
            (await import("./extensions/link")).init({ app: this, button: tb.link });
        }

        if (tb.image && this.options.imagePanel) {
            (await import("./extensions/image-figure")).init({ app: this, button: tb.image }); // prettier-ignore
        }

        if (tb.embed && this.options.embedPanel) {
            // Initialize modal after it has injected.
            tb.embed.addEventListener(
                "pat-modal-ready",
                this.initialize_embed_panel.bind(this)
            );
        }

        if (tb.source && this.options.sourcePanel) {
            // Initialize modal after it has injected.
            tb.source.addEventListener(
                "pat-modal-ready",
                this.initialize_source_panel.bind(this)
            );
        }
    },

    initialize_embed_panel() {
        const embed_panel = document.querySelector(this.options.embedPanel);
        if (!embed_panel) {
            log.warn("No embed panel found.");
            return;
        }
        this.focus_handler(embed_panel);

        const reinit = () => {
            const embed_src = embed_panel.querySelector("[name=tiptap-src]");
            const embed_title = embed_panel.querySelector("[name=tiptap-title]");
            const embed_caption = embed_panel.querySelector("[name=tiptap-caption]");
            const embed_confirm = embed_panel.querySelector(".tiptap-confirm, [name=tiptap-confirm]"); // prettier-ignore

            const update_callback = (set_focus) => {
                const cmd = this.editor.chain();
                cmd.insertContent({
                    type: "figure",
                    content: [
                        {
                            type: "embed",
                            attrs: {
                                src: embed_src.value,
                                ...(embed_title?.value && { title: embed_title?.value }),
                            },
                        },
                        // Conditionally add a figcaption
                        ...(embed_caption?.value
                            ? [
                                  {
                                      type: "figcaption",
                                      content: [
                                          {
                                              type: "text",
                                              text: embed_caption.value,
                                          },
                                      ],
                                  },
                              ]
                            : []),
                    ],
                });
                if (set_focus === true) {
                    // set focus after setting embed, otherwise embed is
                    // selected and right away deleted when starting typing.
                    cmd.focus();
                }
                cmd.run();
            };

            // FORM UPDATE
            if (embed_confirm) {
                // update on click on confirm
                events.add_event_listener(
                    embed_confirm,
                    "click",
                    "tiptap_embed_confirm",
                    () => update_callback.bind(this)(true)
                );
            } else {
                // update on input/change
                events.add_event_listener(
                    embed_src,
                    "change",
                    "tiptap_embed_src",
                    update_callback.bind(this)
                );
                events.add_event_listener(
                    embed_title,
                    "change",
                    "tiptap_embed_title",
                    update_callback.bind(this)
                );
                events.add_event_listener(
                    embed_caption,
                    "change",
                    "tiptap_embed_caption",
                    update_callback.bind(this)
                );
            }
        };

        reinit();
        if (this.observer_embed_panel) {
            this.observer_embed_panel.disconnect();
        }
        this.observer_embed_panel = new MutationObserver(reinit.bind(this));
        this.observer_embed_panel.observe(embed_panel, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false,
        });
    },

    initialize_source_panel() {
        const source_panel = document.querySelector(this.options.sourcePanel);
        if (!source_panel) {
            log.warn("No source panel found.");
            return;
        }
        this.focus_handler(source_panel);

        const reinit = () => {
            const source_text = source_panel.querySelector("[name=tiptap-source]"); // prettier-ignore
            const source_confirm = source_panel.querySelector(".tiptap-confirm, [name=tiptap-confirm]"); // prettier-ignore

            // set form to initial values
            source_text.value = this.editor.getHTML();
            source_text.dispatchEvent(new Event("input"));

            const update_callback = (set_focus) => {
                const cmd = this.editor.chain();
                if (set_focus === true) {
                    cmd.focus();
                }
                cmd.setContent(source_text.value, true);
                cmd.run();
            };

            if (source_confirm) {
                // update on click on confirm
                events.add_event_listener(
                    source_confirm,
                    "click",
                    "tiptap_source_confirm",
                    () => update_callback.bind(this)(true)
                );
            } else {
                // update on input/change
                events.add_event_listener(
                    source_text,
                    "input",
                    "tiptap_source_text",
                    update_callback.bind(this)
                );
            }
        };

        reinit();
        if (this.observer_source_panel) {
            this.observer_source_panel.disconnect();
        }
        this.observer_source_panel = new MutationObserver(reinit.bind(this));
        this.observer_source_panel.observe(source_panel, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false,
        });
    },
});
