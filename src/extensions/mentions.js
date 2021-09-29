import { Node, mergeAttributes } from "@tiptap/core";
import { PluginKey } from "prosemirror-state";
import { context_menu, context_menu_close } from "../context_menu";

export const MentionsPluginKey = new PluginKey("mentions");

export const Mentions = Node.create({
    name: "mention",

    defaultOptions: {
        HTMLAttributes: {},
        char: "@",
        url: null,
    },

    group: "inline",
    inline: true,
    selectable: false,
    atom: true,

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
            label: {
                default: null,
                parseHTML: (element) => element.getAttribute("data-label"),
                renderHTML: (attributes) => {
                    if (!attributes.label) {
                        return {};
                    }
                    return {
                        "data-label": attributes.label,
                    };
                },
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: "span[data-mention]",
            },
        ];
    },

    renderHTML({ node, HTMLAttributes }) {
        return [
            "span",
            mergeAttributes(
                { "data-mention": "" },
                this.options.HTMLAttributes,
                HTMLAttributes
            ),
            `${this.options.char}${node.attrs.label ?? node.attrs.id}`,
        ];
    },

    renderText({ node }) {
        return `${this.options.char}${node.attrs.label ?? node.attrs.id}`;
    },

    addKeyboardShortcuts() {
        return {
            "@": () => {
                context_menu(this.options.url, this.editor);
            },
        };
    },
});
