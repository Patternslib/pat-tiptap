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
        // NOTE: no ``this`` in this method. Therefore some code duplication.
        const is_youtube = (src) => src.indexOf("youtube.com") > -1;
        const is_vimeo = (src) => src.indexOf("vimeo.com") > -1;
        return [
            {
                tag: `iframe[src*="youtube.com"]`,
                getAttrs: (node) =>
                    (is_youtube(node.getAttribute("src")) ||
                        is_vimeo(node.getAttribute("src")) > -1) &&
                    null,
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        // NOTE: no ``this`` in this method. Therefore some code duplication.
        const is_youtube = (src) => src.indexOf("youtube.com") > -1;
        const is_vimeo = (src) => src.indexOf("vimeo.com") > -1;
        const attributes_youtube = {
            width: "560",
            height: "315",
            allowfullscreen: "",
            frameborder: "0",
        };
        const attributes_vimeo = {
            width: "640",
            height: "360",
            allowfullscreen: "",
            frameborder: "0",
        };

        let attrs;
        if (is_youtube(HTMLAttributes.src)) {
            attrs = {
                ...HTMLAttributes,
                ...attributes_youtube,
            };
            const vid = attrs.src.match(/watch.*v\=(?<vid>[^&]*)/)?.groups?.vid;
            if (vid) {
                attrs.src = `https://www.youtube.com/embed/${vid}`;
            }
        }
        if (is_vimeo(HTMLAttributes.src)) {
            attrs = {
                ...HTMLAttributes,
                ...attributes_vimeo,
            };
            const vid = attrs.src.match(/vimeo.com\/(?<vid>[0-9]*)/)?.groups?.vid;
            if (vid) {
                attrs.src = `https://player.vimeo.com/video/${vid}`;
            }
        }

        return ["iframe", mergeAttributes(this.options.HTMLAttributes, attrs)];
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
