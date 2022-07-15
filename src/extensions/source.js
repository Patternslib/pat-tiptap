import { focus_handler } from "../focus-handler";
import { log } from "../tiptap";
import dom from "@patternslib/patternslib/src/core/dom";
import events from "@patternslib/patternslib/src/core/events";

let panel_observer;

function source_panel({ app }) {
    const source_panel = document.querySelector(app.options.sourcePanel);
    if (!source_panel) {
        log.warn("No source panel found.");
        return;
    }
    focus_handler(source_panel);

    const reinit = () => {
        const source_text = source_panel.querySelector("[name=tiptap-source]"); // prettier-ignore
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
    };

    reinit();
    if (panel_observer) {
        panel_observer.disconnect();
    }
    panel_observer = new MutationObserver(reinit);
    panel_observer.observe(source_panel, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false,
    });
}

export function init({ app, button }) {
    // Initialize modal after it has injected.
    button.addEventListener("click", () => {
        document.addEventListener(
            "pat-modal-ready",
            () => {
                if (dom.get_data(app.toolbar_el, "tiptap-instance", null) !== app) {
                    // If this pat-tiptap instance is not the one which was last
                    // focused, just return and do nothing.
                    // This might be due to one toolbar shared by multiple editors.
                    return;
                }
                source_panel({ app: app });
            },
            { once: true }
        );
    });
}
