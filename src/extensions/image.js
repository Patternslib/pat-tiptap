import { Image as TipTapImage } from "@tiptap/extension-image";

export const Image = TipTapImage.extend({
    allowGapCursor: false,
    draggable: false,
    isolating: true,
    selectable: false,

    parseHTML() {
        return [
            {
                tag: "img[src]",
            },
        ];
    },
});

export default Image;
