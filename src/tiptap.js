import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "patternslib/src/core/base";
import Parser from "patternslib/src/core/parser";

const parser = new Parser("tiptap");
parser.addArgument("collaboration-server", null);
parser.addArgument("collaboration-document", null);

export default Base.extend({
    name: "tiptap",
    trigger: ".pat-tiptap",

    async init() {
        let Vue = await import("vue");
        Vue = Vue.default;
        let VueAsyncComputed = await import("vue-async-computed");
        VueAsyncComputed = VueAsyncComputed.default;
        let Editor = await import("./tiptap-editor.vue");
        Editor = Editor.default;

        this.options = parser.parse(this.el, this.options);

        // Hide textarea which will be replaced with tiptap instance
        this.el.style.display = "none";

        const getText = () => {
            // Textarea value getter
            return this.el.value;
        };

        const setText = (text) => {
            // Textarea value setter
            this.el.value = text;
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
