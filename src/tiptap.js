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
            extensions: [ExtDocument, ExtText, ExtParagraph, ...this.extra_extensions],
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

        const btn_par = toolbar.querySelector(".button-paragraph");
        // paragraph extension already loaded.
        btn_par &&
            this.post_init.push(() => {
                btn_par.addEventListener("click", () => {
                    this.editor.chain().focus().setParagraph().run();
                    this.editor.emit("selectionUpdate");
                });
                this.editor.on("selectionUpdate", () => {
                    this.editor.isActive("paragraph")
                        ? btn_par.classList.add("active")
                        : btn_par.classList.remove("active");
                });
            });

        const btn_bq = toolbar.querySelector(".button-blockquote");
        btn_bq &&
            this.extra_extensions.push(
                (await import("@tiptap/extension-blockquote")).Blockquote
            );
        btn_bq &&
            this.post_init.push(() => {
                btn_bq.addEventListener("click", () => {
                    this.editor.chain().focus().toggleBlockquote().run();
                    this.editor.emit("selectionUpdate");
                });
                this.editor.on("selectionUpdate", () => {
                    this.editor.isActive("blockquote")
                        ? btn_bq.classList.add("active")
                        : btn_bq.classList.remove("active");
                });
            });

        const btn_cb = toolbar.querySelector(".button-code-block");
        btn_cb &&
            this.extra_extensions.push(
                (await import("@tiptap/extension-code-block")).CodeBlock
            );
        btn_cb &&
            this.post_init.push(() => {
                btn_cb.addEventListener("click", () => {
                    this.editor.chain().focus().toggleCodeBlock().run();
                    this.editor.emit("selectionUpdate");
                });
                this.editor.on("selectionUpdate", () => {
                    this.editor.isActive("codeBlock")
                        ? btn_cb.classList.add("active")
                        : btn_cb.classList.remove("active");
                });
            });

        const btn_code = toolbar.querySelector(".button-code");
        btn_code &&
            this.extra_extensions.push((await import("@tiptap/extension-code")).Code);
        btn_code &&
            this.post_init.push(() => {
                btn_code.addEventListener("click", () => {
                    this.editor.chain().focus().toggleCode().run();
                    this.editor.emit("selectionUpdate");
                });
                this.editor.on("selectionUpdate", () => {
                    this.editor.isActive("code")
                        ? btn_code.classList.add("active")
                        : btn_code.classList.remove("active");
                });
            });

        const btn_bold = toolbar.querySelector(".button-bold");
        btn_bold &&
            this.extra_extensions.push((await import("@tiptap/extension-bold")).Bold);
        btn_bold &&
            this.post_init.push(() => {
                btn_bold.addEventListener("click", () => {
                    this.editor.chain().focus().toggleBold().run();
                    this.editor.emit("selectionUpdate");
                });
                this.editor.on("selectionUpdate", () => {
                    this.editor.isActive("bold")
                        ? btn_bold.classList.add("active")
                        : btn_bold.classList.remove("active");
                });
            });

        const btn_italic = toolbar.querySelector(".button-italic");
        btn_italic &&
            this.extra_extensions.push(
                (await import("@tiptap/extension-italic")).Italic
            );
        btn_italic &&
            this.post_init.push(() => {
                btn_italic.addEventListener("click", () => {
                    this.editor.chain().focus().toggleItalic().run();
                    this.editor.emit("selectionUpdate");
                });
                this.editor.on("selectionUpdate", () => {
                    this.editor.isActive("italic")
                        ? btn_italic.classList.add("active")
                        : btn_italic.classList.remove("active");
                });
            });

        const btn_strike = toolbar.querySelector(".button-strike");
        btn_strike &&
            this.extra_extensions.push(
                (await import("@tiptap/extension-strike")).Strike
            );
        btn_strike &&
            this.post_init.push(() => {
                btn_strike.addEventListener("click", () => {
                    this.editor.chain().focus().toggleStrike().run();
                    this.editor.emit("selectionUpdate");
                });
                this.editor.on("selectionUpdate", () => {
                    this.editor.isActive("strike")
                        ? btn_strike.classList.add("active")
                        : btn_strike.classList.remove("active");
                });
            });

        const btn_ul = toolbar.querySelector(".button-unordered-list");
        const btn_ol = toolbar.querySelector(".button-ordered-list");
        if (btn_ul || btn_ol) {
            this.extra_extensions.push(
                (await import("@tiptap/extension-list-item")).ListItem
            );
        }
        // ordered list
        btn_ul &&
            this.extra_extensions.push(
                (await import("@tiptap/extension-bullet-list")).BulletList
            );
        btn_ul &&
            this.post_init.push(() => {
                btn_ul.addEventListener("click", () => {
                    this.editor.chain().focus().toggleBulletList().run();
                    this.editor.emit("selectionUpdate");
                });
                this.editor.on("selectionUpdate", () => {
                    this.editor.isActive("bulletList")
                        ? btn_ul.classList.add("active")
                        : btn_ul.classList.remove("active");
                });
            });
        // unordered list
        btn_ol &&
            this.extra_extensions.push(
                (await import("@tiptap/extension-ordered-list")).OrderedList
            );
        btn_ol &&
            this.post_init.push(() => {
                btn_ol.addEventListener("click", () => {
                    this.editor.chain().focus().toggleOrderedList().run();
                    this.editor.emit("selectionUpdate");
                });
                this.editor.on("selectionUpdate", () => {
                    this.editor.isActive("orderedList")
                        ? btn_ol.classList.add("active")
                        : btn_ol.classList.remove("active");
                });
            });

        const btn_hr = toolbar.querySelector(".button-horizontal-rule");
        btn_hr &&
            this.extra_extensions.push(
                (await import("@tiptap/extension-horizontal-rule")).HorizontalRule
            );
        btn_hr &&
            this.post_init.push(() => {
                btn_hr.addEventListener("click", () => {
                    this.editor.chain().focus().setHorizontalRule().run();
                });
            });

        const btn_undo = toolbar.querySelector(".button-undo");
        const btn_redo = toolbar.querySelector(".button-redo");
        if (btn_undo || btn_redo) {
            this.extra_extensions.push(
                (await import("@tiptap/extension-history")).History
            );
        }
        btn_undo &&
            this.post_init.push(() => {
                btn_undo.addEventListener("click", () => {
                    this.editor.chain().focus().undo().run();
                });
            });
        btn_redo &&
            this.post_init.push(() => {
                btn_redo.addEventListener("click", () => {
                    this.editor.chain().focus().redo().run();
                });
            });

        //const register_button = async (
        //    selector,
        //    ext_name,
        //    ext_method,
        //    ext_import_path,
        //    ext_import_name
        //) => {
        //    const _el = toolbar.querySelector(selector);
        //    if (!_el) {
        //        // button not available, so don't register functionality
        //        return;
        //    }

        //    if (ext_import_path && ext_import_name) {
        //        // register necessary extionsion
        //        this.extra_extensions.push(
        //            (await import(`@tiptap/extension-${ext_import_path}`))[
        //                ext_import_name
        //            ]
        //        );
        //    }

        //    this.post_init.push(() => {
        //        btn_cb.addEventListener("click", () => {
        //            this.editor.chain().focus()[ext_method]().run();
        //            this.editor.emit("selectionUpdate");
        //        });
        //        this.editor.on("selectionUpdate", () => {
        //            this.editor.isActive(ext_name)
        //                ? btn_cb.classList.add("active")
        //                : btn_cb.classList.remove("active");
        //        });
        //    });
        //};

        //register_button(".button-code", "code", "toggleCode", "code", "Code");
    },
});
