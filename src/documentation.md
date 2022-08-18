## Documentation

When invoked on an element, the element is hidden and it's value is synchronized with updates in the editor.


### Usage

Invokation on a textarea element

    <textarea
        name="text"
        class="pat-tiptap">
      <h1>hello</h1>
      <p>I am some text content</p>
    </textarea>


Invocation on a div element

    <div
        name="text"
        class="pat-tiptap"
        contenteditable>
      <h1>hello</h1>
      <p>I am some text content</p>
    </div>


### Building the user interface

The tiptap editor comes without a user interface, as does this Patternslib integration of the tiptap editor.
You can build the user interface entirely using HTML and the Patterns concepts.


#### Adding a toolbar

Configure the options ``toolbar-external`` with a CSS selector pointing to the toolbar container:

    <div id="tiptap-external-toolbar">
      <button type="button" class="button-bold">Bold</button>
      <button type="button" class="button-italic">Italic</button>
      <button type="button" class="button-strike">Strike</button>
    </div>

    <textarea
        name="text"
        class="pat-tiptap"
        data-pat-tiptap="
            toolbar-external: #tiptap-external-toolbar
        ">
    </textarea>


pat-tiptap is set up to listen to click events on HTML elements with specific classes.
The classes are:

- ``.button-blockquote``
- ``.button-bold``
- ``.button-code``
- ``.button-code-block``
- ``.button-heading-level-1``
- ``.button-heading-level-2``
- ``.button-heading-level-3``
- ``.button-heading-level-4``
- ``.button-heading-level-5``
- ``.button-heading-level-6``
- ``.button-horizontal-rule``
- ``.button-italic``
- ``.button-ordered-list``
- ``.button-paragraph``
- ``.button-redo``
- ``.button-strike``
- ``.button-table-add-column-left``
- ``.button-table-add-column-right``
- ``.button-table-add-row-above``
- ``.button-table-add-row-below``
- ``.button-table-create``
- ``.button-table-header-cell``
- ``.button-table-header-column``
- ``.button-table-header-row``
- ``.button-table-merge-cells``
- ``.button-table-remove``
- ``.button-table-remove-column``
- ``.button-table-remove-row``
- ``.button-undo``
- ``.button-unordered-list``


The following buttons need additional configuration to open an overlay with more user input options (See below):

- ``.button-link``
- ``.button-image``
- ``.button-source``
- ``.button-embed``


If these buttons are not available the associated functionality is not loaded, not initialized and not available.


#### Adding a link overlay

The following button uses ``pat-modal`` to open a overlay, referenced by the CSS selector ``#modal-link`` in the same document.
Note: You can also load the modal contents from any URL.

    <div id="tiptap-external-toolbar">
      <a
          class="button-link pat-modal"
          href="#modal-link">Link</a>
    </div>

This is the DOM structure with the overlay:

    <div id="modal-link" hidden>
      <form class="link-panel pat-validation">
        <label>
          Link URL:
          <input type="url" name="tiptap-href" placeholder="https://"/>
        </label>
        <label>
          Link Text:
          <input type="text" name="tiptap-text"/>
        </label>
        <label>
          Open in new window:
          <input type="checkbox" name="tiptap-target" value="_blank" />
        </label>
        <button class="close-panel" type="button" name="tiptap-confirm">submit</button>
        <button class="close-panel" type="button" name="tiptap-remove">remove link</button>
      </form>
    </div>

The ``input[name=tiptap-href]`` is the only input element necessary.
You can use these elements with these names:

- ``tiptap-href``: Link URL.
- ``tiptap-text``: Link text.
- ``tiptap-target``: Indicates if the link should be opened in a new tab. The ``value`` needs to be set to the target name in which the link should be opened.
- ``tiptap-confirm``: To save the changes back to the editor.
- ``tiptap-remove``: To remove the link.

