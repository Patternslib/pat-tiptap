import Base from "@patternslib/patternslib/src/core/base";
import Parser from "@patternslib/patternslib/src/core/parser";
import Registry from "@patternslib/patternslib/src/core/registry";
import dom from "@patternslib/patternslib/src/core/dom";
import events from "@patternslib/patternslib/src/core/events";
import logging from "@patternslib/patternslib/src/core/logging";
import utils from "@patternslib/patternslib/src/core/utils";

export const log = logging.getLogger("tiptap");

export const parser = new Parser("tiptap");
parser.addArgument("collaboration-server", null);
parser.addArgument("collaboration-document", null);

parser.addArgument("toolbar-external", null);

parser.addArgument("image-panel", null);
parser.addArgument("embed-panel", null);
parser.addArgument("link-panel", null);
parser.addArgument("source-panel", null);

parser.addArgument("link-menu", null);
parser.addArgument("mentions-menu", null);
parser.addArgument("tags-menu", null);

// TODO: Remove with next major version.
// BBB - Compatibility aliases
parser.addAlias("context-menu-link", "link-menu");
parser.addAlias("context-menu-mentions", "mentions-menu");
parser.addAlias("context-menu-tags", "tags-menu");

export default Base.extend({
    name: "tiptap",
    trigger: ".pat-tiptap",

    async init() {
        // Constructor
        this.toolbar_el = null;

        const TipTap = (await import("@tiptap/core")).Editor;
        const ExtDocument = (await import("@tiptap/extension-document")).default;
        const ExtParagraph = (await import("@tiptap/extension-paragraph")).default;
        const ExtText = (await import("@tiptap/extension-text")).default;

        this.focus_handler = (await import("./focus-handler")).focus_handler;

        this.options = parser.parse(this.el, this.options);

        // Hide element which will be replaced with tiptap instance
        this.el.style.display = "none";
        // Create container for tiptap
        const container = document.createElement("div");
        container.setAttribute("class", "tiptap-container");
        this.el.after(container);

        // Support for pat-autofocus and autofocus: Set focus depending on textarea's focus setting.
        const set_focus =
            this.el.classList.contains("pat-autofocus") ||
            this.el.hasAttribute("autofocus");

        const is_form_el = ["TEXTAREA", "INPUT"].includes(this.el.tagName);

        const getText = () => {
            // Textarea value getter
            return is_form_el ? this.el.value : this.el.innerHTML;
        };

        const setText = (text) => {
            // Textarea value setter
            if (is_form_el) {
                this.el.value = text;
            } else {
                this.el.innerHTML = text;
            }
            this.el.dispatchEvent(events.input_event());
        };

        const extra_extensions = [
            // Allow non-paragraph line-breaks by default.
            (await import("@tiptap/extension-hard-break")).default.configure(),
            // Gapcursor for images, tables etc to be able to add content below/above.
            (await import("@tiptap/extension-gapcursor")).Gapcursor.configure(),
            // Allways include undo/redo support via keyboard shortcuts.
            (await import("@tiptap/extension-history")).History.configure(),
        ];
        const placeholder = this.el.getAttribute("placeholder");
        if (placeholder) {
            extra_extensions.push(
                (await import("@tiptap/extension-placeholder")).Placeholder.configure({
                    placeholder: placeholder,
                })
            );
        }

        // Mentions extension
        if (this.options.mentionsMenu) {
            extra_extensions.push(
                (await import("./extensions/suggestion"))
                    .factory({
                        app: this,
                        name: "mention",
                        char: "@",
                        plural: "mentions",
                    })
                    .configure({
                        url: this.options.mentionsMenu,
                    })
            );
        }

        // Tags extension
        if (this.options.tagsMenu) {
            extra_extensions.push(
                (await import("./extensions/suggestion"))
                    .factory({
                        app: this,
                        name: "tag",
                        char: "#",
                        plural: "tags",
                    })
                    .configure({
                        url: this.options.tagsMenu,
                    })
            );
        }

        this.toolbar_el = this.options.toolbarExternal
            ? document.querySelector(this.options.toolbarExternal)
            : null;
        if (this.toolbar_el) {
            const focus_handler_targets = (await import("./focus-handler")).TARGETS; // prettier-ignore
            focus_handler_targets.push(this.toolbar_el); // We register the focus handler on itself.
            this.focus_handler(this.toolbar_el);
        }

        const toolbar_ext = await import("./toolbar");
        this.toolbar = toolbar_ext.init_pre({ app: this });
        this.editor = new TipTap({
            element: container,
            extensions: [
                ExtDocument,
                ExtText,
                ExtParagraph,
                ...(await toolbar_ext.init_extensions({ app: this })),
                ...extra_extensions,
            ],
            content: getText(),
            onUpdate() {
                // Note: ``this`` is the editor instance.
                setText(this.getHTML());
                Registry.scan(this.view.dom);
            },
            onFocus: async () => {
                // Note: ``this`` is the pattern instance.
                utils.timeout(1); // short timeout to ensure focus class is set even if tiptap_blur_handler is called concurrently.
                this.toolbar_el?.classList.add("tiptap-focus");

                // Set the current focused pat-tiptap instance on the toolbar element.
                this.toolbar_el &&
                    dom.set_data(this.toolbar_el, "tiptap-instance", this);
            },
            onBlur: () => {
                // Note: ``this`` is the pattern instance.
                this.toolbar_el?.classList.remove("tiptap-focus");
            },
            autofocus: set_focus,
        });
        toolbar_ext.init_post({ app: this });
    },
});
