import { mergeAttributes } from "@tiptap/core";
import { Mention as TipTapMention } from "@tiptap/extension-mention";
import { PluginKey } from "prosemirror-state";

export const TagPluginKey = new PluginKey("tag");

export const Tag = TipTapMention.extend({
    name: "tag",
    defaultOptions: {
        ...TipTapMention.options,
        suggestion: {
            ...TipTapMention.options.suggestion,
            pluginKey: TagPluginKey,
            char: "#",
            command: ({ editor, range, props }) => {
                // increase range.to by one when the next node is of type "text"
                // and starts with a space character
                const nodeAfter = editor.view.state.selection.$to.nodeAfter;
                const overrideSpace = nodeAfter?.text?.startsWith(" ");

                if (overrideSpace) {
                    range.to += 1;
                }

                editor
                    .chain()
                    .focus()
                    .insertContentAt(range, [
                        {
                            type: "tag",
                            attrs: props,
                        },
                        {
                            type: "text",
                            text: " ",
                        },
                    ])
                    .run();
            },
            allow: ({ editor, range }) => {
                return editor.can().insertContentAt(range, { type: "tag" });
            },
        },
        url_scheme: null,
    },

    addAttributes() {
        return {
            id: {
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

            href: {
                default: null,
                parseHTML: (element) => element.getAttribute("href"),
                renderHTML: (attributes) => {
                    if (!attributes.id) {
                        return {};
                    }

                    return {
                        href: this.options.url_scheme.replace("{TAG}", attributes.id),
                    };
                },
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: "a[data-tag]",
            },
        ];
    },

    renderHTML({ node, HTMLAttributes }) {
        return [
            "a",
            mergeAttributes(
                { "data-tag": "" },
                this.options.HTMLAttributes,
                HTMLAttributes
            ),
            this.options.renderLabel({
                options: this.options,
                node,
            }),
        ];
    },
});
