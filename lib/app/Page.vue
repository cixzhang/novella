<template>
  <img v-if="isImage()" src="{{ `${location}/${filename}` }}" />
  <span>{{ mtime.toLocaleString() }}</span>
</template>

<style scoped>
</style>

<script>
  import { isImage } from './_detectFileType';
  import { page } from './_propTypes.js';

  export default {
    props: { page },
    methods: {
      isImage() { return isImage(this.filename); },
    },
  };
</script>
