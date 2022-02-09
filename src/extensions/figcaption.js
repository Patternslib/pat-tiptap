// From: tiptap/demos/src/Experiments/GenericFigure/Vue/figcaption.ts
import { Node, mergeAttributes } from "@tiptap/core";

const Figcaption = Node.create({
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
    selectable: false,

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

export default Figcaption;
