import "regenerator-runtime/runtime"; // needed for ``await`` support
import Pattern from "./tiptap";
import utils from "@patternslib/patternslib/src/core/utils";

describe("pat-tiptap", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("1 - is initialized correctly on textarea elements", async () => {
        document.body.innerHTML = `<textarea class="pat-tiptap">hello</textarea>`;

        new Pattern(document.querySelector(".pat-tiptap"));
        await utils.timeout(1);

        expect(document.querySelector(".pat-tiptap").style.display).toBe("none"); // prettier-ignore
        expect(document.querySelector(".tiptap-container [contenteditable]").textContent).toBe("hello"); // prettier-ignore
        expect(document.querySelector(".tiptap-container [contenteditable]").innerHTML).toBe("<p>hello</p>"); // prettier-ignore
    });

    it("2 - is initialized correctly on div elements", async () => {
        document.body.innerHTML = `<div class="pat-tiptap" contenteditable>hello</div>`;

        new Pattern(document.querySelector(".pat-tiptap"));
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

        new Pattern(document.querySelector(".pat-tiptap"));
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

        new Pattern(document.querySelector(".pat-tiptap"));
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

        new Pattern(document.querySelector(".pat-tiptap"));
        await utils.timeout(1);
        await utils.timeout(30); // wait some time before tiptap sets focus.

        const editor_el = document.querySelector(".tiptap-container *[contenteditable]");
        expect(document.querySelector("*:focus")).toBe(editor_el);
    });

    it("6 - un/sets focus on the toolbar", async () => {
        document.body.innerHTML = `
          <div id="tiptap-external-toolbar"></div>
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                toolbar-external: #tiptap-external-toolbar;
              ">
          </textarea>
        `;

        new Pattern(document.querySelector(".pat-tiptap"));
        await utils.timeout(1);

        document.querySelector(".tiptap-container [contenteditable]").focus();
        expect(document.querySelector("#tiptap-external-toolbar").classList[0]).toBe("tiptap-focus"); // prettier-ignore

        document.querySelector(".tiptap-container [contenteditable]").blur();
        expect(document.querySelector("#tiptap-external-toolbar").classList.length).toBe(0); // prettier-ignore
    });

    it("7 - un/sets focus on the toolbar with autofocus", async () => {
        document.body.innerHTML = `
          <div id="tiptap-external-toolbar"></div>
          <textarea
              autofocus
              class="pat-tiptap"
              data-pat-tiptap="
                toolbar-external: #tiptap-external-toolbar;
              ">
          </textarea>
        `;

        new Pattern(document.querySelector(".pat-tiptap"));
        await utils.timeout(1);
        await utils.timeout(30);

        expect(document.querySelector("#tiptap-external-toolbar").classList[0]).toBe("tiptap-focus"); // prettier-ignore
    });

    it("8 - un/sets focus on the toolbar when clicking into the toolbar", async () => {
        document.body.innerHTML = `
          <div id="tiptap-external-toolbar"><button>click</button></div>
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                toolbar-external: #tiptap-external-toolbar;
              ">
          </textarea>
        `;

        new Pattern(document.querySelector(".pat-tiptap"));
        await utils.timeout(1);

        document.querySelector("#tiptap-external-toolbar button").focus();
        expect(document.querySelector("#tiptap-external-toolbar").classList[0]).toBe("tiptap-focus"); // prettier-ignore

        document.querySelector("#tiptap-external-toolbar button").blur();
        expect(document.querySelector("#tiptap-external-toolbar").classList.length).toBe(0); // prettier-ignore
    });
});
