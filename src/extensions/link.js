import { context_menu, context_menu_close } from "../context_menu";
import { focus_handler } from "../focus-handler";
import { log } from "../tiptap";
import LinkExtension from "@tiptap/extension-link";
import Base from "@patternslib/patternslib/src/core/base";
import Registry from "@patternslib/patternslib/src/core/registry";
import dom from "@patternslib/patternslib/src/core/dom";
import events from "@patternslib/patternslib/src/core/events";
import utils from "@patternslib/patternslib/src/core/utils";
import tiptap_utils from "../utils";

let context_menu_instance;
let dont_open_context_menu = false;

function pattern_link_context_menu({ app }) {
    // Dynamic pattern for the link context menu
    return Base.extend({
        name: "tiptap-link-context-menu",
        trigger: ".tiptap-link-context-menu",
        autoregister: false,
        init() {
            focus_handler(this.el);

            const btn_open = this.el.querySelector(".tiptap-open-new-link");
            const btn_edit = this.el.querySelector(".tiptap-edit-link");
            const btn_unlink = this.el.querySelector(".tiptap-unlink");

            if (btn_open) {
                const attrs = app.editor.getAttributes("link");
                if (attrs?.href) {
                    btn_open.setAttribute("href", attrs.href);
                }
                btn_open.addEventListener("click", () => {
                    context_menu_close({
                        instance: context_menu_instance,
                        pattern_name: this.name,
                    });
                    context_menu_instance = null;
                });
            }

            btn_edit &&
                btn_edit.addEventListener("click", () => {
                    context_menu_close({
                        instance: context_menu_instance,
                        pattern_name: this.name,
                    });
                    context_menu_instance = null;
                    app.toolbar.link.click();
                });

            btn_unlink &&
                btn_unlink.addEventListener("click", () => {
                    context_menu_close({
                        instance: context_menu_instance,
                        pattern_name: this.name,
                    });
                    context_menu_instance = null;
                    app.editor.chain().focus().unsetLink().run();
                });
        },
    });
}

