import { context_menu, context_menu_close } from "../context_menu";
import { focus_handler } from "../focus-handler";
import log from "../tiptap";
import LinkExtension from "@tiptap/extension-link";
import events from "@patternslib/patternslib/src/core/events";
import utils from "@patternslib/patternslib/src/core/utils";

let panel_observer;
let context_menu_instance;
let dont_open_context_menu = false;

function pattern_link_context_menu({ app }) {
    // Dynamic pattern for the link context menu
    return {
        name: "tiptap-link-context-menu",
        trigger: ".tiptap-link-context-menu",
        async init($el) {
            const el = $el[0];
            focus_handler(el);

            const btn_open = el.querySelector(".tiptap-open-new-link");
            const btn_edit = el.querySelector(".tiptap-edit-link");
            const btn_unlink = el.querySelector(".tiptap-unlink");

            if (btn_open) {
                const attrs = app.editor.getAttributes("link");
                if (attrs?.href) {
                    btn_open.setAttribute("href", attrs.href);
                }
                btn_open.addEventListener(
                    "click",
                    () =>
                        (context_menu_instance = context_menu_close({
                            instance: context_menu_instance,
                            pattern_name: this.name,
                        }))
                );
            }

            btn_edit &&
                btn_edit.addEventListener("click", () => {
                    context_menu_instance = context_menu_close({
                        instance: context_menu_instance,
                        pattern_name: this.name,
                    });
                    app.toolbar.link.click();
                });
            btn_unlink &&
                btn_unlink.addEventListener("click", () => {
                    context_menu_instance = context_menu_close({
                        instance: context_menu_instance,
                        pattern_name: this.name,
                    });
                    app.editor.chain().focus().unsetLink().run();
                });
        },
    };
}

async function link_panel({ app }) {
    // Close eventual opened link context menus.
    context_menu_instance = context_menu_close({
        instance: context_menu_instance,
        pattern_name: "tiptap-link-context-menu",
    });

    const link_panel = document.querySelector(app.options.link?.panel);
    if (!link_panel) {
        log.warn("No link panel found.");
        return;
    }
    focus_handler(link_panel);

    const reinit = () => {
        const link_href = link_panel.querySelector("[name=tiptap-href]");
        const link_text = link_panel.querySelector("[name=tiptap-text]");
        const link_target = link_panel.querySelector("[name=tiptap-target]");
        const link_confirm = link_panel.querySelector(".tiptap-confirm, [name=tiptap-confirm]"); // prettier-ignore
        const link_remove = link_panel.querySelector("[name=tiptap-remove]");

        const selection_from = app.editor.state.selection.from;
        const selection_to = app.editor.state.selection.to;

        const node = app.editor.state.doc.nodeAt(selection_from);
        const attrs = app.editor.getAttributes("link");
        const is_link = attrs.href !== undefined;

        if (is_link) {
            // Extend the selection to whole link.
            // Necessary for link updates below in the update_callback
            // to get the selection right which is replaced.
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
            if (set_focus === true) {
                cmd.focus();
            }
            const link_text_value = (link_text ? link_text.value : text_content) || "";
            cmd.command(async ({ tr }) => {
                // create = update
                // create prosemirror tree mark and node
                const mark = app.editor.state.schema.marks.link.create({
                    href: link_href.value,
                    target:
                        link_target && link_target.checked ? link_target?.value : null,
                });
                const link_node = app.editor.state.schema
                    .text(link_text_value)
                    .mark([mark]);
                tr.replaceSelectionWith(link_node, false);
                return true;
            });
            cmd.run();
        };

        // FORM UPDATE
        if (link_confirm) {
            // update on click on confirm
            events.add_event_listener(link_confirm, "click", "tiptap_link_confirm", () =>
                update_callback(true)
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
    };

    reinit();
    if (panel_observer) {
        panel_observer.disconnect();
    }
    panel_observer = new MutationObserver(reinit);
    panel_observer.observe(link_panel, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false,
    });
}

export function init({ app, button }) {
    // Initialize modal after it has injected.
    button.addEventListener("pat-modal-ready", () => link_panel({ app: app }));

    app.editor.on("selectionUpdate", async () => {
        app.editor.isActive("link")
            ? button.classList.add("active")
            : button.classList.remove("active");
        app.editor.can().setLink()
            ? button.classList.remove("disabled")
            : button.classList.add("disabled");

        // Temporarily don't open the context menu.
        if (dont_open_context_menu && !app.options.link?.menu) {
            return;
        }

        // Open the context menu with a small delay.
        utils.debounce(async () => {
            // Link not active anymore. Return.
            if (!app.editor.isActive("link")) {
                if (context_menu_instance) {
                    // If open, close.
                    context_menu_instance = context_menu_close({
                        instance: context_menu_instance,
                        pattern_name: "tiptap-link-context-menu",
                    });
                }
                return;
            }

            // Initialize the context menu
            context_menu_instance = await context_menu({
                url: app.options.link.menu,
                editor: app.editor,
                instance: context_menu_instance,
                pattern: pattern_link_context_menu({ app: app }),
                extra_class: "link-panel",
            });
        }, 50)();
    });
}

export const factory = () => {
    return LinkExtension;
};