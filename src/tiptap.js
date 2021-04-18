import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "@patternslib/patternslib/src/core/base";
import Parser from "@patternslib/patternslib/src/core/parser";

const parser = new Parser("tiptap");
parser.addArgument("collaboration-server", null);
parser.addArgument("collaboration-document", null);

export default Base.extend({
    name: "tiptap",
    trigger: ".pat-tiptap",

    async init() {
        const Vue = (await import("vue")).default;
        const VueAsyncComputed = (await import("vue-async-computed")).default;
        const Editor = (await import("./tiptap-editor.vue")).default;

        this.options = parser.parse(this.el, this.options);

        // Hide element which will be replaced with tiptap instance
        this.el.style.display = "none";

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

        // Initialize editor
        Vue.use(VueAsyncComputed); // Allow ``async`` for computed properties.
        const editor_app = new Vue({
            render: (h) =>
                h(Editor, {
                    props: {
                        getText: getText,
                        setText: setText,
                        options: this.options,
                    },
                }),
        }).$mount();
        this.el.parentNode.insertBefore(editor_app.$el, this.el);
    },
});
