import ExtBlockquote from "@tiptap/extension-blockquote";
import ExtBold from "@tiptap/extension-bold";
import ExtBulletList from "@tiptap/extension-bullet-list";
import ExtCode from "@tiptap/extension-code";
import ExtCodeBlock from "@tiptap/extension-code-block";
import ExtDocument from "@tiptap/extension-document";
import ExtEmbed from "./extensions/embed";
import ExtFigcaption from "./extensions/figcaption";
import ExtFigure from "./extensions/figure";
import ExtHardBreak from "@tiptap/extension-hard-break";
import ExtHeading from "./extensions/heading";
import ExtHorizontalRule from "@tiptap/extension-horizontal-rule";
import ExtImageFigure from "./extensions/image-figure";
import ExtImageInline from "./extensions/image-inline";
import ExtItalic from "@tiptap/extension-italic";
import ExtLink from "./extensions/link";
import ExtListItem from "@tiptap/extension-list-item";
import ExtOrderedList from "@tiptap/extension-ordered-list";
import ExtParagraph from "@tiptap/extension-paragraph";
import ExtStrike from "@tiptap/extension-strike";
import ExtTable from "@tiptap/extension-table";
import ExtTableCell from "@tiptap/extension-table-cell";
import ExtTableHeader from "@tiptap/extension-table-header";
import ExtTableRow from "@tiptap/extension-table-row";
import ExtText from "@tiptap/extension-text";

// source extension?

export const modes = {
    "text/html": [
        ExtBlockquote,
        ExtBold,
        ExtBulletList,
        ExtCode,
        ExtCodeBlock,
        ExtDocument,
        ExtEmbed,
        ExtFigcaption,
        ExtFigure,
        ExtHardBreak,
        ExtHeading,
        ExtHorizontalRule,
        ExtImageFigure,
        ExtImageInline,
        ExtItalic,
        ExtLink,
        ExtListItem,
        ExtOrderedList,
        ExtParagraph,
        ExtStrike,
        ExtTable,
        ExtTableCell,
        ExtTableHeader,
        ExtTableRow,
        ExtText,
    ],
    "text/plain": [ExtDocument],
    "text/markdown": [ExtDocument],
};

export default { modes };
