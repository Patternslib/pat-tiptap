import Registry from "@patternslib/patternslib/src/core/registry";
import events from "@patternslib/patternslib/src/core/events";
import patTooltip from "@patternslib/patternslib/src/pat/tooltip/tooltip";
import { posToDOMRect } from "@tiptap/core";

export let CONTEXT_MENU_TOOLTIP = null;
let PREV_NODE = null;

export async function context_menu({
    url,
    editor,
    should_show_cb = null,
    register_pattern = null,
    extra_class = null,
    force_reload = false,
}) {
    const prev_node = PREV_NODE;
    const cur_node = (PREV_NODE = editor.state.doc.nodeAt(editor.state.selection.from));

    if (force_reload && CONTEXT_MENU_TOOLTIP !== null && cur_node !== prev_node) {
        // Close context menu, when new node is selected.
        context_menu_close(register_pattern.name);
    }

    if (should_show_cb && !should_show_cb()) {
        // Context menu should not be opened at all.
        // If it should have been closed, it was done above.
        // If not (e.g. a different kind of context menu than this one) it stays opened.
        return;
    }

    if (!CONTEXT_MENU_TOOLTIP) {
        // Only re-initialize when not already opened.

        // 1) Dynamically register a pattern to be used in the context menu
        //    We need to unregister it after use in ``context_menu_close``
        //    to allow multiple tiptap editors on the same page because it
        //    references the current editor instance.
        if (register_pattern) {
            Registry.patterns[register_pattern.name] = register_pattern;
        }

        // 2) Initialize the tooltip
        const editor_element = editor.options.element;
        CONTEXT_MENU_TOOLTIP = await new patTooltip(editor_element, {
            "source": "ajax",
            "url": url,
            "trigger": "none",
            "class": extra_class,
            "position-list": ["tl"],
        });

        await events.await_pattern_init(CONTEXT_MENU_TOOLTIP);
    } else {
        CONTEXT_MENU_TOOLTIP.get_content(url);
    }

    CONTEXT_MENU_TOOLTIP.tippy?.setProps({
        getReferenceClientRect: () => {
            return posToDOMRect(
                editor.view,
                editor.state.selection.from,
                editor.state.selection.to
            );
        },
    });

    CONTEXT_MENU_TOOLTIP.show();

    return CONTEXT_MENU_TOOLTIP;
}

export function context_menu_close(unregister_pattern_name) {
    if (CONTEXT_MENU_TOOLTIP) {
        CONTEXT_MENU_TOOLTIP.hide();
        CONTEXT_MENU_TOOLTIP.destroy();
        CONTEXT_MENU_TOOLTIP = null;
    }
    if (unregister_pattern_name) {
        delete Registry.patterns[unregister_pattern_name];
    }
}
