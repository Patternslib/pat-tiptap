import { Heading as TipTapHeading } from "@tiptap/extension-heading";

export const factory = () => {
    return TipTapHeading.extend({
        addInputRules() {
            // Clear markdown-style input rules to not interfer with tagging character "#".
            return [];
        },
    });
};
