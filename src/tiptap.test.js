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

    it("9.1 - Adds an image within <figure> tags including a <figcaption>", async () => {
        document.body.innerHTML = `
          <div id="tiptap-external-toolbar">
            <button class="button-image">Image</button>
          </div>
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                toolbar-external: #tiptap-external-toolbar;
                image-panel: #image-panel
              ">
          </textarea>
          <form id="image-panel">
            <input name="tiptap-src" type="text"/>
            <input name="tiptap-alt"/>
            <input name="tiptap-title"/>
            <input name="tiptap-caption"/>
            <button type="submit" name="tiptap-confirm">submit</button>
          </form>
        `;

        new Pattern(document.querySelector(".pat-tiptap"));
        await utils.timeout(1);

        document
            .querySelector("#tiptap-external-toolbar .button-image")
            .dispatchEvent(new Event("pat-modal-ready"));
        await utils.timeout(1);

        document.querySelector("#image-panel [name=tiptap-src]").value = "https://path/to/image.png"; // prettier-ignore
        document.querySelector("#image-panel [name=tiptap-alt]").value = "Alt text for image"; // prettier-ignore
        document.querySelector("#image-panel [name=tiptap-title]").value = "Title text for image"; // prettier-ignore
        document.querySelector("#image-panel [name=tiptap-caption]").value = "Caption text for image"; // prettier-ignore
        document.querySelector("#image-panel [name=tiptap-confirm]").dispatchEvent(new Event("click")); // prettier-ignore
        await utils.timeout(1);

        const img = document.querySelector(".tiptap-container figure img");
        expect(img).toBeTruthy();
        expect(img.src).toBe("https://path/to/image.png");
        expect(img.alt).toBe("Alt text for image");
        expect(img.title).toBe("Title text for image");
        const figcaption = document.querySelector(".tiptap-container figure figcaption");
        expect(figcaption).toBeTruthy();
        expect(figcaption.textContent).toBe("Caption text for image");
    });

    it("9.2 - Adds an image within <figure> tags but without a <figcaption>", async () => {
        document.body.innerHTML = `
          <div id="tiptap-external-toolbar">
            <button class="button-image">Image</button>
          </div>
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                toolbar-external: #tiptap-external-toolbar;
                image-panel: #image-panel
              ">
          </textarea>
          <form id="image-panel">
            <input name="tiptap-src" type="text"/>
            <input name="tiptap-alt"/>
            <input name="tiptap-title"/>
            <input name="tiptap-caption"/>
            <button type="submit" name="tiptap-confirm">submit</button>
          </form>
        `;

        new Pattern(document.querySelector(".pat-tiptap"));
        await utils.timeout(1);

        document
            .querySelector("#tiptap-external-toolbar .button-image")
            .dispatchEvent(new Event("pat-modal-ready"));
        await utils.timeout(1);

        document.querySelector("#image-panel [name=tiptap-src]").value = "https://path/to/image.png"; // prettier-ignore
        document.querySelector("#image-panel [name=tiptap-confirm]").dispatchEvent(new Event("click")); // prettier-ignore
        await utils.timeout(1);

        const img = document.querySelector(".tiptap-container figure img");
        expect(img).toBeTruthy();
        expect(img.src).toBe("https://path/to/image.png");
        expect(img.alt).toBe("");
        expect(img.title).toBe("");
        const figcaption = document.querySelector(".tiptap-container figure figcaption");
        expect(figcaption).toBeFalsy();
    });

    it("9.3 - Adds an image with base64 encoded image data", async () => {
        document.body.innerHTML = `
          <div id="tiptap-external-toolbar">
            <button class="button-image">Image</button>
          </div>
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                toolbar-external: #tiptap-external-toolbar;
                image-panel: #image-panel
              ">
          </textarea>
          <form id="image-panel">
            <input name="tiptap-src" type="text"/>
            <button type="submit" name="tiptap-confirm">submit</button>
          </form>
        `;

        new Pattern(document.querySelector(".pat-tiptap"));
        await utils.timeout(1);

        document
            .querySelector("#tiptap-external-toolbar .button-image")
            .dispatchEvent(new Event("pat-modal-ready"));
        await utils.timeout(1);

        document.querySelector("#image-panel [name=tiptap-src]").value =
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVQI12P4z8AAAAMBAQAY3Y2wAAAAAElFTkSuQmCC";
        document.querySelector("#image-panel [name=tiptap-confirm]").dispatchEvent(new Event("click")); // prettier-ignore
        await utils.timeout(1);

        const img = document.querySelector(".tiptap-container figure img");
        expect(img).toBeTruthy();
        expect(img.src).toBe(
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVQI12P4z8AAAAMBAQAY3Y2wAAAAAElFTkSuQmCC"
        );
    });

    it("10.1 - Add a YouTube embed", async () => {
        document.body.innerHTML = `
          <div id="tiptap-external-toolbar">
            <button class="button-embed">Embed</button>
          </div>
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                toolbar-external: #tiptap-external-toolbar;
                embed-panel: #embed-panel
              ">
          </textarea>
          <form id="embed-panel">
            <input name="tiptap-src" type="text"/>
            <input name="tiptap-title"/>
            <input name="tiptap-caption"/>
            <button type="submit" name="tiptap-confirm">submit</button>
          </form>
        `;

        new Pattern(document.querySelector(".pat-tiptap"));
        await utils.timeout(1);

        document
            .querySelector("#tiptap-external-toolbar .button-embed")
            .dispatchEvent(new Event("pat-modal-ready"));
        await utils.timeout(1);

        document.querySelector("#embed-panel [name=tiptap-src]").value = "https://www.youtube.com/embed/j8It1z7r1g4"; // prettier-ignore
        document.querySelector("#embed-panel [name=tiptap-title]").value = "Title text for video"; // prettier-ignore
        document.querySelector("#embed-panel [name=tiptap-caption]").value = "Caption text for video"; // prettier-ignore
        document.querySelector("#embed-panel [name=tiptap-confirm]").dispatchEvent(new Event("click")); // prettier-ignore
        await utils.timeout(1);

        const iframe = document.querySelector(".tiptap-container figure iframe");
        expect(iframe).toBeTruthy();

        expect(iframe.src).toBe("https://www.youtube.com/embed/j8It1z7r1g4");
        expect(iframe.title).toBe("Title text for video");
        const figcaption = document.querySelector(".tiptap-container figure figcaption");
        expect(figcaption).toBeTruthy();
        expect(figcaption.textContent).toBe("Caption text for video");
    });
});
