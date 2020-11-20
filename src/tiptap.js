import $ from "jquery";
import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "patternslib/src/core/base";
import Parser from "patternslib/src/core/parser";

const parser = new Parser("tiptap");
parser.addArgument("example-option", [1, 2, 3]);

export default Base.extend({
    name: "tiptap",
    trigger: ".pat-tiptap",

    async init() {
        this.options = parser.parse(this.el, this.options);
        let external_library = await import("EXTERNAL_LIBRARY");
        external_library = external_library.default;

        const example_option = this.options.exampleOption;
    },
});
