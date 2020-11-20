import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "patternslib/src/core/base";
import Parser from "patternslib/src/core/parser";
import Vue from "vue";
import { Editor, EditorContent } from "tiptap";

const parser = new Parser("tiptap");
parser.addArgument("example-option", [1, 2, 3]);

export default Base.extend({
    name: "tiptap",
    trigger: ".pat-tiptap",

    async init() {
        Vue.component("tiptap-editor", {
            template: `<editor-content :editor="editor" />`,
            components: {
                EditorContent,
            },
            data() {
                return {
                    // Create an `Editor` instance with some default content. The editor is
                    // then passed to the `EditorContent` component as a `prop`
                    editor: new Editor({
                        content: "<p>This is just some sample text.</p>",
                    }),
                };
            },
            beforeDestroy() {
                // Always destroy your editor instance when it's no longer needed
                this.editor.destroy();
            },
        });

        new Vue({ el: this.el });

        //this.options = parser.parse(this.el, this.options);
        //let external_library = await import("EXTERNAL_LIBRARY");
        //external_library = external_library.default;

        //const example_option = this.options.exampleOption;
    },
});
