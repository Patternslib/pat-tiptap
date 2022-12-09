import { context_menu, context_menu_close } from "../context_menu";
import { focus_handler } from "../focus-handler";
import { Node, mergeAttributes } from "@tiptap/core";
import { Plugin } from "prosemirror-state";
import { BasePattern } from "@patternslib/patternslib/src/core/basepattern";
import dom from "@patternslib/patternslib/src/core/dom";
import events from "@patternslib/patternslib/src/core/events";
import utils from "@patternslib/patternslib/src/core/utils";

let context_menu_instance;

function pattern_image_context_menu({ app: app }) {
    class Pattern extends BasePattern {
        static name = "tiptap-image-context-menu";
        static trigger = ".tiptap-image-context-menu";

        init() {
            focus_handler(this.el);

            const btn_edit = this.el.querySelector(".tiptap-edit-image");
            const btn_remove = this.el.querySelector(".tiptap-remove-image");

            btn_edit &&
                btn_edit.addEventListener("click", () => {
                    app.toolbar.image.click();
                });

            btn_remove &&
                btn_remove.addEventListener("click", () => {
                    app.editor.commands.selectParentNode(); // Also select the surrounding <figure>
                    app.editor.commands.deleteSelection();
                    app.editor.commands.focus();
                });
        }
    }

    return Pattern;
}

