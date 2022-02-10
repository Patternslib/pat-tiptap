import { Node, mergeAttributes } from "@tiptap/core";

const ImageFigure = Node.create({
    name: "image-figure",

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            src: {
                default: null,
            },
            alt: {
                default: null,
            },
            title: {
                default: null,
            },
        };
    },

    group: "block",
    inline: false,

    allowGapCursor: false,
    atom: true,
    draggable: false,
    isolating: true,
    selectable: false,

    parseHTML() {
        return [
            {
                tag: "img",
                getAttrs: (node) => node.closest("figure") !== null && null, // prosemirror expects null for a successful check.
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["img", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
    },
});

export default ImageFigure;
