import { focus_handler } from "../focus-handler";
import log from "../tiptap";
import { Node, mergeAttributes } from "@tiptap/core";
import { Plugin } from "prosemirror-state";
import dom from "@patternslib/patternslib/src/core/dom";
import events from "@patternslib/patternslib/src/core/events";

let panel_observer;

function image_panel({ app }) {
    const image_panel = document.querySelector(app.options.imagePanel);
    if (!image_panel) {
        log.warn("No image panel found.");
        return;
    }
    focus_handler(image_panel);

    const reinit = () => {
        const image_src = image_panel.querySelector("[name=tiptap-src]");
        const image_alt = image_panel.querySelector("[name=tiptap-alt]");
        const image_title = image_panel.querySelector("[name=tiptap-title]");
        const image_caption = image_panel.querySelector("[name=tiptap-caption]");
        const image_confirm = image_panel.querySelector(".tiptap-confirm, [name=tiptap-confirm]"); // prettier-ignore

        const update_callback = (set_focus) => {
            // Get the selected image on time of submitting
            const selected_image_src = image_panel.querySelector(
                `[name=tiptap-src][type=radio]:checked,
                         [name=tiptap-src][type=checkbox]:checked,
                         [name=tiptap-src][type=option]:checked,
                         [name=tiptap-src][type=hidden],
                         [name=tiptap-src][type=text]`
            );

            const cmd = app.editor.chain();
            cmd.insertContent({
                type: "figure",
                content: [
                    {
                        type: "image-figure",
                        attrs: {
                            src: selected_image_src.value,
                            ...(image_alt?.value && { alt: image_alt.value }),
                            ...(image_title?.value && { title: image_title.value }),
                        },
                    },
                    // Conditionally add a figcaption
                    ...(image_caption?.value
                        ? [
                              {
                                  type: "figcaption",
                                  content: [
                                      {
                                          type: "text",
                                          text: image_caption.value,
                                      },
                                  ],
                              },
                          ]
                        : []),
                ],
            });
            if (set_focus === true) {
                // set focus after setting image, otherwise image is
                // selected and right away deleted when starting typing.
                cmd.focus();
            }
            cmd.run();
        };

        // FORM UPDATE
        if (image_confirm) {
            // update on click on confirm
            events.add_event_listener(
                image_confirm,
                "click",
                "tiptap_image_confirm",
                () => update_callback(true)
            );
        } else {
            // update on input/change
            events.add_event_listener(
                image_src,
                "change",
                "tiptap_image_src",
                update_callback
            );
            events.add_event_listener(
                image_alt,
                "change",
                "tiptap_image_alt",
                update_callback
            );
            events.add_event_listener(
                image_title,
                "change",
                "tiptap_image_title",
                update_callback
            );
            events.add_event_listener(
                image_caption,
                "change",
                "tiptap_image_caption",
                update_callback
            );
        }
    };

    reinit();
    if (panel_observer) {
        panel_observer.disconnect();
    }
    panel_observer = new MutationObserver(reinit);
    panel_observer.observe(image_panel, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false,
    });
}

export function init({ app, button }) {
    // Initialize modal after it has injected.
    button.addEventListener("pat-modal-ready", () => {
        if (dom.get_data(app.toolbar_el, "tiptap-instance", null) !== app) {
            // If this pat-tiptap instance is not the one which was last
            // focused, just return and do nothing.
            // This might be due to one toolbar shared by multiple editors.
            return;
        }
        image_panel({ app: app });
    });
}

export const factory = () => {
    return Node.create({
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

        addProseMirrorPlugins() {
            return [
                new Plugin({
                    props: {
                        handleDOMEvents: {
                            dragstart: (view, event) => {
                                // prevent drag/drop at all.
                                event.preventDefault();
                                return false;
                            },
                        },
                    },
                }),
            ];
        },
    });
};
