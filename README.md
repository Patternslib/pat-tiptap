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

Configure the options ``toolbar-external`` with a CSS selector pointing to the toolbar container:

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

    data-pat-toolbar="
        context-menu-link: #context-menu-link;
    "

``context-menu-link``: URL or CSS selector pointing to the context menu contents.


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


#### Adding @-mentions functionality

You can provide a mentioning functionality which is invoked by the ``@`` key and references a person - or actually anything you provide in the list.
Similar to the overlays described above, the selectable items are provided via form elements, e.g. checkboxes or radiobuttons.
This form element is opened in a ``pat-tooltip`` popup.
When the form is submitted - e.g. after selecting one element and submitting via ``pat-autosubmit`` - the value of the selected element is inserted as text and the URL to a profile page is constructed using the ``url-scheme-mentions`` parameter.

This is the container with the form element which is used as content for the ``pat-tooltip`` popup:

    <div id="context-menu-mentions" hidden>
      <form class="pat-checklist pat-autosubmit tiptap-mentions-context-menu">
        <ul>
          <li>
            <label>
            <input
                name="mention"
                type="checkbox"
                value="hans" />hans</label>
          </li>
          <li>
            <label>
            <input
                name="mention"
                type="checkbox"
                value="franz" />franz</label>
          </li>
          <li>
            <label>
            <input
                name="mention"
                type="checkbox"
                value="sepp" />sepp</label>
          </li>
        </ul>
      </form>
    </div>

The form needs include the ``tiptap-mentions-context-menu`` class.
The individual input elements which indicate a user need to have the name ``mention`` and a value which can be used to construct a URL via the ``url-scheme-mentions`` parameter explained below.


This is the pattern configuration:

    data-pat-toolbar="
        context-menu-mentions: #context-menu-mentions;
        url-scheme-mentions: https://quaive.cornelis.amsterdam/users/{USER};
    "

``context-menu-mentions``: CSS selector which points to a element in the current document or a URL from which the popup contents are loaded.
``url-scheme-mentions``: The base url for the user profile which is opened when clicking the mentioned user. ``{USER}`` is replaced by the selected value.


#### Adding #-tagging functionality

Similar to the mentioning functionality you can provide a tagging functionality which is invoked by the ``#`` key and references a category or tag - or actually anything you provide in the list.
The selectable items are provided via form elements, e.g. checkboxes or radiobuttons.
This form element is opened in a ``pat-tooltip`` popup.
When the form is submitted - e.g. after selecting one element and submitting via ``pat-autosubmit`` - the value of the selected element is inserted as text and the URL to a tag-search page is constructed using the ``url-scheme-tags`` parameter.

This is the container with the form element which is used as content for the ``pat-tooltip`` popup:

    <div id="context-menu-tags" hidden>
      <form class="pat-checklist pat-autosubmit tiptap-tags-context-menu">
        <ul>
          <li>
            <label><input name="tag" type="checkbox" value="I ♥ UTF-8" />I ♥ UTF-8</label>
          </li>
          <li>
            <label><input name="tag" type="checkbox" value="music" />music</label>
          </li>
          <li>
            <label><input name="tag" type="checkbox" value="books" />books</label>
          </li>
        </ul>
      </form>
    </div>


The form needs include the ``tiptap-tags-context-menu`` class.
The individual input elements which indicate a tag need to have the name ``tag`` and a value which can be used to construct a URL via the ``url-scheme-tags`` parameter explained below.


This is the pattern configuration:

    data-pat-toolbar="
        context-menu-tags: #context-menu-tags;
        url-scheme-tags: https://quaive.cornelis.amsterdam/tags/{TAG}";
    "

``context-menu-tags``: CSS selector which points to a element in the current document or a URL from which the popup contents are loaded.
``url-scheme-tags``: The base url for the tagging search page which is opened when clicking the tagged item. ``{TAG}`` is replaced by the selected value.


### Options reference

| Property               | Type   | Description                                                          |
| ---------------------- | ------ | -------------------------------------------------------------------- |
| toolbar-external       | String | CSS selector pointing to a toolbar container.                        |
| link-panel             | String | CSS selector pointing to the link form element in the overlay.       |
| image-panel            | String | CSS selector pointing to the image form element in the overlay.      |
| source-panel           | String | CSS selector pointing to the source form element in the overlay.     |
| context-menu-link      | String | URL or CSS selector pointing to the link context menu contents.      |
| context-menu-mentions  | String | URL or CSS selector pointing to the mentions context menu contents.  |
| url-scheme-mentions    | String | The base url for the user profile which is opened when clicking the mentioned user. ``{USER}`` is replaced by the selected value. |
| context-menu-tags      | String | URL or CSS selector pointing to the tags context menu contents.      |
| url-scheme-tags        | String | The base url for the tagging search page which is opened when clicking the tagged item. ``{TAG}`` is replaced by the selected value. |


## TODO

- Collaboration features

