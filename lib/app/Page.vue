<template>
  <div class="page">
    <div>
      <img v-if="isImage()" :src="getSource()" />
    </div>
    <span>{{ new Date(page.mtime).toLocaleString() }}</span>
  </div>
</template>

<style scoped>
  .page {
    text-align: center;
  }

  .page span {
    font-size: 0.8em;
    opacity: 0.5;
  }
</style>

<script>
  import { isImage } from './_detectFileType';
  import { page } from './_propTypes.js';

  export default {
    props: { page },
    methods: {
      isImage() { return isImage(this.page.filename); },
      getSource() {
        return `${this.page.location}/${this.page.filename}`;
      },
    },
  };
</script>
