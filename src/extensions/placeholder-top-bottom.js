import { Extension } from "@tiptap/core";
import { Decoration, DecorationSet } from "prosemirror-view";
import { Plugin } from "prosemirror-state";

export const PlaceholderTopBottom = Extension.create({
    name: "placeholder-top-bottom",

    defaultOptions: {
        placeholder_top_class: "placeholder-top",
        placeholder_bottom_class: "placeholder-bottom",
        placeholder_top_text: "Add content to the top …",
        placeholder_bottom_text: "Add content to the bottom …",
        placeholder_class: "placeholder",
        placeholder_text: "Add content here …",
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                props: {
                    decorations: ({ doc }) => {
                        if (!this.editor.isEditable) {
                            return;
                        }

                        const is_empty =
                            !doc.firstChild ||
                            (doc.firstChild === doc.lastChild &&
                                doc.firstChild.content.size === 0);

                        const decorations = [];

                        if (is_empty) {
                            // Add a placeholder for the empty document
                            const deco_top = Decoration.node(0, 2, {
                                "class": this.options.placeholder_class,
                                "data-placeholder": this.options.placeholder_text,
                            });
                            decorations.push(deco_top);
                        } else {
                            const deco_top = Decoration.node(0, 2, {
                                "class": this.options.placeholder_top_class,
                                "data-placeholder": this.options.placeholder_top_text,
                            });
                            decorations.push(deco_top);

                            const deco_bottom = Decoration.node(
                                doc.content.size - 2,
                                doc.content.size,
                                {
                                    "class": this.options.placeholder_bottom_class,
                                    "data-placeholder":
                                        this.options.placeholder_bottom_text,
                                }
                            );
                            decorations.push(deco_bottom);
                        }

                        return DecorationSet.create(doc, decorations);
                    },
                },
            }),
        ];
    },
});
