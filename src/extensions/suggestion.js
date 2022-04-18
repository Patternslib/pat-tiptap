import { Node, mergeAttributes } from "@tiptap/core";
import { PluginKey } from "prosemirror-state";
import { Suggestion as ProseMirrorSuggestion } from "@tiptap/suggestion";
import { context_menu, context_menu_close } from "../context_menu";
import { focus_handler } from "../focus-handler";
import dom from "@patternslib/patternslib/src/core/dom";
import events from "@patternslib/patternslib/src/core/events";
import utils from "@patternslib/patternslib/src/core/utils";

let context_menu_instance;

function pattern_suggestion(app, props) {
    // Dynamic pattern for the suggestion context menu
    return {
        name: "tiptap-suggestion",
        trigger: ".tiptap-items",
        async init($el) {
            focus_handler($el[0]);

            this.el = $el[0];

            this.active = this.items[0];

            // Support selections via keyboard navigation.
            events.add_event_listener(
                this.el,
                "keydown",
                "tiptap-suggestion-keydown",
                (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (e.code === "ArrowDown") {
                        // Select next or first.
                        if (!this.active) {
                            this.active = this.items[0];
                        } else {
                            let next = this.active
                                ? this.items.indexOf(this.active) + 1
                                : 0;
                            if (next >= this.items.length) {
                                // circular selection mode, start with first.
                                next = 0;
                                // TODO: should we load the next batch?
                            }
                            this.active = this.items[next];
                        }
                    } else if (e.code === "ArrowUp") {
                        // Select previous or last.
                        if (!this.active) {
                            this.active = this.items[0];
                        } else {
                            let prev = this.active
                                ? this.items.indexOf(this.active) - 1
                                : 0;
                            if (prev < 0) {
                                // back to first
                                prev = this.items.length - 1;
                                // TODO: should we load the previous batch?
                            }
                            this.active = this.items[prev];
                        }
                    } else if (e.code === "Enter") {
                        // Use selected to insert in text area.
                        const value = this.active?.dataset?.tiptapValue;
                        if (!value) {
                            // nothing selected.
                            return;
                        }

                        const el = this.active.querySelector("a");
                        this.command(el, value);
                    }
                }
            );

            // Select and insert to text area by clicking.
            events.add_event_listener(
                this.el,
                "click",
                "tiptap-suggestion-click",
                (e) => {
                    const el = e.target;
                    const value = dom.acquire_attribute(el, "data-tiptap-value");
                    if (!value) {
                        // clicked anywhere, but not on a selection item
                        return;
                    }

                    e.preventDefault();
                    this.command(el, value);
                }
            );
        },

        command(el, value) {
            const attributes = Object.fromEntries(
                [...el.attributes].map((it) => [it.name, it.value])
            );
            props.command({
                id: value,
                ...attributes,
            });
        },

        get active() {
            // Get the currently selected item.
            return this.el.querySelector(".tiptap-item.active");
        },

        set active(el) {
            // Set an item to be selected.
            this.active?.classList.remove("active");
            el.classList.add("active");
        },

        get items() {
            // Get all items.
            return [...this.el.querySelectorAll(".tiptap-item")];
        },
    };
}

