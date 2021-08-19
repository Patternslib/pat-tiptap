import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "@patternslib/patternslib/src/core/base";
import Parser from "@patternslib/patternslib/src/core/parser";

const parser = new Parser("tiptap");
parser.addArgument("collaboration-server", null);
parser.addArgument("collaboration-document", null);

parser.addArgument("toolbar-external", null);

export default Base.extend({
    name: "tiptap",
    trigger: ".pat-tiptap",

    extra_extensions: [],
    post_init: [],

    async init() {
        const TipTap = (await import("@tiptap/core")).Editor;
        const StarterKit = (await import("@tiptap/starter-kit")).default;
        const ExtDocument = (await import("@tiptap/extension-document")).default;
        const ExtParagraph = (await import("@tiptap/extension-paragraph")).default;
        const ExtText = (await import("@tiptap/extension-text")).default;

        this.options = parser.parse(this.el, this.options);

        // Hide element which will be replaced with tiptap instance
        this.el.style.display = "none";
        // Create container for tiptap
        const container = document.createElement("div");
        container.setAttribute("class", "tiptap-container");
        this.el.after(container);

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
        };

        // Collect toolbar buttons functionality in post_init callback handler
        // array and collect extra extensions.
        await this.connect_toolbar();

        this.editor = new TipTap({
            element: container,
            extensions: [
                ExtDocument,
                ExtText,
                ExtParagraph,
                ...this.extra_extensions
            ],
            content: getText(),
        });

        // initialize post-init handlers
        this.post_init.map((cb) => cb());
    },

    async connect_toolbar() {
        const toolbar = this.options.toolbarExternal
            ? document.querySelector(this.options.toolbarExternal)
            : null;
        if (!toolbar) {
            return;
        }

        // connect heading
        const h1 = toolbar.querySelector(".button-heading-level-1");
        const h2 = toolbar.querySelector(".button-heading-level-2");
        const h3 = toolbar.querySelector(".button-heading-level-3");
        const h4 = toolbar.querySelector(".button-heading-level-4");
        const h5 = toolbar.querySelector(".button-heading-level-5");
        const h6 = toolbar.querySelector(".button-heading-level-6");

        if (h1 || h2 || h3 || h4 || h5 || h6) {
            this.extra_extensions.push(
                (await import("@tiptap/extension-heading")).Heading
            );

            const set_heading_button = (_el, _level) => {
                _el.addEventListener("click", () => {
                    this.editor.chain().focus().toggleHeading({ level: _level }).run();
                    this.editor.emit("selectionUpdate");
                });
                this.editor.on("selectionUpdate", () => {
                    this.editor.isActive("heading", { level: _level })
                        ? _el.classList.add("active")
                        : _el.classList.remove("active");
                });
            };
            h1 && this.post_init.push(() => set_heading_button(h1, 1));
            h2 && this.post_init.push(() => set_heading_button(h2, 2));
            h3 && this.post_init.push(() => set_heading_button(h3, 3));
            h4 && this.post_init.push(() => set_heading_button(h4, 4));
            h5 && this.post_init.push(() => set_heading_button(h5, 5));
            h6 && this.post_init.push(() => set_heading_button(h6, 6));
        }
    },
});
