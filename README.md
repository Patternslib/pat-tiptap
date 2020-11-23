# pat-tiptap

## Documentation

Pattern implementation of the TipTap editor with collaboration features realized by the YJS library.

See:

- https://tiptap.dev/

- https://yjs.dev/


When invoking on a textarea element, the textarea is hidden and it's value is synchronized with updates in the editor.
If the collaboration feature is used by defining a collaboration server and a document name, the changes are synchronized with the websocket backend service but not with the element where the texteditor was invoked.


### Usage

    <textarea
        name="text"
        class="pat-tiptap">
      <h1>hello</h1>
      <p>I am some text content</p>
    </textarea>


Example with collaboration support:

    <textarea
        name="text"
        class="pat-tiptap"
        data-pat-tiptap="collaboration-server: wss://demos.yjs.dev; collaboration-document: patternslib-demo">
    </textarea>


### Options reference

| Property               | Default Value | Values | Type   | Description                                                          |
| ---------------------- | ------------- | ------ | ------ | -------------------------------------------------------------------- |
| collaboration-server   | null          |        | String | URL of the YJS websocket server providing the collaboration backend. |
| collaboration-document | null          |        | String | ID or name of the document which should be edited.                   |
