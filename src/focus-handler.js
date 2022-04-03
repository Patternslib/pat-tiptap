import events from "@patternslib/patternslib/src/core/events";
import utils from "@patternslib/patternslib/src/core/utils";

export const TARGETS = [];

export function focus_handler(el) {
    // make element focusable
    // See: https://javascript.info/focus-blur
    el.setAttribute("tabindex", "-1"); // not user-selectable but programmatically focusable.
    events.add_event_listener(
        el,
        "focus",
        "tiptap-focusin",
        async () => {
            utils.timeout(1); // short timeout to ensure focus class is set even if tiptap_blur_handler is called concurrently.
            TARGETS.map((it) => it?.classList.add("tiptap-focus"));
        },
        true
    );
    events.add_event_listener(
        el,
        "blur",
        "tiptap-focusout",
        () => {
            TARGETS.map((it) => it?.classList.remove("tiptap-focus"));
        },
        true
    );
}
