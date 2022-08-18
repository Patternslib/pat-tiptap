import Registry from "@patternslib/patternslib/src/core/registry";
import dom from "@patternslib/patternslib/src/core/dom";
import events from "@patternslib/patternslib/src/core/events";
import patTooltip from "@patternslib/patternslib/src/pat/tooltip/tooltip";
import { posToDOMRect } from "@tiptap/core";

let PREV_NODE = null;

export async function context_menu({
    url,
    editor,
    instance = null,
    pattern = null,
    extra_class = null,
}) {
    const prev_node = PREV_NODE;
    const cur_node = (PREV_NODE = editor.state.doc.nodeAt(editor.state.selection.from));

    if (
        instance !== null &&
        (cur_node !== prev_node || !instance?.tippy.popperInstance)
    ) {
        // Close context menu, when new node is selected.
        context_menu_close({
            instance: instance,
            pattern_name: pattern.prototype.name,
        });
        instance = null;
    }

    if (!instance || !instance?.tippy.popperInstance) {
        // Only re-initialize when not already opened.

        // 1) Dynamically register a pattern to be used in the context menu
        //    We need to unregister it after use in ``context_menu_close``
        //    to allow multiple tiptap editors on the same page because it
        //    references the current editor instance.
        if (pattern) {
            Registry.patterns[pattern.prototype.name] = pattern;
        }

        // 2) Initialize the tooltip
        const editor_element = editor.options.element;
        instance = await new patTooltip(editor_element, {
            "source": "ajax",
            "url": url,
            "trigger": "none",
            "class": extra_class,
            "position-list": ["tl"],
        });

        await events.await_pattern_init(instance);

        const reference_position = posToDOMRect(
            editor.view,
            editor.state.selection.from,
            editor.state.selection.to
        );

        instance.tippy?.setProps({
            // NOTE: getReferenceClientRect is called after each setContent.
            getReferenceClientRect: () => reference_position,
        });

        events.add_event_listener(
            document,
            "mousedown",
            "tiptap--context_menu_close--click",
            (e) => {
                if (
                    [e.target, ...dom.get_parents(e.target)].includes(
                        instance?.tippy.popper
                    )
                ) {
                    // Do not close the context menu if we click in it.
                    return;
                }
                context_menu_close({
                    instance: instance,
                    pattern_name: pattern.prototype.name,
                });
            }
        );
        events.add_event_listener(
            document,
            "keydown",
            "tiptap--context_menu_close--esc",
            (e) => {
                if (e.key !== "Escape") {
                    // Not a closing key.
                    return;
                }
                context_menu_close({
                    instance: instance,
                    pattern_name: pattern.prototype.name,
                });
            }
        );

        instance.show();
    } else {
        instance.get_content(url);
    }

    return instance;
}

export function context_menu_close({ instance, pattern_name }) {
    // Hide and destroy the context menu / tooltip instance
    if (instance) {
        instance.hide();
        instance.destroy();
        instance = null;
    }

    // Unregister the pattern
    if (pattern_name) {
        delete Registry.patterns[pattern_name];
    }
    events.remove_event_listener(document, "tiptap--context_menu_close--click");
    events.remove_event_listener(document, "tiptap--context_menu_close--esc");
    return null;
}
