import "regenerator-runtime/runtime"; // needed for ``await`` support
import pattern from "./tiptap";
import utils from "patternslib/src/core/utils";

describe("pat-tiptap", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("is initialized correctly", async (done) => {
        document.body.innerHTML = `<textarea class="pat-tiptap">hello</textarea>`;

        const instance = pattern.init(document.querySelector(".pat-tiptap"));
        await utils.timeout(1);

        expect(document.querySelector(".pat-tiptap").style.display).toBe("none");
        expect(document.querySelector(".tiptap-editor *[contenteditable]").textContent).toBe("hello");
        expect(document.querySelector(".tiptap-editor *[contenteditable]").innerHTML).toBe("<p>hello</p>");

        done();
    });
});
