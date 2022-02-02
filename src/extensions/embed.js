// From: tiptap/demos/src/Experiments/GenericFigure/Vue/figure.ts
import { Node, mergeAttributes } from "@tiptap/core";
import { Plugin } from "prosemirror-state";

const Embed = Node.create({
    name: "embed",

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    group: "block",

    allowGapCursor: false,
    draggable: false,
    isolating: true,
    selectable: false,

    addAttributes() {
        return {
            src: {
                default: null,
            },
            title: {
                default: null,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: `iframe[src*="youtube.com"]`, //, iframe[src*="vimeo.com"]`,
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "iframe",
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                "data-type": this.name,
            }),
        ];
    },

    addCommands() {
        return {
            setEmbed:
                (options) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: options,
                    });
                },
        };
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

export default Embed;
