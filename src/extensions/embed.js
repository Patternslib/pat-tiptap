// From: tiptap/demos/src/Experiments/GenericFigure/Vue/figure.ts
import { context_menu, context_menu_close } from "../context_menu";
import { focus_handler } from "../focus-handler";
import { log } from "../tiptap";
import { Node, mergeAttributes } from "@tiptap/core";
import { Plugin } from "prosemirror-state";
import Base from "@patternslib/patternslib/src/core/base";
import Registry from "@patternslib/patternslib/src/core/registry";
import dom from "@patternslib/patternslib/src/core/dom";
import events from "@patternslib/patternslib/src/core/events";
import utils from "@patternslib/patternslib/src/core/utils";

let context_menu_instance;

function pattern_embed_context_menu({ app: app }) {
    return Base.extend({
        name: "tiptap-embed-context-menu",
        trigger: ".tiptap-embed-context-menu",
        autoregister: false,
        init() {
            focus_handler(this.el);

            const btn_edit = this.el.querySelector(".tiptap-edit-embed");
            const btn_remove = this.el.querySelector(".tiptap-remove-embed");

            btn_edit &&
                btn_edit.addEventListener("click", () => {
                    app.toolbar.embed.click();
                });

            btn_remove &&
                btn_remove.addEventListener("click", () => {
                    app.editor.commands.selectParentNode(); // Also select the surrounding <figure>
                    app.editor.commands.deleteSelection();
                    app.editor.commands.focus();
                });
        },
    });
}

function embed_panel({ app }) {
    return Base.extend({
        name: "tiptap-embed-panel",
        trigger: app.options.embed?.panel,
        autoregister: false,
        init() {
            const embed_panel = this.el;

            const embed_src = embed_panel.querySelector("[name=tiptap-src]");
            if (!embed_src) {
                log.warn("No src input in embed panel found.");
                return;
            }

            const embed_title = embed_panel.querySelector("[name=tiptap-title]");
            const embed_caption = embed_panel.querySelector("[name=tiptap-caption]");
            const embed_confirm = embed_panel.querySelector(".tiptap-confirm, [name=tiptap-confirm]"); // prettier-ignore

            focus_handler(embed_panel);

            // Get embed node
            const node_embed = app.editor.state.doc.nodeAt(
                app.editor.state.selection.from
            );

            // Get figcaption node, if it exists
            app.editor.commands.selectParentNode(); // Also select the surrounding <figure>
            const node_figure = app.editor.state.doc.nodeAt(
                app.editor.state.selection.from
            );
            const node_figcaption = node_figure?.content.content.filter(
                (it) => it.type.name === "figcaption"
            )?.[0];

            // Populate form fields
            if (node_embed) {
                embed_src.value = node_embed.attrs?.src || "";
                if (embed_title) {
                    embed_title.value = node_embed.attrs?.title || "";
                }
            }
            if (node_figcaption && embed_caption) {
                embed_caption.value = node_figcaption.textContent || "";
            }

            const update_callback = (set_focus) => {
                app.editor.commands.insertContent({
                    type: "figure",
                    content: [
                        {
                            type: "embed",
                            attrs: {
                                src: embed_src.value,
                                ...(embed_title?.value && { title: embed_title.value }),
                            },
                        },
                        // Conditionally add a figcaption
                        ...(embed_caption?.value
                            ? [
                                  {
                                      type: "figcaption",
                                      content: [
                                          {
                                              type: "text",
                                              text: embed_caption.value,
                                          },
                                      ],
                                  },
                              ]
                            : []),
                    ],
                });
                if (set_focus === true) {
                    // set cursor after the embed, otherwise embed is
                    // selected and right away deleted when starting typing.
                    app.editor.commands.selectParentNode();
                    app.editor.commands.focus(app.editor.state.selection.to);
                    //app.editor.commands.blur();
                }
            };

            // FORM UPDATE
            const form = dom.querySelectorAllAndMe(embed_panel, "form")?.[0];
            if (form) {
                events.add_event_listener(form, "submit", "tiptap_embed_submit", (e) => {
                    // Prevent form submission when hitting "enter" within the form.
                    // The form is handled by JS only.
                    e.preventDefault();
                });
            }
            if (embed_confirm) {
                // update on click on confirm
                events.add_event_listener(
                    embed_confirm,
                    "click",
                    "tiptap_embed_confirm",
                    () => update_callback(true)
                );
            } else {
                // update on input/change
                events.add_event_listener(
                    embed_src,
                    "change",
                    "tiptap_embed_src",
                    update_callback
                );
                events.add_event_listener(
                    embed_title,
                    "change",
                    "tiptap_embed_title",
                    update_callback
                );
                events.add_event_listener(
                    embed_caption,
                    "change",
                    "tiptap_embed_caption",
                    update_callback
                );
            }
        },
    });
}

export function init({ app, button }) {
    button.addEventListener("click", () => {
        if (dom.get_data(app.toolbar_el, "tiptap-instance", null) !== app) {
            // If this pat-tiptap instance is not the one which was last
            // focused, just return and do nothing.
            // This might be due to one toolbar shared by multiple editors.
            return;
        }

        // Register the embed-panel pattern.
        // Multiple registrations from different tiptap instances are possible
        // since we're registering it only after the toolbar's embed button has
        // been clicked and clicking in another tiptap instance would override
        // previous registrations.
        const embed_panel_pattern = embed_panel({ app: app });
        Registry.patterns[embed_panel_pattern.prototype.name] = embed_panel_pattern;
        document.addEventListener(
            "patterns-injected-delayed",
            (e) => {
                Registry.scan(e.detail.injected, [embed_panel_pattern.prototype.name]);
            },
            { once: true }
        );
    });

    app.editor.on("selectionUpdate", async () => {
        app.editor.isActive("embed")
            ? button.classList.add("active")
            : button.classList.remove("active");
        app.editor.can().setEmbed()
            ? button.classList.remove("disabled")
            : button.classList.add("disabled");

        if (app.options.embed.menu) {
            // Open the context menu with a small delay.
            utils.debounce(async () => {
                console.log(app.editor.isActive("embed"));
                if (!app.editor.isActive("embed")) {
                    // Embed not active anymore. Return.
                    if (context_menu_instance) {
                        // If open, close.
                        context_menu_close({
                            instance: context_menu_instance,
                            pattern_name: "tiptap-embed-context-menu",
                        });
                        context_menu_instance = null;
                    }
                    return;
                }

                // Initialize the context menu
                context_menu_instance = await context_menu({
                    url: app.options.embed.menu,
                    editor: app.editor,
                    instance: context_menu_instance,
                    pattern: pattern_embed_context_menu({ app: app }),
                    extra_class: "tiptap-embed-menu",
                });
            }, 50)();
        }
    });
}

export const factory = () => {
    const is_youtube = (src) => src.indexOf("youtube.com") > -1;
    const is_vimeo = (src) => src.indexOf("vimeo.com") > -1;

    return Node.create({
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
        selectable: true,

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
                    tag: `iframe[src*="youtube.com"]`,
                    getAttrs: (node) =>
                        (is_youtube(node.getAttribute("src")) ||
                            is_vimeo(node.getAttribute("src")) > -1) &&
                        null,
                },
            ];
        },

        renderHTML({ HTMLAttributes }) {
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
};
