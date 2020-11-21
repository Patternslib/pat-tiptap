<template>
  <div class="tiptap-icon" :class="[`tiptap-icon--${name}`, `tiptap-icon--${size}`, { 'has-align-fix': fixAlign }]">
    <svg class="tiptap-icon__svg">
      <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#tiptap-icon--' + name"></use>
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    name: {},
    size: {
      default: 'normal',
    },
    modifier: {
      default: null,
    },
    fixAlign: {
      default: true,
    },
  },
};
</script>

<style lang="css">
.tiptap-icon {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 0.8rem;
  height: 0.8rem;
  margin: 0 .3rem;
  top: -.05rem;
  fill: currentColor;
}

.tiptap-icon__svg {
    display: inline-block;
    vertical-align: top;
    width: 100%;
    height: 100%;
}

.tiptap-icon:first-child {
  margin-left: 0;
}

.tiptap-icon:last-child {
  margin-right: 0;
}

// svg sprite
.tiptap-icons svg path,
.tiptap-icons svg rect,
.tiptap-icons svg circle,
.tiptap-icons svg g,
.tiptap-icon svg path,
.tiptap-icon svg rect,
.tiptap-icon svg circle,
.tiptap-icon svg g {
    fill: currentColor;
    stroke: none;
}
</style>
