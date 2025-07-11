import Pattern from "./tiptap";
import events from "@patternslib/patternslib/src/core/events";
import utils from "@patternslib/patternslib/src/core/utils";
import tiptap_utils from "./utils";
import PatternModal from "@patternslib/patternslib/src/pat/modal/modal";

// Mock some events which are needed by TipTap
window.ClipboardEvent = jest.fn();
window.DragEvent = jest.fn();

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
        <li class="tiptap-item" data-tiptap-value="item a">
          <a href="https://demo.com/itema"
              class="class_item_a"
              data-pat-inject="source:#some"
              data-mention="jepp">
            first
            <span class="small">subtext</span>
          </a>
        </li>
        <li class="tiptap-item" data-tiptap-value="item b"><a href="https://demo.com/itemb" class="class_item_b">second</a></li>
        <li class="tiptap-item" data-tiptap-value="item c"><a href="https://demo.com/itemc" class="class_item_c" title="okay">third</a></li>
      </ul>
    </section>
  </body>
</html>
`;

describe("pat-tiptap", () => {
    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("1.1 - is initialized correctly on textarea elements", async () => {
        document.body.innerHTML = `<textarea class="pat-tiptap">hello</textarea>`;

        const pattern = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(pattern);

        expect(document.querySelector(".pat-tiptap").style.display).toBe("none"); // prettier-ignore
        expect(document.querySelector(".tiptap-container [contenteditable]").textContent).toBe("hello"); // prettier-ignore
        expect(document.querySelector(".tiptap-container [contenteditable]").innerHTML).toBe("<p>hello</p>"); // prettier-ignore
    });

    it("1.2 - is initialized correctly on div elements", async () => {
        document.body.innerHTML = `<div class="pat-tiptap" contenteditable>hello</div>`;

        const pattern = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(pattern);

        expect(document.querySelector(".pat-tiptap").style.display).toBe("none"); // prettier-ignore
        expect(document.querySelector(".tiptap-container [contenteditable]").textContent).toBe("hello"); // prettier-ignore
        expect(document.querySelector(".tiptap-container [contenteditable]").innerHTML).toBe("<p>hello</p>"); // prettier-ignore
    });

    it("1.3 - Allow multiple instances of pat-tiptap", async () => {
        document.body.innerHTML = `
          <div id="tiptap-external-toolbar-1">
            <a class="button-link pat-modal" href="#modal-link">Link</a>
          </div>
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                toolbar-external: #tiptap-external-toolbar-1;
                link-panel: #link-panel
              ">
          </textarea>

          <div id="tiptap-external-toolbar-2">
            <a class="button-link pat-modal" href="#modal-link">Link</a>
          </div>
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                toolbar-external: #tiptap-external-toolbar-2;
                link-panel: #link-panel
              ">
          </textarea>

          <template id="modal-link">
            <form id="link-panel">
              <input name="tiptap-href"/>
              <input name="tiptap-text"/>
              <button
                  type="submit"
                  name="tiptap-confirm"
                  class="close-panel">submit</button>
            </form>
          </template>
        `;

        const pattern1 = new Pattern(document.querySelectorAll(".pat-tiptap")[0]);
        await events.await_pattern_init(pattern1);
        const pattern2 = new Pattern(document.querySelectorAll(".pat-tiptap")[1]);
        await events.await_pattern_init(pattern2);

        const containers = document.querySelectorAll(".tiptap-container");
        const button_1 = document.querySelector("#tiptap-external-toolbar-1 .button-link"); // prettier-ignore
        const button_2 = document.querySelector("#tiptap-external-toolbar-2 .button-link"); // prettier-ignore

        await events.await_pattern_init(new PatternModal(button_1));
        await events.await_pattern_init(new PatternModal(button_2));

        containers[0].querySelector("[contenteditable]").focus(); // Set focus to bypass toolbar check
        button_1.click();
        await events.await_event(document, "patterns-injected-delayed");
        await utils.timeout(1);

        document.querySelector("#link-panel [name=tiptap-href]").value = "https://url1.com/"; // prettier-ignore
        document.querySelector("#link-panel [name=tiptap-text]").value = "Link text 1"; // prettier-ignore
        document.querySelector("#link-panel [name=tiptap-confirm]").dispatchEvent(new Event("click")); // prettier-ignore
        await utils.timeout(1);
        await utils.timeout(1);

        containers[1].querySelector("[contenteditable]").focus(); // Set focus to bypass toolbar check
        button_2.click();
        await events.await_event(document, "patterns-injected-delayed");
        await utils.timeout(1);

        document.querySelector("#link-panel [name=tiptap-href]").value = "https://url2.com/"; // prettier-ignore
        document.querySelector("#link-panel [name=tiptap-text]").value = "Link text 2"; // prettier-ignore
        document.querySelector("#link-panel [name=tiptap-confirm]").dispatchEvent(new Event("click")); // prettier-ignore

        const anchor1 = containers[0].querySelector("a");
        expect(anchor1).toBeTruthy();
        expect(anchor1.href).toBe("https://url1.com/");
        expect(anchor1.textContent).toBe("Link text 1");

        const anchor2 = containers[1].querySelector("a");
        expect(anchor2).toBeTruthy();
        expect(anchor2.href).toBe("https://url2.com/");
        expect(anchor2.textContent).toBe("Link text 2");
    });

    it("1.4 - Allow multiple instances of pat-tiptap, sharing the same toolbar", async () => {
        document.body.innerHTML = `
          <div id="tiptap-external-toolbar">
            <a class="button-link pat-modal" href="#modal-link">Link</a>
          </div>

          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                toolbar-external: #tiptap-external-toolbar;
                link-panel: #link-panel
              ">
          </textarea>

          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                toolbar-external: #tiptap-external-toolbar;
                link-panel: #link-panel
              ">
          </textarea>

          <template id="modal-link">
            <form id="link-panel">
              <input name="tiptap-href"/>
              <input name="tiptap-text"/>
              <button
                  type="submit"
                  name="tiptap-confirm"
                  class="close-panel">submit</button>
            </form>
          </template>
        `;

        const pattern1 = new Pattern(document.querySelectorAll(".pat-tiptap")[0]);
        await events.await_pattern_init(pattern1);
        const pattern2 = new Pattern(document.querySelectorAll(".pat-tiptap")[1]);
        await events.await_pattern_init(pattern2);

        const containers = document.querySelectorAll(".tiptap-container");
        const button_link = document.querySelector("#tiptap-external-toolbar .button-link"); // prettier-ignore

        await events.await_pattern_init(new PatternModal(button_link));

        containers[0].querySelector("[contenteditable]").focus(); // Set focus to bypass toolbar check
        await utils.timeout(1);
        button_link.click();
        await events.await_event(document, "patterns-injected-delayed");
        await utils.timeout(1);

        document.querySelector("#link-panel [name=tiptap-href]").value = "https://url1.com/"; // prettier-ignore
        document.querySelector("#link-panel [name=tiptap-text]").value = "Link text 1"; // prettier-ignore
        document.querySelector("#link-panel [name=tiptap-confirm]").dispatchEvent(new Event("click")); // prettier-ignore
        await utils.timeout(1);
        await utils.timeout(1);

        containers[1].querySelector("[contenteditable]").focus(); // Set focus to bypass toolbar check
        await utils.timeout(1);
        button_link.click();
        await events.await_event(document, "patterns-injected-delayed");
        await utils.timeout(1);

        document.querySelector("#link-panel [name=tiptap-href]").value = "https://url2.com/"; // prettier-ignore
        document.querySelector("#link-panel [name=tiptap-text]").value = "Link text 2"; // prettier-ignore
        document.querySelector("#link-panel [name=tiptap-confirm]").dispatchEvent(new Event("click")); // prettier-ignore
        await utils.timeout(1);
        await utils.timeout(1);

        const anchor1 = containers[0].querySelector("a");
        expect(anchor1).toBeTruthy();
        expect(anchor1.href).toBe("https://url1.com/");
        expect(anchor1.textContent).toBe("Link text 1");

        const anchor2 = containers[1].querySelector("a");
        expect(anchor2).toBeTruthy();
        expect(anchor2.href).toBe("https://url2.com/");
        expect(anchor2.textContent).toBe("Link text 2");
    });

    it("1.5 - allows non-paragraph line breaks", async () => {
        document.body.innerHTML = `
          <textarea class="pat-tiptap">
            <p>hello<br><br>there</p>
          </textarea>
        `;

        const instance = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(instance);

        expect(
            document.querySelector(".tiptap-container [contenteditable]").innerHTML
        ).toBe("<p>hello<br><br>there</p>");

        expect(instance.editor.getHTML()).toBe("<p>hello<br><br>there</p>");
    });

    it("1.6 - Emits input events on update.", async () => {
        document.body.innerHTML = `
          <textarea class="pat-tiptap">
          </textarea>
        `;

        const el = document.querySelector(".pat-tiptap");

        const pattern = new Pattern(el);
        await events.await_pattern_init(pattern);

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

        const pattern = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(pattern);

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

        const pattern = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(pattern);
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

        const pattern = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(pattern);
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

        const pattern = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(pattern);

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

        const pattern = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(pattern);
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

        const pattern = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(pattern);

        document.querySelector("#tiptap-external-toolbar button").focus();
        expect(document.querySelector("#tiptap-external-toolbar").classList[0]).toBe("tiptap-focus"); // prettier-ignore

        document.querySelector("#tiptap-external-toolbar button").blur();
        expect(document.querySelector("#tiptap-external-toolbar").classList.length).toBe(0); // prettier-ignore
    });

    describe("5 - Link tests", () => {
        let button_link;

        beforeEach(async () => {
            document.body.innerHTML = `
              <div id="tiptap-external-toolbar">
                <a class="button-link pat-modal" href="#modal-link">Link</a>
              </div>
              <textarea
                  class="pat-tiptap"
                  data-pat-tiptap="
                    toolbar-external: #tiptap-external-toolbar;
                    link-panel: #link-panel;
                    link-menu: #context-menu-link;
                    link-extra-protocols: fantasy;
                  ">
              </textarea>
              <template id="modal-link">
                <form id="link-panel">
                  <input name="tiptap-href"/>
                  <input name="tiptap-text"/>
                  <button
                      type="submit"
                      name="tiptap-confirm"
                      class="close-panel">submit</button>
                </form>
              </template>
              <template id="context-menu-link">
                <div class="tiptap-link-context-menu">
                    <a
                      class="close-panel tiptap-open-new-link"
                      target="_blank"
                      href="">Visit linked web page</a>
                    <button
                      type="button"
                      class="close-panel tiptap-edit-link">Edit link</button>
                    <button
                      type="button"
                      class="close-panel tiptap-unlink">Unlink</button>
                </div>
              </template>
            `;
            const pattern = new Pattern(document.querySelector(".pat-tiptap"));
            await events.await_pattern_init(pattern);

            button_link = document.querySelector("#tiptap-external-toolbar .button-link"); // prettier-ignore
            await events.await_pattern_init(new PatternModal(button_link));

            document.querySelector(".tiptap-container [contenteditable]").focus(); // Set focus to bypass toolbar check

            button_link.click();
            await events.await_event(document, "patterns-injected-delayed");
            await utils.timeout(1);
        });

        afterEach(() => {
            document.body.innerHTML = "";
        });

        it("5.1 - Adds a link", async () => {
            document.querySelector("#link-panel [name=tiptap-href]").value = "https://patternslib.com/"; // prettier-ignore
            document.querySelector("#link-panel [name=tiptap-text]").value = "Link text"; // prettier-ignore
            document.querySelector("#link-panel [name=tiptap-confirm]").dispatchEvent(new Event("click")); // prettier-ignore
            await utils.timeout(1);

            const anchor = document.querySelector(".tiptap-container a");
            expect(anchor).toBeTruthy();
            expect(anchor.href).toBe("https://patternslib.com/");
            expect(anchor.textContent).toBe("Link text");
        });

        it("5.2 - Corrects a link with missing protocoll.", async () => {
            document.querySelector("#link-panel [name=tiptap-href]").value = "patternslib.com"; // prettier-ignore
            document.querySelector("#link-panel [name=tiptap-text]").value = "Link text"; // prettier-ignore
            document.querySelector("#link-panel [name=tiptap-confirm]").dispatchEvent(new Event("click")); // prettier-ignore
            await utils.timeout(1);

            const anchor = document.querySelector(".tiptap-container a");
            expect(anchor).toBeTruthy();
            expect(anchor.href).toBe("https://patternslib.com/");
            expect(anchor.textContent).toBe("Link text");
        });

        it("5.3 - Adds a mailto address.", async () => {
            document.querySelector("#link-panel [name=tiptap-href]").value = "mailto:info@patternslib.com"; // prettier-ignore
            document.querySelector("#link-panel [name=tiptap-text]").value = "Mail text"; // prettier-ignore
            document.querySelector("#link-panel [name=tiptap-confirm]").dispatchEvent(new Event("click")); // prettier-ignore
            await utils.timeout(1);

            const anchor = document.querySelector(".tiptap-container a");
            expect(anchor.href).toBe("mailto:info@patternslib.com");
            expect(anchor.textContent).toBe("Mail text");
        });

        it("5.4 - Corrects a mailto address with missing protocoll.", async () => {
            document.querySelector("#link-panel [name=tiptap-href]").value = "info@patternslib.com"; // prettier-ignore
            document.querySelector("#link-panel [name=tiptap-text]").value = "Mail text"; // prettier-ignore
            document.querySelector("#link-panel [name=tiptap-confirm]").dispatchEvent(new Event("click")); // prettier-ignore
            await utils.timeout(1);

            const anchor = document.querySelector(".tiptap-container a");
            expect(anchor.href).toBe("mailto:info@patternslib.com");
            expect(anchor.textContent).toBe("Mail text");
        });

        it("5.5 - Handles exotic protocolls, like ftp://", async () => {
            document.querySelector("#link-panel [name=tiptap-href]").value = "ftp://patternslib.com"; // prettier-ignore
            document.querySelector("#link-panel [name=tiptap-text]").value = "FTP text"; // prettier-ignore
            document.querySelector("#link-panel [name=tiptap-confirm]").dispatchEvent(new Event("click")); // prettier-ignore
            await utils.timeout(1);

            const anchor = document.querySelector(".tiptap-container a");
            expect(anchor.href).toBe("ftp://patternslib.com/");
            expect(anchor.textContent).toBe("FTP text");
        });

        it("5.6 - ... or callto:", async () => {
            document.querySelector("#link-panel [name=tiptap-href]").value = "callto:0123456789"; // prettier-ignore
            document.querySelector("#link-panel [name=tiptap-text]").value = "Callto text"; // prettier-ignore
            document.querySelector("#link-panel [name=tiptap-confirm]").dispatchEvent(new Event("click")); // prettier-ignore
            await utils.timeout(1);

            const anchor = document.querySelector(".tiptap-container a");
            expect(anchor.href).toBe("callto:0123456789");
            expect(anchor.textContent).toBe("Callto text");
        });

        it("5.7 - Supports obscure protocols, when configured.", async () => {
            document.querySelector("#link-panel [name=tiptap-href]").value = "fantasy://patternslib.com"; // prettier-ignore
            document.querySelector("#link-panel [name=tiptap-text]").value = "Link text"; // prettier-ignore
            document.querySelector("#link-panel [name=tiptap-confirm]").dispatchEvent(new Event("click")); // prettier-ignore
            await utils.timeout(1);

            const anchor = document.querySelector(".tiptap-container a");
            expect(anchor).toBeTruthy();
            expect(anchor.href).toBe("fantasy://patternslib.com");
            expect(anchor.textContent).toBe("Link text");
        });

        it("5.8 - Opens a link context menu", async () => {
            // Add a link to test the context menu on.
            document.querySelector("#link-panel [name=tiptap-href]").value = "https://patternslib.com"; // prettier-ignore
            document.querySelector("#link-panel [name=tiptap-text]").value = "Link text"; // prettier-ignore
            document.querySelector("#link-panel [name=tiptap-confirm]").dispatchEvent(new Event("click")); // prettier-ignore
            await utils.timeout(1);

            const editable = document.querySelector(
                ".tiptap-container [contenteditable]",
            );
            const range = document.createRange();
            const sel = window.getSelection();

            // Add the triggering character into the content editable
            editable.innerHTML = "<p>@</p>";

            // Set the cursor right after the @-sign.
            range.setStart(editable.childNodes[0].childNodes[0], 1);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);

            // Wait some ticks.
            await utils.timeout(1);
            await utils.timeout(1);

            // Context menu not yet opened.
            expect(document.querySelector(".tiptap-link-context-menu")).toBeFalsy();

            // Context menu opens with a 50ms delay.
            await utils.timeout(50);

            // Context menu should be opened now.
            expect(document.querySelector(".tiptap-link-context-menu")).toBeTruthy();

            // Wait two more ticks for the context menu to be fully initialized.
            await utils.timeout(1);
            await utils.timeout(1);

            // UI elements should be initialized now.
            expect(
                document.querySelector(".tiptap-link-context-menu .tiptap-open-new-link")
                    .href,
            ).toBe("https://patternslib.com/");
        });
    });

    it("6.1 - Adds an image within <figure> tags including a <figcaption>", async () => {
        document.body.innerHTML = `
          <div id="tiptap-external-toolbar">
            <a class="button-image pat-modal" href="#modal-image">Image</a>
          </div>
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                toolbar-external: #tiptap-external-toolbar;
                image-panel: #image-panel
              ">
          </textarea>
          <template id="modal-image">
            <form id="image-panel">
              <input name="tiptap-src" type="text"/>
              <input name="tiptap-alt"/>
              <input name="tiptap-title"/>
              <input name="tiptap-caption"/>
              <button
                  type="submit"
                  name="tiptap-confirm"
                  class="close-panel">submit</button>
            </form>
          </template>
        `;

        const pattern = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(pattern);

        const button_image = document.querySelector("#tiptap-external-toolbar .button-image"); // prettier-ignore
        await events.await_pattern_init(new PatternModal(button_image));

        document.querySelector(".tiptap-container [contenteditable]").focus(); // Set focus to bypass toolbar check

        button_image.click();
        await events.await_event(document, "patterns-injected-delayed");
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
            <a class="button-image pat-modal" href="#modal-image">Image</a>
          </div>
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                toolbar-external: #tiptap-external-toolbar;
                image-panel: #image-panel
              ">
          </textarea>
          <template id="modal-image">
            <form id="image-panel">
              <input name="tiptap-src" type="text"/>
              <input name="tiptap-alt"/>
              <input name="tiptap-title"/>
              <input name="tiptap-caption"/>
              <button
                  type="submit"
                  name="tiptap-confirm"
                  class="close-panel">submit</button>
            </form>
          <template id="modal-image">
        `;

        const pattern = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(pattern);

        const button_image = document.querySelector("#tiptap-external-toolbar .button-image"); // prettier-ignore
        await events.await_pattern_init(new PatternModal(button_image));

        document.querySelector(".tiptap-container [contenteditable]").focus(); // Set focus to bypass toolbar check

        button_image.click();
        await events.await_event(document, "patterns-injected-delayed");
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
            <a class="button-image pat-modal" href="#modal-image">Image</a>
          </div>
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                toolbar-external: #tiptap-external-toolbar;
                image-panel: #image-panel
              ">
          </textarea>
          <template id="modal-image">
            <form id="image-panel">
              <input name="tiptap-src" type="text"/>
              <button
                  type="submit"
                  name="tiptap-confirm"
                  class="close-panel">submit</button>
            </form>
          </template>
        `;

        const pattern = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(pattern);

        const button_image = document.querySelector("#tiptap-external-toolbar .button-image"); // prettier-ignore
        await events.await_pattern_init(new PatternModal(button_image));

        document.querySelector(".tiptap-container [contenteditable]").focus(); // Set focus to bypass toolbar check

        button_image.click();
        await events.await_event(document, "patterns-injected-delayed");
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

        const pattern = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(pattern);

        // Images are parsed and shown in the editor
        expect(
            document.querySelectorAll(
                ".tiptap-container img:not(.ProseMirror-separator)"
            ).length
        ).toBe(3);

        // Also those .ProseMirror-trailingBreak <br>s are added.
        // Only two of them - there is inline content after the second image and ProseMirror doesn't add the extra <br> in that case.
        // Also see: https://github.com/ProseMirror/prosemirror/issues/1241
        expect(document.querySelectorAll(".ProseMirror-trailingBreak").length).toBe(2);
    });

    it("7.1 - Add a YouTube embed", async () => {
        document.body.innerHTML = `
          <div id="tiptap-external-toolbar">
            <a class="button-embed pat-modal" href="#modal-embed">Embed</a>
          </div>
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                toolbar-external: #tiptap-external-toolbar;
                embed-panel: #embed-panel
              ">
          </textarea>
          <template id="modal-embed">
            <form id="embed-panel">
              <input name="tiptap-src" type="text"/>
              <input name="tiptap-title"/>
              <input name="tiptap-caption"/>
              <button
                  type="submit"
                  name="tiptap-confirm"
                  class="close-panel">submit</button>
            </form>
          </template>
        `;

        const pattern = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(pattern);

        const button_embed = document.querySelector("#tiptap-external-toolbar .button-embed"); // prettier-ignore
        await events.await_pattern_init(new PatternModal(button_embed));

        document.querySelector(".tiptap-container [contenteditable]").focus(); // Set focus to bypass toolbar check

        button_embed.click();
        await events.await_event(document, "patterns-injected-delayed");
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
            <a class="button-embed pat-modal" href="#modal-embed">Embed</a>
          </div>
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                toolbar-external: #tiptap-external-toolbar;
                embed-panel: #embed-panel
              ">
          </textarea>
          <template id="modal-embed">
            <form id="embed-panel">
              <input name="tiptap-src" type="text"/>
              <button
                  type="submit"
                  name="tiptap-confirm"
                  class="close-panel">submit</button>
            </form>
          </template>
        `;

        const pattern = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(pattern);

        const button_embed = document.querySelector("#tiptap-external-toolbar .button-embed"); // prettier-ignore
        await events.await_pattern_init(new PatternModal(button_embed));

        document.querySelector(".tiptap-container [contenteditable]").focus(); // Set focus to bypass toolbar check

        button_embed.click();
        await events.await_event(document, "patterns-injected-delayed");
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
            <a class="button-embed pat-modal" href="#modal-embed">Embed</a>
          </div>
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                toolbar-external: #tiptap-external-toolbar;
                embed-panel: #embed-panel
              ">
          </textarea>
          <template id="modal-embed">
            <form id="embed-panel">
              <input name="tiptap-src" type="text"/>
              <input name="tiptap-title"/>
              <input name="tiptap-caption"/>
              <button
                  type="submit"
                  name="tiptap-confirm"
                  class="close-panel">submit</button>
            </form>
          </template>
        `;

        const pattern = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(pattern);

        const button_embed = document.querySelector("#tiptap-external-toolbar .button-embed"); // prettier-ignore
        await events.await_pattern_init(new PatternModal(button_embed));

        document.querySelector(".tiptap-container [contenteditable]").focus(); // Set focus to bypass toolbar check

        button_embed.click();
        await events.await_event(document, "patterns-injected-delayed");
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
            <a class="button-embed pat-modal" href="#modal-embed">Embed</a>
          </div>
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                toolbar-external: #tiptap-external-toolbar;
                embed-panel: #embed-panel
              ">
          </textarea>
          <template id="modal-embed">
            <form id="embed-panel">
              <input name="tiptap-src" type="text"/>
              <button
                  type="submit"
                  name="tiptap-confirm"
                  class="close-panel">submit</button>
            </form>
          </template>
        `;

        const pattern = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(pattern);

        const button_embed = document.querySelector("#tiptap-external-toolbar .button-embed"); // prettier-ignore
        await events.await_pattern_init(new PatternModal(button_embed));

        document.querySelector(".tiptap-container [contenteditable]").focus(); // Set focus to bypass toolbar check

        button_embed.click();
        await events.await_event(document, "patterns-injected-delayed");
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

        const pattern = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(pattern);

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
        await utils.timeout(1); // Wait another tick.
        await utils.timeout(1); // Wait another tick.

        // Check for class ``tiptap-mentions`` set on tooltip container.
        expect(
            document.querySelector(".tooltip-container.tiptap-mentions")
        ).toBeTruthy();

        expect(document.querySelector(".tiptap-items")).toBeTruthy();

        // 1st
        const items = document.querySelectorAll(".tiptap-items .tiptap-item");
        expect(items.length).toBeGreaterThan(0);
        expect(items[0].classList.contains("active")).toBe(true);

        // 2nd
        editable.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
        expect(items[0].classList.contains("active")).toBe(false);
        expect(items[1].classList.contains("active")).toBe(true);
        expect(items[2].classList.contains("active")).toBe(false);

        // 3rd
        editable.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
        expect(items[0].classList.contains("active")).toBe(false);
        expect(items[1].classList.contains("active")).toBe(false);
        expect(items[2].classList.contains("active")).toBe(true);

        // 1st
        editable.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
        expect(items[0].classList.contains("active")).toBe(true);
        expect(items[1].classList.contains("active")).toBe(false);
        expect(items[2].classList.contains("active")).toBe(false);

        // select
        editable.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
        await utils.timeout(1);
        expect(document.querySelector(".tiptap-items")).toBeFalsy();
        const mention = editable.firstChild.firstChild;
        expect(mention.textContent).toBe("@item a");
        expect(mention.href).toBe("https://demo.com/itema");
        expect(mention.hasAttribute("data-mention")).toBe(true);
        expect(mention.getAttribute("data-mention")).toBe("jepp");
        expect(mention.getAttribute("data-pat-inject")).toBe("source:#some");

        global.fetch.mockClear();
        delete global.fetch;
    });

    it("8.2 - always inserts ``data-NAME`` even if not set", async () => {
        global.fetch = jest.fn().mockImplementation(mockFetch(SUGGESTION_RESPONSE));

        document.body.innerHTML = `
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                mentions-menu: https://demo.at/mentions.html;
              ">
          </textarea>
        `;

        const pattern = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(pattern);

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
        await utils.timeout(1); // Wait another tick.
        await utils.timeout(1); // Wait another tick.

        // Select 2nd
        const items = document.querySelectorAll(".tiptap-items .tiptap-item");
        editable.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
        expect(items[1].classList.contains("active")).toBe(true);

        // select
        editable.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
        await utils.timeout(1);
        expect(document.querySelector(".tiptap-items")).toBeFalsy();
        const mention = editable.firstChild.firstChild;
        expect(mention.textContent).toBe("@item b");
        expect(mention.href).toBe("https://demo.com/itemb");
        expect(mention.getAttribute("class")).toBe("class_item_b");
        expect(mention.hasAttribute("data-mention")).toBe(true);
        expect(mention.getAttribute("data-mention")).toBe("");

        global.fetch.mockClear();
        delete global.fetch;
    });

    it("8.3 - Can use the mouse for suggestions", async () => {
        global.fetch = jest.fn().mockImplementation(mockFetch(SUGGESTION_RESPONSE));

        document.body.innerHTML = `
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                mentions-menu: https://demo.at/mentions.html;
              ">
          </textarea>
        `;

        const pattern = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(pattern);

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
        await utils.timeout(1); // Wait another tick.
        await utils.timeout(1); // Wait another tick.

        const items = document.querySelectorAll(".tiptap-items .tiptap-item");

        // click first item
        items[0].querySelector("a").click();
        await utils.timeout(1);

        expect(document.querySelector(".tiptap-items")).toBeFalsy();
        const mention = editable.firstChild.firstChild;
        expect(mention.textContent).toBe("@item a");
        expect(mention.href).toBe("https://demo.com/itema");
        expect(mention.hasAttribute("data-mention")).toBe(true);
        expect(mention.getAttribute("data-mention")).toBe("jepp");
        expect(mention.getAttribute("data-pat-inject")).toBe("source:#some");

        global.fetch.mockClear();
        delete global.fetch;
    });

    it("8.4 - Can use the mouse for suggestions, click within the anchor and still copy correct attributes.", async () => {
        global.fetch = jest.fn().mockImplementation(mockFetch(SUGGESTION_RESPONSE));

        document.body.innerHTML = `
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                mentions-menu: https://demo.at/mentions.html;
              ">
          </textarea>
        `;

        const pattern = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(pattern);

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
        await utils.timeout(1); // Wait another tick.
        await utils.timeout(1); // Wait another tick.

        const items = document.querySelectorAll(".tiptap-items .tiptap-item");

        // click first item
        items[0].querySelector("span").click();
        await utils.timeout(1);

        expect(document.querySelector(".tiptap-items")).toBeFalsy();
        const mention = editable.firstChild.firstChild;
        expect(mention.textContent).toBe("@item a");
        expect(mention.href).toBe("https://demo.com/itema");
        expect(mention.hasAttribute("data-mention")).toBe(true);
        expect(mention.getAttribute("data-mention")).toBe("jepp");
        expect(mention.getAttribute("class")).toBe("class_item_a"); // don't copy the span's class where click event happended.
        expect(mention.getAttribute("data-pat-inject")).toBe("source:#some");

        global.fetch.mockClear();
        delete global.fetch;
    });

    it("8.5 - Suggestions: Can use suggestions for tagging", async () => {
        global.fetch = jest.fn().mockImplementation(mockFetch(SUGGESTION_RESPONSE));

        document.body.innerHTML = `
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                tags-menu: https://demo.at/tags.html;
              ">
          </textarea>
        `;

        const pattern = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(pattern);

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
        await utils.timeout(1); // Wait another tick.
        await utils.timeout(1); // Wait another tick.

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
        await utils.timeout(1);
        expect(document.querySelector(".tiptap-items")).toBeFalsy();
        const mention = editable.firstChild.firstChild;
        expect(mention.textContent).toBe("#item b");
        expect(mention.href).toBe("https://demo.com/itemb");
        expect(mention.classList.contains("class_item_b")).toBe(true);
        expect(mention.hasAttribute("data-tag")).toBe(true);

        global.fetch.mockClear();
        delete global.fetch;
    });

    it("8.6 - Suggestions: Don't copy disallowed attributes", async () => {
        global.fetch = jest.fn().mockImplementation(mockFetch(SUGGESTION_RESPONSE));

        document.body.innerHTML = `
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                tags-menu: https://demo.at/tags.html;
              ">
          </textarea>
        `;

        const pattern = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(pattern);

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
        await utils.timeout(1); // Wait another tick.
        await utils.timeout(1); // Wait another tick.

        const items = document.querySelectorAll(".tiptap-items .tiptap-item");
        items[0].querySelector("a").click();
        await utils.timeout(1);

        expect(document.querySelector(".tiptap-items")).toBeFalsy();
        const mention = editable.firstChild.firstChild;
        expect(mention.textContent).toBe("#item a");
        expect(mention.href).toBe("https://demo.com/itema");
        expect(mention.classList.contains("class_item_a")).toBe(true);
        expect(mention.hasAttribute("data-tag")).toBe(true);
        expect(mention.hasAttribute("data-mention")).toBe(false); // No mention when tagging.

        global.fetch.mockClear();
        delete global.fetch;
    });

    it("8.7 - Suggestions: Test more attributes", async () => {
        const response = `
            <html>
              <body>
                <section class="tiptap-items">
                  <ul>
                    <li class="tiptap-item" data-tiptap-value="item a">
                      <a
                          class=""
                          href=""
                          target=""
                          title=""
                          data-id=""
                          data-pat-inject=""
                          data-pat-forward=""
                          data-pat-modal=""
                          data-pat-switch=""
                          data-pat-toggle=""
                          data-pat-tooltip=""
                          aria-activedescendant=""
                          aria-atomic=""
                          aria-autocomplete=""
                          aria-busy=""
                          aria-checked=""
                          aria-controls=""
                          aria-describedby=""
                          aria-disabled=""
                          aria-dropeffect=""
                          aria-expanded=""
                          aria-flowto=""
                          aria-grabbed=""
                          aria-haspopup=""
                          aria-hidden=""
                          aria-invalid=""
                          aria-label=""
                          aria-labelledby=""
                          aria-level=""
                          aria-live=""
                          aria-multiline=""
                          aria-multiselectable=""
                          aria-orientation=""
                          aria-owns=""
                          aria-posinset=""
                          aria-pressed=""
                          aria-readonly=""
                          aria-relevant=""
                          aria-required=""
                          aria-selected=""
                          aria-setsize=""
                          aria-sort=""
                          aria-valuemax=""
                          aria-valuemin=""
                          aria-valuenow=""
                          aria-valuetext=""
                          role=""
                      >
                        test
                      </a>
                    </li>
                  </ul>
                </section>
              </body>
            </html>
        `;

        global.fetch = jest.fn().mockImplementation(mockFetch(response));

        document.body.innerHTML = `
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                tags-menu: https://demo.at/tags.html;
              ">
          </textarea>
        `;

        const pattern = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(pattern);

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
        await utils.timeout(1); // Wait another tick.
        await utils.timeout(1); // Wait another tick.

        const items = document.querySelectorAll(".tiptap-items .tiptap-item");
        items[0].querySelector("a").click();
        await utils.timeout(1);

        expect(document.querySelector(".tiptap-items")).toBeFalsy();
        const mention = editable.firstChild.firstChild;
        expect(mention.textContent).toBe("#item a");

        // Test all attributes
        expect(mention.getAttribute("class")).toBe("");
        expect(mention.getAttribute("href")).toBe("");
        expect(mention.getAttribute("target")).toBe("");
        expect(mention.getAttribute("title")).toBe("");
        expect(mention.getAttribute("data-id")).toBe("");
        expect(mention.getAttribute("data-title")).toBe("item a"); // automatically added. The value is the link's content.
        expect(mention.getAttribute("data-pat-inject")).toBe("");
        expect(mention.getAttribute("data-pat-forward")).toBe("");
        expect(mention.getAttribute("data-pat-modal")).toBe("");
        expect(mention.getAttribute("data-pat-switch")).toBe("");
        expect(mention.getAttribute("data-pat-toggle")).toBe("");
        expect(mention.getAttribute("data-pat-tooltip")).toBe("");

        // Accessibility attributes
        for (const attr of tiptap_utils.accessibility_attributes) {
            expect(mention.getAttribute(attr)).toBe("");
        }

        global.fetch.mockClear();
        delete global.fetch;
    });

    it("8.8 - Close suggestion dialog when clicking outside", async () => {
        global.fetch = jest.fn().mockImplementation(mockFetch(SUGGESTION_RESPONSE));

        document.body.innerHTML = `
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                tags-menu: https://demo.at/tags.html;
              ">
          </textarea>
        `;

        const pattern = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(pattern);

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
        await utils.timeout(1); // Wait another tick.
        await utils.timeout(1); // Wait another tick.

        // Check for class ``tiptap-tags`` set on tooltip container.
        expect(document.querySelector(".tooltip-container.tiptap-tags")).toBeTruthy();
        expect(document.querySelector(".tiptap-items")).toBeTruthy();

        // No close when clicking within the suggestion menu
        document.querySelector(".tiptap-items").dispatchEvent(events.mousedown_event());
        expect(document.querySelector(".tooltip-container.tiptap-tags")).toBeTruthy();

        // Close when clicking outside the suggestion menu
        document.body.dispatchEvent(events.mousedown_event());
        await utils.timeout(1);
        expect(document.querySelector(".tooltip-container.tiptap-tags")).toBeFalsy();

        global.fetch.mockClear();
        delete global.fetch;
    });

    it("8.9 - Close suggestion with Escape", async () => {
        global.fetch = jest.fn().mockImplementation(mockFetch(SUGGESTION_RESPONSE));

        document.body.innerHTML = `
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                tags-menu: https://demo.at/tags.html;
              ">
          </textarea>
        `;

        const pattern = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(pattern);

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
        await utils.timeout(1); // Wait another tick.
        await utils.timeout(1); // Wait another tick.

        // Check for class ``tiptap-tags`` set on tooltip container.
        expect(document.querySelector(".tooltip-container.tiptap-tags")).toBeTruthy();
        expect(document.querySelector(".tiptap-items")).toBeTruthy();

        // Close when pressing "Escape"
        editable.dispatchEvent(
            new KeyboardEvent("keydown", {
                key: "Escape",
                bubbles: true,
                cancelable: true,
            })
        );
        await utils.timeout(1);
        expect(document.querySelector(".tooltip-container.tiptap-tags")).toBeFalsy();

        global.fetch.mockClear();
        delete global.fetch;
    });

    it("8.10 - Uses data-title for displaying the text", async () => {
        document.body.innerHTML = `
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                mentions-menu: https://demo.at/mentions.html;
              ">
            <a data-mention data-title="James Dean">James Byron Dean</a>
          </textarea>
        `;

        const pattern = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(pattern);

        expect(document.querySelector("[data-mention]").textContent).toBe("@James Dean");
    });

    it("8.11 - Falls back to text if no data-title is available.", async () => {
        document.body.innerHTML = `
          <textarea
              class="pat-tiptap"
              data-pat-tiptap="
                mentions-menu: https://demo.at/mentions.html;
              ">
            <a data-mention>James Byron Dean</a>
          </textarea>
        `;

        const pattern = new Pattern(document.querySelector(".pat-tiptap"));
        await events.await_pattern_init(pattern);

        expect(document.querySelector("[data-mention]").textContent).toBe(
            "@James Byron Dean"
        );
    });
});
