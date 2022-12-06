import { focus_handler } from "../focus-handler";
import { log } from "../tiptap";
import dom from "@patternslib/patternslib/src/core/dom";
import events from "@patternslib/patternslib/src/core/events";

function source_panel({ app }) {
    return {
        init(source_panel) {
            focus_handler(source_panel);

            const source_text = source_panel.querySelector("[name=tiptap-source]"); // prettier-ignore
            if (!source_text) {
                log.warn("No source input in source panel found.");
                return;
            }

            const source_confirm = source_panel.querySelector(".tiptap-confirm, [name=tiptap-confirm]"); // prettier-ignore

            // set form to initial values
            source_text.value = app.editor.getHTML();
            source_text.dispatchEvent(new Event("input"));

            const update_callback = (set_focus) => {
                const cmd = app.editor.chain();
                if (set_focus === true) {
                    cmd.focus();
                }
                cmd.setContent(source_text.value, true);
                cmd.run();
            };

            // FORM UPDATE
            const form = dom.querySelectorAllAndMe(source_panel, "form")?.[0];
            if (form) {
                events.add_event_listener(
                    form,
                    "submit",
                    "tiptap_source_submit",
                    (e) => {
                        // Prevent form submission when hitting "enter" within the form.
                        // The form is handled by JS only.
                        e.preventDefault();
                    }
                );
            }
            if (source_confirm) {
                // update on click on confirm
                events.add_event_listener(
                    source_confirm,
                    "click",
                    "tiptap_source_confirm",
                    () => update_callback(true)
                );
            } else {
                // update on input/change
                events.add_event_listener(
                    source_text,
                    "input",
                    "tiptap_source_text",
                    update_callback
                );
            }
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

        // Register the source-panel pattern.
        // Multiple registrations from different tiptap instances are possible
        // since we're registering it only after the toolbar's source button has
        // been clicked and clicking in another tiptap instance would override
        // previous registrations.
        const source_panel_pattern = source_panel({ app: app });
        document.addEventListener(
            "patterns-injected-delayed",
            (e) => {
                source_panel_pattern.init(e.detail.injected);

                // Register listener on modal for any DOM changes done by pat-inject.
                app.current_modal.addEventListener("patterns-injected-delayed", () => {
                    // Re-init panel after injection.
                    source_panel_pattern.init(app.current_modal);
                });
            },
            { once: true }
        );
    });
}
