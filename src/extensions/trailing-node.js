// TrailingNode extension from:
// https://gist.github.com/jelleroorda/2a3085f45ef75b9fdd9f76a4444d6bd6/0a2a7b51871bd01808f5663fcab9a4eb3d593559
// https://tiptap.dev/experiments/trailing-node
// https://github.com/ueberdosis/tiptap/issues/143
//
//   The trailing node extension is necessary to pragmatically fix a problem
//   with tables and table selections. When the last node in the document is a
//   table and the last table cell is empty, then pressing <CTRL>-<a> to select
//   everyting only selects the very first node in the document. As soon as one
//   of the conditions - table not the last node or last table cell not empty -
//   is not met, <CTRL>-<a> selects all, as expected.
//   The Problem exists throughout browsers.
//
//   More information here:
//   - https://github.com/ueberdosis/tiptap/issues/2401
//   - https://github.com/ueberdosis/tiptap/issues/3651
//

import { Extension } from "@tiptap/core";
import { PluginKey, Plugin } from "prosemirror-state";

function nodeEqualsType({ types, node }) {
    return (Array.isArray(types) && types.includes(node.type)) || node.type === types;
}

export const factory = () => {
    /**
     * Extension based on:
     * - https://github.com/ueberdosis/tiptap/blob/v1/packages/tiptap-extensions/src/extensions/TrailingNode.js
     * - https://github.com/remirror/remirror/blob/e0f1bec4a1e8073ce8f5500d62193e52321155b9/packages/prosemirror-trailing-node/src/trailing-node-plugin.ts
     */
    return Extension.create({
        name: "trailingNode",

        defaultOptions: {
            node: "fixed-paragraph",
            notAfter: ["paragraph", "fixed-paragraph"],
        },

        addProseMirrorPlugins() {
            const plugin = new PluginKey(this.name);
            const disabledNodes = Object.entries(this.editor.schema.nodes)
                .map(([, value]) => value)
                .filter((node) => this.options.notAfter.includes(node.name));

            return [
                new Plugin({
                    key: plugin,
                    appendTransaction: (_, __, state) => {
                        const { doc, tr, schema } = state;
                        const shouldInsertNodeAtEnd = plugin.getState(state);
                        const endPosition = doc.content.size;
                        const type = schema.nodes[this.options.node];

                        if (!shouldInsertNodeAtEnd) {
                            return;
                        }

                        return tr.insert(
                            endPosition,
                            type.create(null, [schema.text(" ")])
                        );
                    },
                    state: {
                        init: (_, state) => {
                            const lastNode = state.tr.doc.lastChild;
                            return !nodeEqualsType({
                                node: lastNode,
                                types: disabledNodes,
                            });
                        },
                        apply: (tr, value) => {
                            if (!tr.docChanged) {
                                return value;
                            }

                            const lastNode = tr.doc.lastChild;
                            return !nodeEqualsType({
                                node: lastNode,
                                types: disabledNodes,
                            });
                        },
                    },
                }),
            ];
        },
    });
};
