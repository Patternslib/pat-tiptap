import { Mark, mergeAttributes } from "@tiptap/core";
import { context_menu, context_menu_close } from "../context_menu";

function pattern_mentions_context_menu(plugin_context) {
    // Dynamic pattern for the mentions context menu
    return {
        name: "tiptap-mentions-context-menu",
        trigger: ".tiptap-mentions-context-menu",
        async init($el) {
            $el.on("submit", (e) => {
                // We need jQuery here:
                // 1) pat-autosubmit submits via $(form).submit(); which cannot be catched by addEventListener
                // 2) Safari (and IE) do not support form.requestSubmit()
                //    (which would dispatch a "submit" - in contrast to form.submit())
                //    nor the Submit() event.
                e.preventDefault();
                context_menu_close(this.name);
                plugin_context.editor.commands.setMentions();
            });
        },
    };
}

export const Mentions = Mark.create({
    name: "mentions",

    defaultOptions: {
        HTMLAttributes: {},
        char: "@",
        url: null,
    },

    //group: "inline",
    //inline: true,
    //selectable: false,
    //atom: true,

    //addAttributes() {
    //    return {
    //        testing: "okay",
    //        //id: {
    //        //    default: null,
    //        //    parseHTML: (element) => element.getAttribute("data-id"),
    //        //    renderHTML: (attributes) => {
    //        //        if (!attributes.id) {
    //        //            return {};
    //        //        }
    //        //        return {
    //        //            "data-id": attributes.id,
    //        //        };
    //        //    },
    //        //},
    //        //label: {
    //        //    default: null,
    //        //    parseHTML: (element) => element.getAttribute("data-label"),
    //        //    renderHTML: (attributes) => {
    //        //        if (!attributes.label) {
    //        //            return {};
    //        //        }
    //        //        return {
    //        //            "data-label": attributes.label,
    //        //        };
    //        //    },
    //        //},
    //    };
    //},

    parseHTML() {
        return [
            {
                tag: "span[data-mention]",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "span",
            mergeAttributes(
                { "data-mention": "" },
                this.options.HTMLAttributes,
                HTMLAttributes
            ),
            `${this.options.char}hello`, //${node.attrs.label ?? node.attrs.id}`,
        ];
    },

    //renderText({ node }) {
    //    return `${this.options.char}hello`; //${node.attrs.label ?? node.attrs.id}`;
    //},

    addCommands() {
        return {
            setMentions:
                () =>
                ({ commands }) => {
                    return commands.setMark("mentions");
                },
            toggleMentions:
                () =>
                ({ commands }) => {
                    return commands.toggleMark("mentions");
                },
            unsetMentions:
                () =>
                ({ commands }) => {
                    return commands.unsetMark("mentions");
                },
        };
    },

    addKeyboardShortcuts() {
        return {
            "Mod-y": () => this.editor.commands.toggleMentions(),
            "@": () => {
                context_menu(
                    this.options.url,
                    this.editor,
                    undefined,
                    pattern_mentions_context_menu(this)
                );
            },
        };
    },
});
