// From: tiptap/demos/src/Experiments/GenericFigure/Vue/figcaption.ts
import { Node, mergeAttributes } from "@tiptap/core";

export const factory = () => {
    return Node.create({
        name: "figcaption",

        addOptions() {
            return {
                HTMLAttributes: {},
            };
        },

        content: "inline*",

        allowGapCursor: false,
        draggable: false,
        isolating: true,
        selectable: true,

        parseHTML() {
            return [
                {
                    tag: "figcaption",
                },
            ];
        },

        renderHTML({ HTMLAttributes }) {
            return [
                "figcaption",
                mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
                0,
            ];
        },
    });
};
