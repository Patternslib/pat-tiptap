import { Node, mergeAttributes } from "@tiptap/core";
import { Plugin } from "prosemirror-state";

export const factory = () => {
    return Node.create({
        name: "fixed-paragraph",

        addOptions() {
            return {
                HTMLAttributes: {
                    class: "fixed-paragraph",
                },
            };
        },

        group: "block",
        isolating: true,
        selectable: false,

        parseHTML() {
            return [
                {
                    tag: "p",
                    getAttrs: (node) => node.matches(".fixed-paragraph") && null,
                },
            ];
        },

        renderHTML({ HTMLAttributes }) {
            return [
                "p",
                mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
                " ", // Add a space to the end of the paragraph to make it selectable
            ];
        },

        addProseMirrorPlugins() {
            return [
                new Plugin({
                    filterTransaction(transaction, state) {
                        let result = true; // true for keep, false for stop transaction
                        const replaceSteps = [];
                        transaction.steps.forEach((step, index) => {
                            if (step.jsonID === "replace") {
                                replaceSteps.push(index);
                            }
                        });

                        replaceSteps.forEach((index) => {
                            const map = transaction.mapping.maps[index];
                            const oldStart = map.ranges[0];
                            const oldEnd = map.ranges[0] + map.ranges[1];
                            state.doc.nodesBetween(oldStart, oldEnd, (node) => {
                                if (node.type.name === "fixed-paragraph") {
                                    result = false;
                                }
                            });
                        });
                        return result;
                    },
                }),
            ];
        },
    });
};