You also need to configure ``pat-tiptap`` with the ``link-panel`` option which points to the form element in the overlay.
pat-tiptap uses a ``MutationObserver`` to check for changes in the overlay's DOM structure and re-initializes the functionality once the DOM structure changes.
This way, you can use ``pat-inject``, ``pat-tabs``, ``pat-stacks`` or the like which changes the overlays content and always get the link panel form initlized.

This is the related ``pat-tiptap`` config:

    data-pat-tiptap="
        link-panel: #pat-modal .link-panel;
    "


#### Adding a link context menu

When clicking on a editable link in the editor in edit mode you can provide a popup which allows you to open the link, edit the link or unlink it.
This does not apply to non-editable links like linked mentions or tags.

You have to provide a context menu container in the same document or accessible via an URL which content's are used for the ``pat-tooltip`` popup:

    <div id="context-menu-link" hidden>
      <ul class="tiptap-link-context-menu">
        <li>
          <a
            class="close-panel tiptap-open-new-link"
            target="_blank"
            href="">Visit linked web page</a>
        </li>
        <li>
          <button
            type="button"
            class="close-panel tiptap-edit-link">Edit link</button>
        </li>
        <li>
          <button
            type="button"
            class="close-panel tiptap-unlink">Unlink</button>
        </li>
      </ul>
    </div>

None of these elements are mandatory but if you want to provide the associated functionality you need to use these class names:

- ``tiptap-open-new-link``: The ``<a>`` element where ``pat-tiptap`` sets the URL which should be opened.
- ``tiptap-edit-link``: The element which opens the edit overlay when clicking on it.
- ``tiptap-unlink``: The element which will unlink the link.


This is the pattern configuration:

    data-pat-tiptap="
        link-menu: #context-menu-link;
    "

``link-menu``: URL or CSS selector pointing to the context menu contents.


#### Adding a image selection overlay

Images are placed in a ``figure`` tag and have an optional ``figcaption`` tag.

The following button uses ``pat-modal`` to open a overlay, referenced by the CSS selector ``#modal-image`` in the same document.
Note: You can also load the modal contents from any URL.

    <a
        class="button-image pat-modal"
        href="#modal-image">Image</a>

This is the DOM structure with the overlay:

    <div id="modal-image" hidden>
      <form class="image-panel pat-validation">
        <label>
          Image URL:
          <input type="url" name="tiptap-src" placeholder="https://"/>
        </label>
        <label>
          Title:
          <input type="text" name="tiptap-title"/>
        </label>
        <label>
          Alternative text:
          <input type="text" name="tiptap-alt"/>
        </label>
        <label>
          Caption:
          <textarea name="tiptap-caption"></textarea>
        </label>
        <button class="close-panel" type="button" name="tiptap-confirm">submit</button>
      </form>
    </div>

The ``input[name=tiptap-src]`` is the only input element necessary.
You can use these elements with these names:

- ``tiptap-src``: Image URL for the ``src`` attribute.
- ``tiptap-title``: Image ``title`` attribute.
- ``tiptap-alt``: Image ``alt`` attribute.
- ``tiptap-caption``: Caption text placed in a ``figcaption`` tag.
- ``tiptap-confirm``: To save the changes back to the editor.

You also need to configure ``pat-tiptap`` with the ``image-panel`` option which points to the form element in the overlay.
pat-tiptap uses a ``MutationObserver`` to check for changes in the overlay's DOM structure and re-initializes the functionality once the DOM structure changes.
This way, you can use ``pat-inject``, ``pat-tabs`` or ``pat-stacks`` which changes the overlay content and automatically get the form reinitialized.
One idea would be to use a list of styled radio buttons with name ``tiptap-src`` and as value the URL of the image. This would then serve as a image selection widget.
For an upload widget you can use a combination of ``pat-upload`` and ``pat-inject`` to upload a image and then return a form with a hidden ``tiptap-src`` input field with the value of the new image URL. If the form is then finally submitted via ``tiptap-confirm`` the image is set into the editor.

This is the related ``pat-tiptap`` config:

    data-pat-tiptap="
        image-panel: #pat-modal .image-panel;
    "


