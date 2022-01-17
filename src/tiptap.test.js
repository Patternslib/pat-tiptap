import "regenerator-runtime/runtime"; // needed for ``await`` support
import pattern from "./tiptap";
import utils from "@patternslib/patternslib/src/core/utils";

describe("pat-tiptap", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("1 - is initialized correctly on textarea elements", async () => {
        document.body.innerHTML = `<textarea class="pat-tiptap">hello</textarea>`;

        pattern.init(document.querySelector(".pat-tiptap"));
        await utils.timeout(1);

        expect(document.querySelector(".pat-tiptap").style.display).toBe("none"); // prettier-ignore
        expect(document.querySelector(".tiptap-container [contenteditable]").textContent).toBe("hello"); // prettier-ignore
        expect(document.querySelector(".tiptap-container [contenteditable]").innerHTML).toBe("<p>hello</p>"); // prettier-ignore
    });

    it("2 - is initialized correctly on div elements", async () => {
        document.body.innerHTML = `<div class="pat-tiptap" contenteditable>hello</div>`;

        pattern.init(document.querySelector(".pat-tiptap"));
        await utils.timeout(1);

        expect(document.querySelector(".pat-tiptap").style.display).toBe("none"); // prettier-ignore
        expect(document.querySelector(".tiptap-container [contenteditable]").textContent).toBe("hello"); // prettier-ignore
        expect(document.querySelector(".tiptap-container [contenteditable]").innerHTML).toBe("<p>hello</p>"); // prettier-ignore
    });

    it("3 - adds a placeholder element.", async () => {
        document.body.innerHTML = `
          <textarea
                class="pat-tiptap"
                placeholder="hello there."
              >
          </textarea>
        `;

        pattern.init(document.querySelector(".pat-tiptap"));
        await utils.timeout(1);

        expect(
            document.querySelector(
                ".tiptap-container [contenteditable] [data-placeholder='hello there.']"
            )
        ).toBeTruthy();
    });

    it("4 - sets focus with the autofocus attribute", async () => {
        document.body.innerHTML = `
          <textarea
                class="pat-tiptap"
                autofocus
              >
          </textarea>
        `;

        pattern.init(document.querySelector(".pat-tiptap"));
        await utils.timeout(1);
        await utils.timeout(30); // wait some time before tiptap sets focus.

        const editor_el = document.querySelector(".tiptap-container *[contenteditable]");
        expect(document.querySelector("*:focus")).toBe(editor_el);
    });

    it("5 - sets focus with the pat-autofocus class", async () => {
        document.body.innerHTML = `
          <textarea
                class="pat-tiptap pat-autofocus"
                autofocus
              >
          </textarea>
        `;

        pattern.init(document.querySelector(".pat-tiptap"));
        await utils.timeout(1);
        await utils.timeout(30); // wait some time before tiptap sets focus.

        const editor_el = document.querySelector(".tiptap-container *[contenteditable]");
        expect(document.querySelector("*:focus")).toBe(editor_el);
    });
});
