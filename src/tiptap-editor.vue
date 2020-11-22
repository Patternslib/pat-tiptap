<template>
  <div class="tiptap-editor">
    <icon-source />
    <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
      <div class="tiptap-menubar">
        <button
          class="tiptap-menubar__button"
          :class="{ 'tiptap-is-active': isActive.bold() }"
          @click="commands.bold"
        >
          <icon name="bold" />
        </button>

        <button
          class="tiptap-menubar__button"
          :class="{ 'tiptap-is-active': isActive.italic() }"
          @click="commands.italic"
        >
          <icon name="italic" />
        </button>

        <button
          class="tiptap-menubar__button"
          :class="{ 'tiptap-is-active': isActive.strike() }"
          @click="commands.strike"
        >
          <icon name="strike" />
        </button>

        <button
          class="tiptap-menubar__button"
          :class="{ 'tiptap-is-active': isActive.underline() }"
          @click="commands.underline"
        >
          <icon name="underline" />
        </button>

        <button
          class="tiptap-menubar__button"
          :class="{ 'tiptap-is-active': isActive.code() }"
          @click="commands.code"
        >
          <icon name="code" />
        </button>

        <button
          class="tiptap-menubar__button"
          :class="{ 'tiptap-is-active': isActive.paragraph() }"
          @click="commands.paragraph"
        >
          <icon name="paragraph" />
        </button>

        <button
          class="tiptap-menubar__button"
          :class="{ 'tiptap-is-active': isActive.heading({ level: 1 }) }"
          @click="commands.heading({ level: 1 })"
        >
          H1
        </button>

        <button
          class="tiptap-menubar__button"
          :class="{ 'tiptap-is-active': isActive.heading({ level: 2 }) }"
          @click="commands.heading({ level: 2 })"
        >
          H2
        </button>

        <button
          class="tiptap-menubar__button"
          :class="{ 'tiptap-is-active': isActive.heading({ level: 3 }) }"
          @click="commands.heading({ level: 3 })"
        >
          H3
        </button>

        <button
          class="tiptap-menubar__button"
          :class="{ 'tiptap-is-active': isActive.bullet_list() }"
          @click="commands.bullet_list"
        >
          <icon name="ul" />
        </button>

        <button
          class="tiptap-menubar__button"
          :class="{ 'tiptap-is-active': isActive.ordered_list() }"
          @click="commands.ordered_list"
        >
          <icon name="ol" />
        </button>

        <button
          class="tiptap-menubar__button"
          :class="{ 'tiptap-is-active': isActive.blockquote() }"
          @click="commands.blockquote"
        >
          <icon name="quote" />
        </button>

        <button
          class="tiptap-menubar__button"
          :class="{ 'tiptap-is-active': isActive.code_block() }"
          @click="commands.code_block"
        >
          <icon name="code" />
        </button>

        <button
          class="tiptap-menubar__button"
          @click="commands.horizontal_rule"
        >
          <icon name="hr" />
        </button>

        <button
          class="tiptap-menubar__button"
          @click="commands.undo"
        >
          <icon name="undo" />
        </button>

        <button
          class="tiptap-menubar__button"
          @click="commands.redo"
        >
          <icon name="redo" />
        </button>
      </div>
    </editor-menu-bar>
    <editor-content class="tiptap-editor__content" :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
} from 'tiptap-extensions';
import Icon from './tiptap-icon.vue';
import IconSource from './tiptap-icon-source.vue';

export default {
  props: ["getText", "setText"],
  components: {
    EditorContent,
    EditorMenuBar,
    Icon,
    IconSource,
  },
  data() {
    return {
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
        ],
        content: this.getText(),
        onUpdate: ({ getHTML }) => { this.setText(getHTML()); }
      }),
    };
  },
  beforeDestroy() {
    this.editor.destroy();
  },
};
</script>

<style lang="css">
  .tiptap-is-active {
    background-color: LightGray;
  }
</style>