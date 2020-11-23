<template>
  <div class="tiptap-editor">
    <icon-source />
    <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
      <div class="tiptap-menubar">
        <button
          class="tiptap-menubar__button"
          :class="{ 'tiptap-is-active': isActive.bold() }"
          @click.prevent="commands.bold"
        >
          <icon name="bold" />
        </button>

        <button
          class="tiptap-menubar__button"
          :class="{ 'tiptap-is-active': isActive.italic() }"
          @click.prevent="commands.italic"
        >
          <icon name="italic" />
        </button>

        <button
          class="tiptap-menubar__button"
          :class="{ 'tiptap-is-active': isActive.strike() }"
          @click.prevent="commands.strike"
        >
          <icon name="strike" />
        </button>

        <button
          class="tiptap-menubar__button"
          :class="{ 'tiptap-is-active': isActive.underline() }"
          @click.prevent="commands.underline"
        >
          <icon name="underline" />
        </button>

        <button
          class="tiptap-menubar__button"
          :class="{ 'tiptap-is-active': isActive.code() }"
          @click.prevent="commands.code"
        >
          <icon name="code" />
        </button>

        <button
          class="tiptap-menubar__button"
          :class="{ 'tiptap-is-active': isActive.paragraph() }"
          @click.prevent="commands.paragraph"
        >
          <icon name="paragraph" />
        </button>

        <button
          class="tiptap-menubar__button"
          :class="{ 'tiptap-is-active': isActive.heading({ level: 1 }) }"
          @click.prevent="commands.heading({ level: 1 })"
        >
          H1
        </button>

        <button
          class="tiptap-menubar__button"
          :class="{ 'tiptap-is-active': isActive.heading({ level: 2 }) }"
          @click.prevent="commands.heading({ level: 2 })"
        >
          H2
        </button>

        <button
          class="tiptap-menubar__button"
          :class="{ 'tiptap-is-active': isActive.heading({ level: 3 }) }"
          @click.prevent="commands.heading({ level: 3 })"
        >
          H3
        </button>

        <button
          class="tiptap-menubar__button"
          :class="{ 'tiptap-is-active': isActive.bullet_list() }"
          @click.prevent="commands.bullet_list"
        >
          <icon name="ul" />
        </button>

        <button
          class="tiptap-menubar__button"
          :class="{ 'tiptap-is-active': isActive.ordered_list() }"
          @click.prevent="commands.ordered_list"
        >
          <icon name="ol" />
        </button>

        <button
          class="tiptap-menubar__button"
          :class="{ 'tiptap-is-active': isActive.blockquote() }"
          @click.prevent="commands.blockquote"
        >
          <icon name="quote" />
        </button>

        <button
          class="tiptap-menubar__button"
          :class="{ 'tiptap-is-active': isActive.code_block() }"
          @click.prevent="commands.code_block"
        >
          <icon name="code" />
        </button>

        <button
          class="tiptap-menubar__button"
          @click.prevent="commands.horizontal_rule"
        >
          <icon name="hr" />
        </button>

        <button
          class="tiptap-menubar__button"
          @click.prevent="commands.undo"
        >
          <icon name="undo" />
        </button>

        <button
          class="tiptap-menubar__button"
          @click.prevent="commands.redo"
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
  props: ["getText", "setText", "options"],
  components: {
    EditorContent,
    EditorMenuBar,
    Icon,
    IconSource,
  },
  asyncComputed: {
      async editor() {
        const tiptap_options = {
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
        };
        if (
          this.options.collaboration.server &&
          this.options.collaboration.document
        ) {
          // Syncing text remotely
          let rt_ext = await import("./tiptap-yjs");
          rt_ext = rt_ext.default;
          tiptap_options.extensions.push(
            new rt_ext(
              this.options.collaboration.server,
              this.options.collaboration.document
            )
          );
        } else {
          // Syncing text with <textarea>
          tiptap_options.content = this.getText();
          tiptap_options.onUpdate = ({ getHTML }) => { this.setText(getHTML()); }
        }
        return new Editor(tiptap_options);
    },
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