function image_panel({ app }) {
    // Not Base-pattern based due to two reasons:
    // - We need to reinitialize the pattern on already initialized nodes on possible tab-changes within the modal.
    // - We need to keep the _node_image and _figcaption references among re-initializations.
    return {
        name: "tiptap-image-panel",
        trigger: app.options.image?.panel,

        init(image_panel) {
            const image_srcs = image_panel.querySelectorAll("[name=tiptap-src]");
            const image_alt = image_panel.querySelector("[name=tiptap-alt]");
            const image_title = image_panel.querySelector("[name=tiptap-title]");
            const image_caption = image_panel.querySelector("[name=tiptap-caption]");
            const image_confirm = image_panel.querySelector(".tiptap-confirm, [name=tiptap-confirm]"); // prettier-ignore
            focus_handler(image_panel);

            const node_image = this.node_image;

            // Populate form fields
            if (node_image) {
                const current_src = node_image.attrs?.src;
                // Filter for all inputs with the same src value but not an empty src.
                let image_srcs_ = current_src
                    ? [...image_srcs].filter((it) => it.value === current_src)
                    : [];
                if (image_srcs_.length > 0) {
                    for (const image_src of image_srcs_) {
                        image_src.checked = true;
                        image_src.dispatchEvent(events.change_event());
                    }
                } else {
                    let image_srcs_ = [...image_srcs].filter(
                        (it) => it.type === "text" || it.type === "url"
                    );
                    if (image_srcs_.length > 0 && !image_srcs_[0].value) {
                        image_srcs_[0].value = current_src || "";
                    }
                }
                if (image_title && !image_title.value) {
                    image_title.value = node_image.attrs?.title || "";
                }
                if (image_alt && !image_alt.value) {
                    image_alt.value = node_image.attrs?.alt || "";
                }
            }

            // Get / set figcaption node, if it exists
            const node_figcaption = this.figcaption_node;
            if (node_figcaption && image_caption && !image_caption.value) {
                image_caption.value = node_figcaption.textContent || "";
            }

            const update_callback = (set_focus) => {
                // Get the selected image on time of submitting
                const selected_image_src = image_panel.querySelector(
                    `[name=tiptap-src][type=radio]:checked,
                         [name=tiptap-src][type=checkbox]:checked,
                         [name=tiptap-src][type=option]:checked,
                         [name=tiptap-src][type=hidden],
                         [name=tiptap-src][type=text],
                         [name=tiptap-src][type=url]`
                );

                app.editor.commands.insertContent({
                    type: "figure",
                    content: [
                        {
                            type: "image-figure",
                            attrs: {
                                src: selected_image_src.value,
                                ...(image_alt?.value && { alt: image_alt.value }),
                                ...(image_title?.value && {
                                    title: image_title.value,
                                }),
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
                    // set cursor after the image, otherwise image is
                    // selected and right away deleted when starting typing.
                    app.editor.commands.selectParentNode();
                    app.editor.commands.focus(app.editor.state.selection.to);
                    //app.editor.commands.blur();
                }
            };

            // FORM UPDATE
            const form = dom.querySelectorAllAndMe(image_panel, "form")?.[0];
            if (form) {
                events.add_event_listener(form, "submit", "tiptap_image_submit", (e) => {
                    // Prevent form submission when hitting "enter" within the form.
                    // The form is handled by JS only.
                    e.preventDefault();
                });
            }
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
                for (const image_src of image_srcs) {
                    events.add_event_listener(
                        image_src,
                        "change",
                        "tiptap_image_src",
                        update_callback
                    );
                }
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
        },

        _node_image: null,
        get node_image() {
            // Get image node
            if (this._node_image || this._node_image === undefined) {
                return this._node_image;
            }
            this._node_image = app.editor.state.doc.nodeAt(
                app.editor.state.selection.from
            );
            return this._node_image;
        },

        _figcaption: null, // initialized as null. If not found this will be set to undefined.
        get figcaption_node() {
            // Return cached figcaption and avoid calling this method multiple times.
            // Calling it again would select again a parent node which would lead to incorrect results.
            if (this._figcaption || this._figcaption === undefined) {
                return this._figcaption;
            }

            app.editor.commands.selectParentNode(); // Also select the surrounding <figure>
            const node_figure = app.editor.state.doc.nodeAt(
                app.editor.state.selection.from
            );
            const node_figcaption = node_figure?.content.content.filter(
                (it) => it.type.name === "figcaption"
            )?.[0];
            this._figcaption = node_figcaption; // if not found, this is undefined.
            return node_figcaption;
        },
    };
}

export function init({ app, button }) {
    button.addEventListener("click", () => {
        if (dom.get_data(app.toolbar_el, "tiptap-instance", null) !== app) {
            // If this pat-tiptap instance is not the one which was last
            // focused, just return and do nothing.
            // This might be due to one toolbar shared by multiple editors.
            return;
        }

        // Register the image-panel pattern.
        // Multiple registrations from different tiptap instances are possible
        // since we're registering it only after the toolbar's image button has
        // been clicked and clicking in another tiptap instance would override
        // previous registrations.
        const image_panel_pattern = image_panel({ app: app });
        document.addEventListener(
            "patterns-injected-delayed",
            (e) => {
                image_panel_pattern.init(e.detail.injected);

                // Register listener on modal for any DOM changes done by pat-inject.
                app.current_modal.addEventListener("patterns-injected-delayed", () => {
                    // Re-init panel after injection.
                    image_panel_pattern.init(app.current_modal);
                });
            },
            { once: true }
        );
    });

    app.editor.on("selectionUpdate", async () => {
        app.editor.isActive("image-figure")
            ? button.classList.add("active")
            : button.classList.remove("active");
        app.editor.can().setImage()
            ? button.classList.remove("disabled")
            : button.classList.add("disabled");

        if (app.options.image.menu) {
            // Open the context menu with a small delay.
            utils.debounce(async () => {
                if (!app.editor.isActive("image-figure")) {
                    // Image not active anymore. Return.
                    if (context_menu_instance) {
                        // If open, close.
                        await context_menu_close({
                            instance: context_menu_instance,
                            pattern_name: "tiptap-image-context-menu",
                        });
                        context_menu_instance = null;
                    }
                    return;
                }

                // Initialize the context menu
                context_menu_instance = await context_menu({
                    url: app.options.image.menu,
                    editor: app.editor,
                    instance: context_menu_instance,
                    pattern: pattern_image_context_menu({ app: app }),
                    extra_class: "tiptap-image-menu",
                });
            }, 50)();
        }
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
        selectable: true,

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
