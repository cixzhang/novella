<template>
  <div class="page-content">
    <img :src="src" v-if="isImage()" v-on:load="onLoad()" :data-hidden="hidden"/>
  </div>
</template>

<script>
  import { isImage } from './files';
  export default {
    props: { src: String },
    data: () => ({ hidden: true }),
    methods: {
      isImage() { return isImage(this.src); },
      onLoad() { this.hidden = false; },
    },
  };
</script>

<style scoped>
  .page-content {
    font-size: 0;
  }

  .page-content img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
  }
  .page-content img {
    opacity: 1;
    transition: opacity 0.2s ease;
  }
  .page-content img[data-hidden] {
    opacity: 0;
  }
</style>
