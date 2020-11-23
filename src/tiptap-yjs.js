import { keymap } from "prosemirror-keymap";
import { Extension } from "tiptap";
import {
    redo,
    undo,
    yCursorPlugin,
    ySyncPlugin,
    yUndoPlugin,
} from "y-prosemirror";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import "./tiptap-yjs.css";

const ydoc = new Y.Doc();
const type = ydoc.getXmlFragment("prosemirror");

export default class RealtimeExtension extends Extension {
    constructor(server_url, document_name) {
        super();
        // Open websocket connection.
        this.provider = new WebsocketProvider(server_url, document_name, ydoc);
    }

    get name() {
        return "realtime";
    }

    get plugins() {
        return [
            ySyncPlugin(type),
            yCursorPlugin(this.provider.awareness),
            yUndoPlugin(),
            keymap({
                "Mod-z": undo,
                "Mod-y": redo,
                "Mod-Shift-z": redo,
            }),
        ];
    }
}
