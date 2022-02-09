// From: tiptap/demos/src/Experiments/GenericFigure/Vue/figure.ts
import { Node, mergeAttributes } from "@tiptap/core";
import { Plugin } from "prosemirror-state";

const Figure = Node.create({
    name: "figure",

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    group: "block",
    content: "block figcaption?",

    allowGapCursor: true,
    draggable: true,
    isolating: true,
    selectable: true,

    parseHTML() {
        return [
            {
                tag: `figure`,
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "figure",
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
            0,
        ];
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                props: {
                    handleDOMEvents: {
                        // prevent dragging nodes out of the figure
                        dragstart: (view, event) => {
                            if (!event.target) {
                                return false;
                            }

                            const pos = view.posAtDOM(event.target, 0);
                            const $pos = view.state.doc.resolve(pos);

                            if ($pos.parent.type === this.type) {
                                event.preventDefault();
                            }

                            return false;
                        },
                    },
                },
            }),
        ];
    },
});

export default Figure;