export const factory = ({ app, name, char, plural }) => {
    return Node.create({
        name: name,
        group: "inline",
        inline: true,
        selectable: false,
        atom: true,

        addOptions() {
            return {
                HTMLAttributes: {},
                url: null,
                renderLabel({ options, node }) {
                    return `${options.suggestion.char}${
                        node.attrs.label ?? node.attrs.id
                    }`;
                },
                suggestion: {
                    char: char,
                    pluginKey: new PluginKey(name),
                },
            };
        },

        addAttributes() {
            const attributes = {
                "id": {
                    default: null,
                    parseHTML: (element) => element.getAttribute("data-id"),
                    renderHTML: (attributes) => {
                        if (!attributes.id) {
                            return {};
                        }

                        return {
                            "data-id": attributes.id,
                        };
                    },
                },

                "class": {},
                "href": {},
                "target": {},
                "title": {},
                // add a lot of patterns data attributes...
                "data-pat-inject": {},
                "data-pat-forward": {},
                "data-pat-modal": {},
                "data-pat-switch": {},
                "data-pat-toggle": {},
                "data-pat-tooltip": {},
            };

            // Needs to be always included. A default of "" makes sure it is.
            attributes[`data-${this.name}`] = { default: "" };

            return attributes;
        },

        parseHTML() {
            return [
                {
                    tag: `a[data-${this.name}]`,
                },
            ];
        },

        renderHTML({ node, HTMLAttributes }) {
            return [
                "a",
                mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
                this.options.renderLabel({
                    options: this.options,
                    node,
                }),
            ];
        },

        renderText({ node }) {
            return this.options.renderLabel({
                options: this.options,
                node,
            });
        },

        addKeyboardShortcuts() {
            return {
                Enter: () => {
                    if (context_menu_instance) {
                        // While suggestion menu is open, do not add a line-break to the text.
                        // Handle the ``Enter`` key as early as possible to prevent a line-break to happen.

                        // Dispatch the event to the context menu pattern
                        // while still keeping the focus in the textarea.
                        context_menu_instance.tippy?.popper
                            ?.querySelector(".tiptap-items")
                            ?.dispatchEvent(
                                new KeyboardEvent("keydown", {
                                    code: "Enter",
                                })
                            );

                        return true;
                    }
                    // Normal case, do not prevent the Enter key to add a line break.
                    return false;
                },

                Backspace: ({ editor }) =>
                    editor.commands.command(({ tr, state }) => {
                        let is_suggestion = false;
                        const { selection } = state;
                        const { empty, anchor } = selection;

                        if (!empty) {
                            return false;
                        }

                        state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
                            if (node.type.name === this.name) {
                                is_suggestion = true;
                                tr.insertText(
                                    this.options.suggestion.char || "",
                                    pos,
                                    pos + node.nodeSize
                                );

                                return false;
                            }
                        });

                        return is_suggestion;
                    }),
            };
        },

        addProseMirrorPlugins() {
            // Suggestion command
            this.options.suggestion.command = ({ editor, range, props }) => {
                // Extend range until current cursor position.
                range.to = editor.state.selection.$head.pos;
                editor
                    .chain()
                    .focus()
                    .insertContentAt(range, [
                        {
                            type: this.name,
                            attrs: props,
                        },
                        {
                            type: "text",
                            text: " ",
                        },
                    ])
                    .run();
            };

            // Suggestion render
            this.options.suggestion.render = () => {
                let _debounced_context_menu;
                return {
                    onStart: async (props) => {
                        const _context_menu = async (
                            { transaction } = { transaction: null } // optional destructuring
                        ) => {
                            // If the transaction parameter is given then this
                            // is a ``selectionUpdate``.
                            let url = this.options.url;
                            // Now get the text and pass it to the backend to
                            // query for the filter value.
                            if (transaction) {
                                // Get the text input between the suggestion
                                // character and the cursor.
                                // This is then used to filter items and submitted
                                // as query string to the server.
                                let from = props.range.to;
                                let to = transaction.curSelection.$head.pos;
                                const text = this.editor.state.doc.textBetween(from, to, ""); // prettier-ignore

                                // Add query string filter value.
                                // The query string filter key must be already present on the URL.
                                url = text ? url + text : url;
                            }
                            return await context_menu({
                                url: url,
                                editor: this.editor,
                                instance: context_menu_instance,
                                pattern: pattern_suggestion(app, props),
                                extra_class: `tiptap-${plural || this.name}`, // plural form
                            });
                        };
                        _debounced_context_menu = utils.debounce(async (transaction) => {
                            context_menu_instance = await _context_menu(transaction);
                        }, 200);

                        // Immediately open the suggestion context menu.
                        context_menu_instance = await _context_menu();

                        // ... and reload it after text input after a short timeout.
                        this.editor.on("selectionUpdate", _debounced_context_menu);
                    },
                    onKeyDown: (props) => {
                        if (!context_menu_instance) {
                            //No context menu open, return.
                            return;
                        }

                        if (props.event.key === "Escape") {
                            context_menu_instance = context_menu_close({
                                instance: context_menu_instance,
                                pattern_name: "tiptap-suggestion",
                            });
                            this.editor.off("selectionUpdate", _debounced_context_menu);
                            return true;
                        }
                        if (
                            props.event.key === "ArrowDown" ||
                            props.event.key === "ArrowUp" ||
                            props.event.key === "Enter"
                        ) {
                            props.event.preventDefault();
                            props.event.stopPropagation();
                            const ctx = document.querySelector(".tiptap-items");
                            if (!ctx) {
                                return;
                            }

                            // Dispatch the event to the context menu pattern
                            // while still keeping the focus in the textarea.
                            ctx.dispatchEvent(
                                new KeyboardEvent("keydown", {
                                    code: props.event.key,
                                })
                            );
                        }
                    },
                    onExit: () => {
                        context_menu_instance = context_menu_close({
                            instance: context_menu_instance,
                            pattern_name: "tiptap-suggestion",
                        });
                        this.editor.off("selectionUpdate", _debounced_context_menu);
                    },
                };
            };

            // Suggestion allow
            this.options.suggestion.allow = ({ state, range }) => {
                const $from = state.doc.resolve(range.from);
                const type = state.schema.nodes[this.name];
                const allow = !!$from.parent.type.contentMatch.matchType(type);

                return allow;
            };

            return [
                ProseMirrorSuggestion({
                    editor: this.editor,
                    ...this.options.suggestion,
                }),
            ];
        },
    });
};