#### Adding an embed overlay for videos

With the embed functionality you can add YouTube and Vimeo videos to your document.
You can use the embed URL or directly the link to the YouTube or Vimeo video page in which case the URLs are automatically changed to embed URLs.
Embed videos are placed within a ``figure`` tag and can have an optional ``figcaption``.

The following button uses ``pat-modal`` to open a overlay, referenced by the CSS selector ``#modal-embed`` in the same document.
Note: You can also load the modal contents from any URL.

    <a
        class="button-embed pat-modal"
        href="#modal-embed">Video</a>

This is the DOM structure with the overlay:

    <div id="modal-embed" hidden>
      <form class="embed-panel pat-validation">
        <label>
          Video URL:
          <input type="url" name="tiptap-src" placeholder="https://"/>
        </label>
        <label>
          Title:
          <input type="text" name="tiptap-title"/>
        </label>
        <label>
          Caption:
          <textarea name="tiptap-caption"></textarea>
        </label>
        <button class="close-panel" type="button" name="tiptap-confirm">submit</button>
      </form>
    </div>

The ``input[name=tiptap-src]`` is the only input element necessary.
You can use these elements with these names:

- ``tiptap-src``: Video URL for the ``src`` attribute, added to an ``iframe`` tag.
- ``tiptap-title``: ``title`` attribute for the ``iframe`` tag.
- ``tiptap-caption``: Caption text placed in a ``figcaption`` tag.
- ``tiptap-confirm``: To save the changes back to the editor.

You also need to configure ``pat-tiptap`` with the ``embed-panel`` option which points to the form element in the overlay.
pat-tiptap uses a ``MutationObserver`` to check for changes in the overlay's DOM structure and re-initializes the functionality once the DOM structure changes.
This way, you can use ``pat-inject``, ``pat-tabs`` or ``pat-stacks`` which changes the overlay content and automatically get the form reinitialized.

This is the related ``pat-tiptap`` config:

    data-pat-tiptap="
        embed-panel: #pat-modal .embed-panel;
    "


#### Adding a source view overlay

The following button uses ``pat-modal`` to open a overlay, referenced by the CSS selector ``#modal-source`` in the same document.
Note: You can also load the modal contents from any URL.

    <div id="tiptap-external-toolbar">
      <a
          class="button-source pat-modal"
          href="#modal-source">Source</a>
    </div>

This is the DOM structure with the overlay:

    <div id="modal-source" hidden>
      <form class="source-panel">
        <label>
          Source:
          <textarea name="tiptap-source"></textarea>
        </label>
        <button class="close-panel" type="button" name="tiptap-confirm">submit</button>
      </form>
    </div>


The ``input[name=tiptap-source]`` is the only input element necessary.
You can use these elements with these names:

- ``tiptap-source``: Textarea for the HTML source code.
- ``tiptap-confirm``: To save the changes back to the editor.

You also need to configure ``pat-tiptap`` with the ``source-panel`` option which points to the form element in the overlay.
pat-tiptap uses a ``MutationObserver`` to check for changes in the overlay's DOM structure and re-initializes the functionality once the DOM structure changes.
This way, you can use ``pat-inject``, ``pat-tabs``, ``pat-stacks`` or the like which changes the overlays content and always get the link panel form initlized.

This is the related ``pat-tiptap`` config:

    data-pat-tiptap="
        source-panel: #pat-modal .source-panel;
    "


#### Adding suggestion functionality

You can use the suggestion functionality to reference other content.
It is invoked by a suggestion-character - like ``@`` for mentions or ``#`` for tags.
Both - mentions and tags - are supported by pat-tiptap out of the box.

After typing the suggestion character ``@`` or ``#`` a list of suggestion items is loaded from the server.
The text you are entering after the suggestion character is used to filter the items by appending it as query string to the URL (You have to prepare the URL so that it contains the query key already).
You can use the mouse to select an item or the arrow keys to move up/down, enter for select and escape to close the tooltip.

