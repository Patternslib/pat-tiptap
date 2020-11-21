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

        const editor_app = new Vue({
            render: (h) => h(Editor),
        }).$mount();
        this.el.appendChild(editor_app.$el);

        //this.options = parser.parse(this.el, this.options);
        //const example_option = this.options.exampleOption;
    },
});
