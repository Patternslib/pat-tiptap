# pat-tiptap

## Documentation

Pattern implementation of the tiptap editor.

See:

- https://tiptap.dev/


When invoking on an element, the element is hidden and it's value is synchronized with updates in the editor.


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

Configure the options ``toolbar-external`` with a CSS selector pointing to toolbar container:

    <div id="tiptap-external-toolbar">
      <button type="button" class="button-bold">Bold</button>
      <button type="button" class="button-italic">Italic</button>
      <button type="button" class="button-strike">Strike</button>
    </div>

    <textarea
        name="text"
        class="pat-tiptap"
        data-pat-toolbar="
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
      <form class="link-panel">
        <label>
          Link URL:
          <input type="text" name="tiptap-href"/>
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

- ``tiptap-href``: Link url
- ``tiptap-text``: Link text
- ``tiptap-target``: Indicates if the link should be opened in a new tab. The ``value`` needs to be set to the target name in which the link should be opened.
- ``tiptap-confirm``: To save the changes back to the editor.
- ``tiptap-remove``: To remove the link.

You also need to configure ``pat-tiptap`` with the ``link-panel`` option which points to the form element in the overlay.
pat-tiptap uses a ``MutationObserver`` to check for changes in the overlay's dom structure and re-initializes the functionality once the DOM structure changes.
This way, you can use ``pat-inject``, ``pat-tabs``, ``pat-stacks`` or the like which changes the overlays content and always get the link panel form initlized.

This is the related ``pat-tiptap`` config:

    data-pat-toolbar="
        link-panel: #pat-modal .link-panel;
    "


#### Adding a image selection overlay

The following button uses ``pat-modal`` to open a overlay, referenced by the CSS selector ``#modal-image`` in the same document.
Note: You can also load the modal contents from any URL.

    <a
        class="button-image pat-modal"
        href="#modal-image">Image</a>

This is the DOM structure with the overlay:

    <div id="modal-image" hidden>
      <form class="image-panel">
        <label>
          Image URL:
          <input type="text" name="tiptap-src"/>
        </label>
        <label>
          Title:
          <input type="text" name="tiptap-title"/>
        </label>
        <label>
          Alternative text:
          <input type="text" name="tiptap-alt"/>
        </label>
        <button class="close-panel" type="button" name="tiptap-confirm">submit</button>
      </form>
    </div>

The ``input[name=tiptap-src]`` is the only input element necessary.
You can use these elements with these names:

- ``tiptap-src``: Image url for the src attribute
- ``tiptap-title``: Image title attribute
- ``tiptap-alt``: Image alt attribute
- ``tiptap-confirm``: To save the changes back to the editor.

You also need to configure ``pat-tiptap`` with the ``image-panel`` option which points to the form element in the overlay.
Also here, pat-tiptap uses a ``MutationObserver`` to check for changes in the overlay's dom structure and re-initializes the functionality once the DOM structure changes.
This way, you can use ``pat-inject``, ``pat-tabs``, ``pat-stacks`` or the like which changes the overlays content and always get the link panel form initlized.
One idea would be to use a list of styled radio buttons with name ``tiptap-src`` and as value the URL of the image. This would then serve as a image selection widget.
For an upload widget you can use a combination of ``pat-upload`` and ``pat-inject`` to upload a image and then return a form with a hidden ``tiptap-src`` input field with the value of the new image URL. If the form is then finally submitted via ``tiptap-confirm`` the image is set into the editor.

This is the related ``pat-tiptap`` config:

    data-pat-toolbar="
        image-panel: #pat-modal .image-panel;
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
-- ``tiptap-confirm``: To save the changes back to the editor.

You also need to configure ``pat-tiptap`` with the ``source-panel`` option which points to the form element in the overlay.
pat-tiptap uses a ``MutationObserver`` to check for changes in the overlay's dom structure and re-initializes the functionality once the DOM structure changes.
This way, you can use ``pat-inject``, ``pat-tabs``, ``pat-stacks`` or the like which changes the overlays content and always get the link panel form initlized.

This is the related ``pat-tiptap`` config:

    data-pat-toolbar="
        source-panel: #pat-modal .source-panel;
    "


### Options reference

| Property               | Default Value | Values | Type   | Description                                                          |
| ---------------------- | ------------- | ------ | ------ | -------------------------------------------------------------------- |
| collaboration-server   | null          |        | String | URL of the YJS websocket server providing the collaboration backend. |
| collaboration-document | null          |        | String | ID or name of the document which should be edited.                   |


## TODO

- Collaboration features

