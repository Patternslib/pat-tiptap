import { Node, mergeAttributes } from "@tiptap/core";
import { PluginKey } from "prosemirror-state";
import { Suggestion as ProseMirrorSuggestion } from "@tiptap/suggestion";
import { context_menu, context_menu_close } from "../context_menu";
import { focus_handler } from "../focus-handler";
import Base from "@patternslib/patternslib/src/core/base";
import dom from "@patternslib/patternslib/src/core/dom";
import events from "@patternslib/patternslib/src/core/events";
import utils from "@patternslib/patternslib/src/core/utils";
import tiptap_utils from "../utils";

let context_menu_instance;

function pattern_suggestion(app, props) {
    // Dynamic pattern for the suggestion context menu

    return Base.extend({
        name: "tiptap-suggestion",
        trigger: ".tiptap-items",
        autoregister: false,
        init() {
            focus_handler(this.el);

            this.set_active(this.get_items()[0]);

            // Support selections via keyboard navigation.
            events.add_event_listener(
                this.el,
                "keydown",
                "tiptap-suggestion-keydown",
                (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const items = this.get_items();
                    const active = this.get_active();
                    if (e.code === "ArrowDown") {
                        // Select next or first.
                        if (!active) {
                            this.set_active(items[0]);
                        } else {
                            let next = active ? items.indexOf(active) + 1 : 0;
                            if (next >= items.length) {
                                // circular selection mode, start with first.
                                next = 0;
                                // TODO: should we load the next batch?
                            }
                            this.set_active(items[next]);
                        }
                    } else if (e.code === "ArrowUp") {
                        // Select previous or last.
                        if (!active) {
                            this.set_active(items[0]);
                        } else {
                            let prev = active ? items.indexOf(active) - 1 : 0;
                            if (prev < 0) {
                                // back to first
                                prev = items.length - 1;
                                // TODO: should we load the previous batch?
                            }
                            this.set_active(items[prev]);
                        }
                    } else if (e.code === "Enter") {
                        // Use selected to insert in text area.
                        const value = active?.dataset?.tiptapValue;
                        if (!value) {
                            // nothing selected.
                            return;
                        }

                        const el = active.querySelector("a");
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
                    const el = e.target.closest("a");
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
                "data-title": value,
                ...attributes,
            });
        },

        get_active() {
            // NOTE: jQuery extend via base pattern prevents usage of getter/setter.
            // TODO: Make getter/setter once Base is class based.

            // Get the currently selected item.
            return this.el.querySelector(".tiptap-item.active");
        },

        set_active(el) {
            if (!el) {
                // No item available, e.g. no search results and thus not this.items.
                return;
            }
            // Set an item to be selected.
            this.get_active()?.classList.remove("active");
            el.classList.add("active");
        },

        get_items() {
            // NOTE: jQuery extend via base pattern prevents usage of getter/setter.
            // TODO: Make getter/setter once Base is class based.

            // Get all items.
            return [...this.el.querySelectorAll(".tiptap-item")];
        },
    });
}

export const factory = ({ app, name, char, plural }) => {
    return Node.create({
        name: name,
        group: "inline",
        inline: true,
        selectable: false,
        atom: true,
        isolating: true,

        addOptions() {
            return {
                HTMLAttributes: {},
                url: null,
                renderLabel({ options, node }) {
                    return `${options.suggestion.char}${node.attrs["data-title"]}`;
                },
                suggestion: {
                    char: char,
                    pluginKey: new PluginKey(name),
                },
            };
        },

        addAttributes() {
            const attributes = {
                "class": {},
                "contenteditable": {},
                "href": {},
                "target": {},
                "title": {},
                "data-id": {},
                "data-title": {},
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

            for (const attr of tiptap_utils.accessibility_attributes) {
                // Add a bunch of accessibility attributes
                attributes[attr] = {};
            }

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

                const ctx_close = () => {
                    context_menu_close({
                        instance: context_menu_instance,
                        pattern_name: "tiptap-suggestion",
                    });
                    context_menu_instance = null;
                    this.editor.off("selectionUpdate", _debounced_context_menu);
                };

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
                            //
                            // Get the text input between the suggestion
                            // character and the cursor.
                            // This is then used to filter items and submitted
                            // as query string to the server.
                            let from = props.range.from + 1; // start w/out suggestion character.
                            let to = transaction
                                ? transaction.curSelection.$head.pos
                                : props.range.to;
                            const text = this.editor.state.doc.textBetween(from, to, ""); // prettier-ignore

                            // Add query string filter value.
                            // The query string filter key must be already present on the URL.
                            url = text ? url + text : url;

                            const ctx_menu = await context_menu({
                                url: url,
                                editor: this.editor,
                                instance: context_menu_instance,
                                pattern: pattern_suggestion(app, props),
                                extra_class: `tiptap-${plural || this.name}`, // plural form
                            });

                            return ctx_menu;
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
                        ctx_close();
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
