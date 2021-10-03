import { mergeAttributes } from "@tiptap/core";
import { Mention as TipTapMention } from "@tiptap/extension-mention";

export const Mention = TipTapMention.extend({
    defaultOptions: {
        ...TipTapMention.options,
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
                        href: this.options.url_scheme.replace("{USER}", attributes.id),
                    };
                },
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: "a[data-mention]",
            },
        ];
    },

    renderHTML({ node, HTMLAttributes }) {
        return [
            "a",
            mergeAttributes(
                { "data-mention": "" },
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
