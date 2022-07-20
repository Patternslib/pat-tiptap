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

parser.addArgument("lazy", false);

export default Base.extend({
    name: "tiptap",
    trigger: ".pat-tiptap",

    async init() {
        // Initialize the pattern and prepare initialization of the tiptap editor.
        this.options = parser.parse(this.el, this.options);
        this.is_form_el = ["TEXTAREA", "INPUT"].includes(this.el.tagName);

        // Hide original element which will be replaced with tiptap instance.
        this.el.style.display = "none";

        // Create container for tiptap.
        // In case of lazy initialization the container is an intermediate container
        // which will later be replaced by a tiptap container, after tiptap
        // has been initialized off-canvas and be ready.
        this.tiptap_container = this.create_tiptap_container({
            editable: this.options.lazy,
        });
        if (this.options.lazy) {
            // Display the text content before tiptap is being loaded.
            this.tiptap_container.innerHTML = this.get_textarea_text() || "<br>";
        }
        this.el.after(this.tiptap_container);

        if (this.options.lazy) {
            events.add_event_listener(
                this.tiptap_container,
                "focus",
                "tiptap--initialization",
                () => this.init_editor(),
                { once: true }
            );
        } else {
            await this.init_editor();
        }
    },

    get_textarea_text() {
        // Textarea value getter
        return this.is_form_el ? this.el.value : this.el.innerHTML;
    },

    set_textarea_text(value) {
        // Textarea value setter
        if (this.is_form_el) {
            this.el.value = value;
        } else {
            this.el.innerHTML = value;
        }
        this.el.dispatchEvent(events.input_event());
    },

    create_tiptap_container({ editable = false }) {
        const tiptap_container = document.createElement("div");
        tiptap_container.setAttribute("class", "tiptap-container");
        if (editable) {
            tiptap_container.setAttribute("contenteditable", true);
            tiptap_container.setAttribute("tabindex", "-1"); // make selectable.
        }
        return tiptap_container;
    },

    async init_editor() {
        // Initialize the tiptap editor itself.

        const TipTap = (await import("@tiptap/core")).Editor;
        const ExtDocument = (await import("@tiptap/extension-document")).default;
        const ExtParagraph = (await import("@tiptap/extension-paragraph")).default;
        const ExtText = (await import("@tiptap/extension-text")).default;

        this.focus_handler = (await import("./focus-handler")).focus_handler;

        this.toolbar_el = this.options.toolbarExternal
            ? document.querySelector(this.options.toolbarExternal)
            : null;
        if (this.toolbar_el) {
            const focus_handler_targets = (await import("./focus-handler")).TARGETS; // prettier-ignore
            focus_handler_targets.push(this.toolbar_el); // We register the focus handler on itself.
            this.focus_handler(this.toolbar_el);
        }

        // Support for pat-autofocus and autofocus: Set focus depending on textarea's focus setting.
        const set_focus =
            this.el.classList.contains("pat-autofocus") ||
            this.el.hasAttribute("autofocus");

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

        const toolbar_ext = await import("./toolbar");
        this.toolbar = toolbar_ext.init_pre({ app: this });

        // Late initialization - create new element where tiptap is initialized on.
        // This will replace the intermediate element where we only showed the
        // content until tiptap was initialized.
        const tiptap_container = this.options.lazy
            ? this.create_tiptap_container({ editable: false })
            : this.tiptap_container;

        const self = this;
        this.editor = new TipTap({
            element: tiptap_container,
            extensions: [
                ExtDocument,
                ExtText,
                ExtParagraph,
                ...(await toolbar_ext.init_extensions({ app: this })),
                ...extra_extensions,
            ],
            content: this.get_textarea_text(),
            onCreate: () => {
                if (this.options.lazy) {
                    // Late initialization - replace the intermediate tiptap container
                    // with the tiptap-initialized one.
                    this.tiptap_container.replaceWith(tiptap_container);
                    // We also need to set the this.tiptap_container to the new one.
                    this.tiptap_container = tiptap_container;
                }
            },
            onUpdate() {
                // Note: ``this`` is the editor instance.
                self.set_textarea_text(this.getHTML());
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