When you select an item, the text in the content area is replaced with a link which contains the attributes from the original link from the overlay:

    - class
    - href
    - target
    - title
    - data-pat-inject
    - data-pat-forward
    - data-pat-modal
    - data-pat-switch
    - data-pat-toggle
    - data-pat-tooltip


The whole list must be wrapped within an element with a ``tiptap-items`` class.
The individual items in the list must be wrapped by an element which:

- has a ``tiptap-item`` class,
- and a ``data-tiptap-value`` attribute, which contains the text which as content for the resulting ``<a>`` tag.

The item itself must be a ``<a>`` element.

This class is used to initlize the keyboard and mouse navigation for the overlay.

You can add some patterns to the individual items which are then also copied to the content area (see the list above for supported patterns).
If so, you probably want to disable those patterns to be initialized when shown in the suggestion-menu.
To disable the patterns, just wrap the elements with a ``disable-patterns`` class - just not on the same level as ``tiptap-items`` and not on the ``<a>`` element itself.

This is an example:

        <section class="tiptap-items">
          <ul>
            <li class="tiptap-item disable-patterns" data-tiptap-value="hans"><a href="https://example.com/~hans" target="_blank">Hans</a></li>
            <li class="tiptap-item disable-patterns" data-tiptap-value="franz"><a href="https://example.com/~franz" target="_blank">Franz</a></li>
            <li class="tiptap-item disable-patterns" data-tiptap-value="sepp"><a href="https://example.com/~sepp" target="_blank">Sepp</a></li>
          </ul>
        </section>


You configure the suggestion functionality like follows.

    <textarea
        class="pat-tiptap pat-autofocus"
        data-pat-tiptap="
          mentions-menu: ./mentions-results.html?user_filter=;
          tags-menu: ./tags-results.html?tag_filter=;
        "
        >
    </textarea>


#### Autofocus support

If you want the text editor to automatically get the focus after loading you can either add the ``pat-autofocus`` class to pat-tiptap element or add the ``autofocus`` attribute.

Option 1: Add the ``pat-autofocus`` class:

    <textarea
        name="text"
        class="pat-tiptap pat-autofocus">
    </textarea>

Option 2: Add the ``autofocus`` attribute:

    <textarea
        name="text"
        class="pat-tiptap"
        autofocus>
    </textarea>


#### Placeholder support

To show a placeholder in the document add a placeholder attribute with the placeholder text to the pat-tiptap element:

    <textarea
        name="text"
        class="pat-tiptap"
        placeholder="Your poem goes here...">
    </textarea>

Then on empty paragraphs are annotated with some placeholder data like: ``<p data-placeholder="Your poem goes here..." class="is-empty is-editor-empty"><br></p>``.

To display the placeholder you need to add some CSS.

This is an CSS example to show the placeholder on top of page, if it is empty:

    /* Placeholder (at the top) */
    .ProseMirror p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      color: #ced4da;
      pointer-events: none;
      height: 0;
    }

This is an CSS example to show the placeholder on any empty paragraph:

    /* Placeholder (on every new line) */
    .ProseMirror p.is-empty::before {
      content: attr(data-placeholder);
      float: left;
      color: #ced4da;
      pointer-events: none;
      height: 0;
    }


### Options reference

| Property               | Type   | Description                                                                        |
| ---------------------- | ------ | ---------------------------------------------------------------------------------- |
| toolbar-external       | String | CSS selector pointing to a toolbar container.                                      |
| link-panel             | String | CSS selector pointing to the link form element in the overlay.                     |
| image-panel            | String | CSS selector pointing to the image form element in the overlay.                    |
| source-panel           | String | CSS selector pointing to the source form element in the overlay.                   |
| link-menu              | String | URL or CSS selector pointing to the link context menu contents.                    |
| mentions-menu          | String | URL or CSS selector pointing to the mentions context menu contents.                |
| tags-menu              | String | URL or CSS selector pointing to the tags context menu contents.                    |


