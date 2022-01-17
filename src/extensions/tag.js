import { mergeAttributes } from "@tiptap/core";
import { Mention as TipTapMention } from "@tiptap/extension-mention";
import { PluginKey } from "prosemirror-state";

export const TagPluginKey = new PluginKey("tag");

export const Tag = TipTapMention.extend({
    name: "tag",

    addOptions() {
        const config = {
            ...this.parent?.(),
            suggestion: {
                ...this.parent?.()?.suggestion,
                pluginKey: TagPluginKey,
                char: "#",
            },
            url_scheme: null,
        };
        return config;
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
