import "regenerator-runtime/runtime"; // needed for ``await`` support
import pattern from "./tiptap";
import utils from "patternslib/src/core/utils";

describe("pat-tiptap", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("is initialized correctly", async (done) => {
        document.body.innerHTML = `<div class="pat-tiptap" />`;

        const instance = pattern.init(document.querySelector(".pat-tiptap"));
        await utils.timeout(1);

        expect().toBe("");

        done();
    });
});
