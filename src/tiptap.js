import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "patternslib/src/core/base";
import Parser from "patternslib/src/core/parser";

const parser = new Parser("tiptap");
parser.addArgument("example-option", [1, 2, 3]);

export default Base.extend({
    name: "tiptap",
    trigger: ".pat-tiptap",

    async init() {
        let Vue = await import("vue");
        Vue = Vue.default;
        let Editor = await import("./tiptap-editor.vue");
        Editor = Editor.default;

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

        const editor_app = new Vue({
            render: (h) => h(Editor, {props: {getText: getText, setText: setText}}),
        }).$mount();
        this.el.parentNode.insertBefore(editor_app.$el, this.el);

        //this.options = parser.parse(this.el, this.options);
        //const example_option = this.options.exampleOption;
    },
});
