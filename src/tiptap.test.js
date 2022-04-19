import "regenerator-runtime/runtime"; // needed for ``await`` support
import Pattern from "./tiptap";
import utils from "@patternslib/patternslib/src/core/utils";

const mockFetch =
    (text = "") =>
    () =>
        Promise.resolve({
            text: () => Promise.resolve(text),
        });

const SUGGESTION_RESPONSE = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Mentions results</title>
  </head>
  <body>
    <section class="tiptap-items">
      <ul>
        <li class="tiptap-item" data-tiptap-value="item a"><a href="https://demo.com/itema" data-pat-inject="source:#some">first</a></li>
        <li class="tiptap-item" data-tiptap-value="item b"><a href="https://demo.com/itemb" class="aha">second</a></li>
        <li class="tiptap-item" data-tiptap-value="item c"><a href="https://demo.com/itemc" title="okay">third</a></li>
      </ul>
    </section>
  </body>
</html>
`;

describe("pat-tiptap", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("1.1 - is initialized correctly on textarea elements", async () => {
        document.body.innerHTML = `<textarea class="pat-tiptap">hello</textarea>`;

        new Pattern(document.querySelector(".pat-tiptap"));
        await utils.timeout(1);

        expect(document.querySelector(".pat-tiptap").style.display).toBe("none"); // prettier-ignore
        expect(document.querySelector(".tiptap-container [contenteditable]").textContent).toBe("hello"); // prettier-ignore
        expect(document.querySelector(".tiptap-container [contenteditable]").innerHTML).toBe("<p>hello</p>"); // prettier-ignore
    });

    it("1.2 - is initialized correctly on div elements", async () => {
        document.body.innerHTML = `<div class="pat-tiptap" contenteditable>hello</div>`;

        new Pattern(document.querySelector(".pat-tiptap"));
        await utils.timeout(1);

        expect(document.querySelector(".pat-tiptap").style.display).toBe("none"); // prettier-ignore
        expect(document.querySelector(".tiptap-container [contenteditable]").textContent).toBe("hello"); // prettier-ignore
        expect(document.querySelector(".tiptap-container [contenteditable]").innerHTML).toBe("<p>hello</p>"); // prettier-ignore
    });

    it("1.3 - Allow multiple instances of pat-tiptap", async () => {
        document.body.innerHTML = `
          <div id="tiptap-external-toolbar-1">
            <button class="button-link">Link</button>
          </div>
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                toolbar-external: #tiptap-external-toolbar-1;
                link-panel: #link-panel
              ">
          </textarea>

          <div id="tiptap-external-toolbar-2">
            <button class="button-link">Link</button>
          </div>
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                toolbar-external: #tiptap-external-toolbar-2;
                link-panel: #link-panel
              ">
          </textarea>

          <form id="link-panel">
            <input name="tiptap-href"/>
            <input name="tiptap-text"/>
            <button type="submit" name="tiptap-confirm">submit</button>
          </form>
        `;

        new Pattern(document.querySelectorAll(".pat-tiptap")[0]);
        new Pattern(document.querySelectorAll(".pat-tiptap")[1]);
        await utils.timeout(1);

        document
            .querySelector("#tiptap-external-toolbar-1 .button-link")
            .dispatchEvent(new Event("pat-modal-ready"));
        await utils.timeout(1);

        document.querySelector("#link-panel [name=tiptap-href]").value = "https://url1.com/"; // prettier-ignore
        document.querySelector("#link-panel [name=tiptap-text]").value = "Link text 1"; // prettier-ignore
        document.querySelector("#link-panel [name=tiptap-confirm]").dispatchEvent(new Event("click")); // prettier-ignore
        await utils.timeout(1);

        document
            .querySelector("#tiptap-external-toolbar-2 .button-link")
            .dispatchEvent(new Event("pat-modal-ready"));
        await utils.timeout(1);

        document.querySelector("#link-panel [name=tiptap-href]").value = "https://url2.com/"; // prettier-ignore
        document.querySelector("#link-panel [name=tiptap-text]").value = "Link text 2"; // prettier-ignore
        document.querySelector("#link-panel [name=tiptap-confirm]").dispatchEvent(new Event("click")); // prettier-ignore
        await utils.timeout(1);

        const containers = document.querySelectorAll(".tiptap-container");

        const anchor1 = containers[0].querySelector("a");
        expect(anchor1).toBeTruthy();
        expect(anchor1.href).toBe("https://url1.com/");
        expect(anchor1.textContent).toBe("Link text 1");

        const anchor2 = containers[1].querySelector("a");
        expect(anchor2).toBeTruthy();
        expect(anchor2.href).toBe("https://url2.com/");
        expect(anchor2.textContent).toBe("Link text 2");
    });

    it("1.4 - allows non-paragraph line breaks", async () => {
        document.body.innerHTML = `
          <textarea class="pat-tiptap">
            <p>hello<br><br>there</p>
          </textarea>
        `;

        const instance = new Pattern(document.querySelector(".pat-tiptap"));
        await utils.timeout(1);

        expect(
            document.querySelector(".tiptap-container [contenteditable]").innerHTML
        ).toBe("<p>hello<br><br>there</p>");

        expect(instance.editor.getHTML()).toBe("<p>hello<br><br>there</p>");
    });

    it("1.5 - Emits input events on update.", async () => {
        document.body.innerHTML = `
          <textarea class="pat-tiptap">
          </textarea>
        `;

        const el = document.querySelector(".pat-tiptap");

        new Pattern(el);
        await utils.timeout(1);

        const tiptap = document.querySelector(".tiptap-container [contenteditable]");

        let changed = false;
        el.addEventListener("input", () => {
            changed = true;
        });

        tiptap.innerHTML = "<p>hello</p>";
        await utils.timeout(1);

        expect(el.value).toBe("<p>hello</p>");
        expect(changed).toBe(true);
    });

    it("2.1 - adds a placeholder element.", async () => {
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

    it("3.1 - sets focus with the autofocus attribute", async () => {
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

    it("3.2 - sets focus with the pat-autofocus class", async () => {
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

    it("4.1 - un/sets focus on the toolbar", async () => {
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

    it("4.2 - un/sets focus on the toolbar with autofocus", async () => {
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

    it("4.3 - un/sets focus on the toolbar when clicking into the toolbar", async () => {
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

    it("5.1 - Adds a link", async () => {
        document.body.innerHTML = `
          <div id="tiptap-external-toolbar">
            <button class="button-link">Link</button>
          </div>
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                toolbar-external: #tiptap-external-toolbar;
                link-panel: #link-panel
              ">
          </textarea>
          <form id="link-panel">
            <input name="tiptap-href"/>
            <input name="tiptap-text"/>
            <button type="submit" name="tiptap-confirm">submit</button>
          </form>
        `;

        new Pattern(document.querySelector(".pat-tiptap"));
        await utils.timeout(1);

        document
            .querySelector("#tiptap-external-toolbar .button-link")
            .dispatchEvent(new Event("pat-modal-ready"));
        await utils.timeout(1);

        document.querySelector("#link-panel [name=tiptap-href]").value = "https://patternslib.com/"; // prettier-ignore
        document.querySelector("#link-panel [name=tiptap-text]").value = "Link text"; // prettier-ignore
        document.querySelector("#link-panel [name=tiptap-confirm]").dispatchEvent(new Event("click")); // prettier-ignore
        await utils.timeout(1);

        const anchor = document.querySelector(".tiptap-container a");
        expect(anchor).toBeTruthy();
        expect(anchor.href).toBe("https://patternslib.com/");
        expect(anchor.textContent).toBe("Link text");
    });

    it("6.1 - Adds an image within <figure> tags including a <figcaption>", async () => {
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

    it("6.2 - Adds an image within <figure> tags but without a <figcaption>", async () => {
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

    it("6.3 - Adds an image with base64 encoded image data", async () => {
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

    it("6.4 - Allow to parse inline images", async () => {
        document.body.innerHTML = `
          <div id="tiptap-external-toolbar">
            <button class="button-image">Image</button>
          </div>
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                toolbar-external: #tiptap-external-toolbar;
              ">
            <img src="https://url.to/image-1" />
            <p>
                some text
                <img src="https://url.to/image-2" />
                more text
                <img src="https://url.to/image-3" />
            </p>
          </textarea>
        `;

        new Pattern(document.querySelector(".pat-tiptap"));
        await utils.timeout(1);

        // Images are parsed and shown in the editor
        expect(document.querySelectorAll(".tiptap-container img").length).toBe(3);

        // Also those .ProseMirror-trailingBreak <br>s are added.
        // Only two of them - there is inline content after the second image and ProseMirror doesn't add the extra <br> in that case.
        // Also see: https://github.com/ProseMirror/prosemirror/issues/1241
        expect(document.querySelectorAll(".ProseMirror-trailingBreak").length).toBe(2);
    });

    it("7.1 - Add a YouTube embed", async () => {
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

    it("7.2 - Add a YouTube embed and transform to embed URL", async () => {
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
            <button type="submit" name="tiptap-confirm">submit</button>
          </form>
        `;

        new Pattern(document.querySelector(".pat-tiptap"));
        await utils.timeout(1);

        document
            .querySelector("#tiptap-external-toolbar .button-embed")
            .dispatchEvent(new Event("pat-modal-ready"));
        await utils.timeout(1);

        document.querySelector("#embed-panel [name=tiptap-src]").value = "https://www.youtube.com/watch?v=j8It1z7r1g4"; // prettier-ignore
        document.querySelector("#embed-panel [name=tiptap-confirm]").dispatchEvent(new Event("click")); // prettier-ignore
        await utils.timeout(1);

        const iframe = document.querySelector(".tiptap-container figure iframe");
        expect(iframe).toBeTruthy();

        // Normal YouTube URL is transformed to embed URL.
        expect(iframe.src).toBe("https://www.youtube.com/embed/j8It1z7r1g4");
    });

    it("7.3 - Add a Vimeo embed", async () => {
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

        document.querySelector("#embed-panel [name=tiptap-src]").value = "https://player.vimeo.com/video/9206226"; // prettier-ignore
        document.querySelector("#embed-panel [name=tiptap-title]").value = "Title text for video"; // prettier-ignore
        document.querySelector("#embed-panel [name=tiptap-caption]").value = "Caption text for video"; // prettier-ignore
        document.querySelector("#embed-panel [name=tiptap-confirm]").dispatchEvent(new Event("click")); // prettier-ignore
        await utils.timeout(1);

        const iframe = document.querySelector(".tiptap-container figure iframe");
        expect(iframe).toBeTruthy();

        expect(iframe.src).toBe("https://player.vimeo.com/video/9206226");
        expect(iframe.title).toBe("Title text for video");
        const figcaption = document.querySelector(".tiptap-container figure figcaption");
        expect(figcaption).toBeTruthy();
        expect(figcaption.textContent).toBe("Caption text for video");
    });

    it("7.4 - Add a Vimeo embed and transform to embed URL", async () => {
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
            <button type="submit" name="tiptap-confirm">submit</button>
          </form>
        `;

        new Pattern(document.querySelector(".pat-tiptap"));
        await utils.timeout(1);

        document
            .querySelector("#tiptap-external-toolbar .button-embed")
            .dispatchEvent(new Event("pat-modal-ready"));
        await utils.timeout(1);

        document.querySelector("#embed-panel [name=tiptap-src]").value = "https://vimeo.com/9206226"; // prettier-ignore
        document.querySelector("#embed-panel [name=tiptap-confirm]").dispatchEvent(new Event("click")); // prettier-ignore
        await utils.timeout(1);

        const iframe = document.querySelector(".tiptap-container figure iframe");
        expect(iframe).toBeTruthy();

        // Normal YouTube URL is transformed to embed URL.
        expect(iframe.src).toBe("https://player.vimeo.com/video/9206226");
    });

    it("8.1 - Can use suggestions for mentioning", async () => {
        global.fetch = jest.fn().mockImplementation(mockFetch(SUGGESTION_RESPONSE));

        document.body.innerHTML = `
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                mentions-menu: https://demo.at/mentions.html;
              ">
          </textarea>
        `;

        new Pattern(document.querySelector(".pat-tiptap"));
        await utils.timeout(1);

        const editable = document.querySelector(".tiptap-container [contenteditable]");
        const range = document.createRange();
        const sel = window.getSelection();

        // Add the triggering character into the content editable
        editable.innerHTML = "<p>@</p>";

        // Set the cursor right after the @-sign.
        range.setStart(editable.childNodes[0].childNodes[0], 1);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);

        await utils.timeout(1); // Wait a tick for the tooltip to open.
        await utils.timeout(1); // Wait a tick for the suggestion-pattern to be initialized.

        // Check for class ``tiptap-mentions`` set on tooltip container.
        expect(
            document.querySelector(".tooltip-container.tiptap-mentions")
        ).toBeTruthy();

        expect(document.querySelector(".tiptap-items")).toBeTruthy();

        const items = document.querySelectorAll(".tiptap-items .tiptap-item");
        expect(items.length).toBeGreaterThan(0);
        expect(items[0].classList.contains("active")).toBe(true);

        editable.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
        expect(items[0].classList.contains("active")).toBe(false);
        expect(items[1].classList.contains("active")).toBe(true);

        editable.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
        expect(items[0].classList.contains("active")).toBe(false);
        expect(items[1].classList.contains("active")).toBe(false);
        expect(items[2].classList.contains("active")).toBe(true);

        editable.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
        expect(items[0].classList.contains("active")).toBe(true);
        expect(items[1].classList.contains("active")).toBe(false);
        expect(items[2].classList.contains("active")).toBe(false);

        editable.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
        expect(document.querySelector(".tiptap-items")).toBeFalsy();
        const mention = editable.firstChild.firstChild;
        expect(mention.textContent).toBe("@item a");
        expect(mention.href).toBe("https://demo.com/itema");
        expect(mention.hasAttribute("data-mention")).toBe(true);
        expect(mention.getAttribute("data-pat-inject")).toBe("source:#some");

        global.fetch.mockClear();
        delete global.fetch;
    });

    it("8.2 - Can use suggestions for tagging", async () => {
        global.fetch = jest.fn().mockImplementation(mockFetch(SUGGESTION_RESPONSE));

        document.body.innerHTML = `
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                tags-menu: https://demo.at/tags.html;
              ">
          </textarea>
        `;

        new Pattern(document.querySelector(".pat-tiptap"));
        await utils.timeout(1);

        const editable = document.querySelector(".tiptap-container [contenteditable]");
        const range = document.createRange();
        const sel = window.getSelection();

        // Add the triggering character into the content editable
        editable.innerHTML = "<p>#</p>";

        // Set the cursor right after the #-sign.
        range.setStart(editable.childNodes[0].childNodes[0], 1);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);

        await utils.timeout(1); // Wait a tick for the tooltip to open.
        await utils.timeout(1); // Wait a tick for the suggestion-pattern to be initialized.

        // Check for class ``tiptap-tags`` set on tooltip container.
        expect(document.querySelector(".tooltip-container.tiptap-tags")).toBeTruthy();

        expect(document.querySelector(".tiptap-items")).toBeTruthy();

        const items = document.querySelectorAll(".tiptap-items .tiptap-item");
        expect(items.length).toBeGreaterThan(0);
        expect(items[0].classList.contains("active")).toBe(true);

        editable.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
        expect(items[0].classList.contains("active")).toBe(false);
        expect(items[1].classList.contains("active")).toBe(true);

        editable.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
        expect(document.querySelector(".tiptap-items")).toBeFalsy();
        const mention = editable.firstChild.firstChild;
        expect(mention.textContent).toBe("#item b");
        expect(mention.href).toBe("https://demo.com/itemb");
        expect(mention.classList.contains("aha")).toBe(true);
        expect(mention.hasAttribute("data-tag")).toBe(true);

        global.fetch.mockClear();
        delete global.fetch;
    });
});
