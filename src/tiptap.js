import { BasePattern } from "@patternslib/patternslib/src/core/basepattern";
import Parser from "@patternslib/patternslib/src/core/parser";
import registry from "@patternslib/patternslib/src/core/registry";
import dom from "@patternslib/patternslib/src/core/dom";
import events from "@patternslib/patternslib/src/core/events";
import logging from "@patternslib/patternslib/src/core/logging";
import utils from "@patternslib/patternslib/src/core/utils";

export const log = logging.getLogger("tiptap");

export const parser = new Parser("tiptap");

parser.addArgument("toolbar-external", null);

parser.addArgument("image-panel", null);
parser.addArgument("embed-panel", null);
parser.addArgument("link-panel", null);
parser.addArgument("source-panel", null);

parser.addArgument("image-menu", null);
parser.addArgument("embed-menu", null);
parser.addArgument("link-menu", null);
parser.addArgument("mentions-menu", null);
parser.addArgument("tags-menu", null);

parser.addArgument("collaboration-server", null);
parser.addArgument("collaboration-document", null);
parser.addArgument("collaboration-user", null);
parser.addArgument("collaboration-color", null);
parser.addArgument("collaboration-authentication-token", null);

// TODO: Remove with next major version.
// BBB - Compatibility aliases
parser.addAlias("context-menu-link", "link-menu");
parser.addAlias("context-menu-mentions", "mentions-menu");
parser.addAlias("context-menu-tags", "tags-menu");

class Pattern extends BasePattern {
    static name = "tiptap";
    static trigger = ".pat-tiptap";
    parser = parser;

    current_modal = null; // reference to currently open modal dialog

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

        const config = {};
        if (this.options.collaboration.server && this.options.collaboration.document) {
            // Random color, see: https://css-tricks.com/snippets/javascript/random-hex-color/
            const random_color = "#" + ((Math.random() * 0xffffff) << 0).toString(16);
            // Information about the current user
            const user_name = this.options.collaboration.user || random_color;
            const user_color = this.options.collaboration.color || random_color;

            // Set up the Hocuspocus WebSocket provider
            const HocuspocusProvider = (await import("@hocuspocus/provider")).HocuspocusProvider; // prettier-ignore
            const provider = new HocuspocusProvider({
                url: this.options.collaboration.server,
                name: this.options.collaboration.document,
                token: this.options.collaboration["authentication-token"],
            });
            provider.setAwarenessField("user", {
                name: user_name,
                color: user_color,
            });

            // Wait for user being authenticated
            const authenticated = () =>
                new Promise((resolve) =>
                    provider.on("authenticated", resolve, { once: true })
                );
            await authenticated();

            const connected_users = [...provider.awareness.states.values()].map(
                (it) => it.user
            );
            if (connected_users.length === 1) {
                // it's only me.
                config["content"] = getText();
                log.info(`
                    This is the main instance and gets text from textfield.
                    Other connected user will get their text from the collaboration server.
                `);
            }

            // Collaboration extension
            const Collaboration = (
                await import("@tiptap/extension-collaboration")
            ).default.configure({
                document: provider.document,
            });
            extra_extensions.push(Collaboration);

            // Collaboration cursor
            if (window.__patternslib_import_styles) {
                import("./styles/collaboration-cursor.css");
            }
            const CollaborationCursor = (
                await import("@tiptap/extension-collaboration-cursor")
            ).default.configure({
                provider: provider,
                user: {
                    name: user_name,
                    color: user_color,
                },
            });
            extra_extensions.push(CollaborationCursor);
        } else {
            // Non-collaborative editing is always getting the initial text from the textarea.
            config["content"] = getText();
        }

        this.toolbar_el = this.options.toolbarExternal
            ? document.querySelector(this.options.toolbarExternal)
            : null;
        if (this.toolbar_el) {
            const focus_handler_targets = (await import("./focus-handler")).TARGETS; // prettier-ignore
            focus_handler_targets.push(this.toolbar_el); // We register the focus handler on itself.
            this.focus_handler(this.toolbar_el);
        }

        const scan_debouncer = utils.debounce((dom) => {
            registry.scan(dom);
        }, 500);

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
            onUpdate() {
                // Note: ``this`` is the editor instance.
                setText(this.getHTML());
                scan_debouncer(this.view.dom);
            },
            onCreate() {
                // Initially scan the dom for any Patterns in content.
                scan_debouncer(this.view.dom);
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
            ...config,
        });
        toolbar_ext.init_post({ app: this });

        document.addEventListener("pat-modal-ready", (e) => {
            // store the reference to the modal dialog
            // We need the reference to registter some modal functionality or
            // patterns on it, where we would not easily get access to the
            // modal DOM structure otherwise.
            this.current_modal = e.target;
        });
    }
}

registry.register(Pattern);
export default Pattern;
export { Pattern };
