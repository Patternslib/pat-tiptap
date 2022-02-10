import { Image as TipTapImage } from "@tiptap/extension-image";

export const ImageInline = TipTapImage.extend({
    name: "image-inline",

    addOptions() {
        return {
            inline: true,
            HTMLAttributes: {},
        };
    },

    allowGapCursor: false,
    atom: false,
    draggable: true,
    isolating: false,
    selectable: true,

    parseHTML() {
        return [
            {
                tag: "img[src]",
                // Should not be within a figure tag. For that we have image-figure.js
                getAttrs: (node) => node.closest("figure") === null && null, // prosemirror expects null for a successful check.
            },
        ];
    },
});

export default ImageInline;
