import "regenerator-runtime/runtime"; // needed for ``await`` support
import pattern from "./tiptap";
import utils from "@patternslib/patternslib/src/core/utils";

describe("pat-tiptap", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("is initialized correctly on textarea elements", async (done) => {
        document.body.innerHTML = `<textarea class="pat-tiptap">hello</textarea>`;

        pattern.init(document.querySelector(".pat-tiptap"));
        await utils.timeout(1);

        expect(document.querySelector(".pat-tiptap").style.display).toBe("none"); // prettier-ignore
        expect(document.querySelector(".tiptap-editor *[contenteditable]").textContent).toBe("hello"); // prettier-ignore
        expect(document.querySelector(".tiptap-editor *[contenteditable]").innerHTML).toBe("<p>hello</p>"); // prettier-ignore

        done();
    });

    it("is initialized correctly on div elements", async (done) => {
        document.body.innerHTML = `<div class="pat-tiptap" contenteditable>hello</div>`;

        pattern.init(document.querySelector(".pat-tiptap"));
        await utils.timeout(1);

        expect(document.querySelector(".pat-tiptap").style.display).toBe("none"); // prettier-ignore
        expect(document.querySelector(".tiptap-editor *[contenteditable]").textContent).toBe("hello"); // prettier-ignore
        expect(document.querySelector(".tiptap-editor *[contenteditable]").innerHTML).toBe("<p>hello</p>"); // prettier-ignore

        done();
    });
});