function link_panel({ app }) {
    return Base.extend({
        name: "tiptap-link-panel",
        trigger: app.options.link?.panel,
        autoregister: false,
        init() {
            // Close eventual opened link context menus.
            //context_menu_close({
            //    instance: context_menu_instance,
            //    pattern_name: "tiptap-link-context-menu",
            //});
            //context_menu_instance = null;

            const link_panel = this.el;

            const link_href = link_panel.querySelector("[name=tiptap-href]");
            if (!link_href) {
                log.warn("No href input in link panel found.");
                return;
            }

            const link_text = link_panel.querySelector("[name=tiptap-text]");
            const link_target = link_panel.querySelector("[name=tiptap-target]");
            const link_confirm = link_panel.querySelector(".tiptap-confirm, [name=tiptap-confirm]"); // prettier-ignore
            const link_remove = link_panel.querySelector("[name=tiptap-remove]");

            focus_handler(link_panel);

            // Store the current cursor position.
            // While extending the selection below the cursor position is changed and
            // we want it back where we left.
            const last_cursor_position = app.editor.state.selection.$head.pos;

            const selection_from = app.editor.state.selection.from;
            const selection_to = app.editor.state.selection.to;

            const node = app.editor.state.doc.nodeAt(selection_from);
            const attrs = app.editor.getAttributes("link");
            const is_link = attrs.href !== undefined;

            if (is_link) {
                // Extend the selection to whole link.
                // Necessary to get the whole link scope and the correct text.
                dont_open_context_menu = true; // setting a selection on a link would open the context menu.
                app.editor.commands.extendMarkRange("link");
                dont_open_context_menu = false;
            }

            // FORM INITIALIZATION
            if (attrs?.href) {
                link_href.value = attrs.href;
                link_href.dispatchEvent(new Event("input"));
            }
            if (attrs?.target && link_target) {
                link_target.checked = true;
                link_target.dispatchEvent(new Event("input"));
            }

            let text_content = null;
            if (selection_from !== selection_to) {
                text_content = app.editor.state.doc.textBetween(
                    selection_from,
                    selection_to
                );
            } else if (is_link) {
                text_content = node.text;
            }
            if (link_text && text_content) {
                link_text.value = text_content;
                link_text.dispatchEvent(new Event("input"));
            }

            const update_callback = (set_focus) => {
                const cmd = app.editor.chain();
                const link_text_value =
                    (link_text ? link_text.value : text_content) || "";
                cmd.command(async ({ tr }) => {
                    if (!tiptap_utils.is_url(link_href.value)) {
                        // Correct the link href if it's not a valid url.
                        link_href.value = `https://${link_href.value}`;
                    }
                    // create = update
                    // create prosemirror tree mark and node
                    const mark = app.editor.state.schema.marks.link.create({
                        href: link_href.value,
                        target:
                            link_target && link_target.checked
                                ? link_target?.value
                                : null,
                    });
                    const link_node = app.editor.state.schema
                        .text(link_text_value)
                        .mark([mark]);
                    tr.replaceSelectionWith(link_node, false);
                    if (set_focus === true) {
                        // Set the cursor back to the position where we left.
                        cmd.focus().setTextSelection(last_cursor_position);
                    }
                    return true;
                });
                cmd.run();
            };

            // FORM UPDATE
            const form = dom.querySelectorAllAndMe(link_panel, "form")?.[0];
            if (form) {
                events.add_event_listener(form, "submit", "tiptap_link_submit", (e) => {
                    // Prevent form submission when hitting "enter" within the form.
                    // The form is handled by JS only.
                    e.preventDefault();
                });
            }
            if (link_confirm) {
                // update on click on confirm
                events.add_event_listener(
                    link_confirm,
                    "click",
                    "tiptap_link_confirm",
                    () => update_callback(true)
                );
            } else {
                // update on input/change
                events.add_event_listener(
                    link_href,
                    "input",
                    "tiptap_link_href",
                    update_callback
                );
                events.add_event_listener(
                    link_text,
                    "input",
                    "tiptap_link_text",
                    update_callback
                );
                events.add_event_listener(
                    link_target,
                    "change",
                    "tiptap_link_target",
                    update_callback
                );
            }

            events.add_event_listener(link_remove, "click", "tiptap_link_remove", () =>
                app.editor.chain().focus().unsetLink().run()
            );
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

        // Register the link-panel pattern.
        // Multiple registrations from different tiptap instances are possible
        // since we're registering it only after the toolbar's link button has
        // been clicked and clicking in another tiptap instance would override
        // previous registrations.
        const link_panel_pattern = link_panel({ app: app });
        Registry.patterns[link_panel_pattern.prototype.name] = link_panel_pattern;
        document.addEventListener(
            "patterns-injected-delayed",
            (e) => {
                Registry.scan(e.detail.injected, [link_panel_pattern.prototype.name]);
            },
            { once: true }
        );
    });

    app.editor.on("selectionUpdate", async () => {
        app.editor.isActive("link")
            ? button.classList.add("active")
            : button.classList.remove("active");
        app.editor.can().setLink()
            ? button.classList.remove("disabled")
            : button.classList.add("disabled");

        if (dont_open_context_menu) {
            // Temporarily don't open the context menu.
            return;
        }

        if (app.options.link.menu) {
            // Open the context menu with a small delay.
            utils.debounce(async () => {
                if (!app.editor.isActive("link")) {
                    // Link not active anymore. Return.
                    if (context_menu_instance) {
                        // If open, close.
                        context_menu_close({
                            instance: context_menu_instance,
                            pattern_name: "tiptap-link-context-menu",
                        });
                        context_menu_instance = null;
                    }
                    return;
                }

                // Initialize the context menu
                context_menu_instance = await context_menu({
                    url: app.options.link.menu,
                    editor: app.editor,
                    instance: context_menu_instance,
                    pattern: pattern_link_context_menu({ app: app }),
                    extra_class: "tiptap-link-menu",
                });
            }, 50)();
        }
    });
}

export const factory = () => {
    return LinkExtension;
};
