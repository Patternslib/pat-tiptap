import { mergeAttributes } from "@tiptap/core";
import { Table as TipTapTable } from "@tiptap/extension-table";

export const factory = () => {
    return TipTapTable.extend({
        parseHTML() {
            return [
                {
                    tag: "table",
                    getAttrs: (node) =>
                        node.closest("div.scroll-table") === null && null,
                },
                {
                    tag: "div",
                    getAttrs: (node) =>
                        node.matches(".scroll-table").getElementsByTagName("table") !==
                            null && null,
                },
            ];
        },
        renderHTML({ HTMLAttributes }) {
            return [
                "div",
                { class: "scroll-table" },
                [
                    "table",
                    mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
                    0,
                ],
            ];
        },
    });
};
