<template>
  <div class="page">
    <div>
      <img v-if="isImage()" :src="getSource()" />
    </div>
    <span>{{ new Date(page.mtime).toLocaleString() }}</span>
  </div>
</template>

<script>
  import { isImage } from './files';
  import { page } from './props';

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

<style scoped>
  .page {
    text-align: center;
  }

  .page span {
    font-size: 0.8em;
    opacity: 0.5;
  }
</style>
