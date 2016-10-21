<template>
  <ul>
    <li v-for="n in Math.min(length, 10)">
      <a v-on:click="selectPage" data-index="{{ n }}">
        <img v-if="isImage(pages[n])" src="{{ `${location}/${filename}` }}" />
        <span>{{ n }}</span>
      </a>
    </li>
  </ul>
</template>

<style scoped>
</style>

<script>
  import { isImage } from './_detectFileType';
  import { pages } from './_propTypes.js';

  export default {
    props: {
      pages,
      selectPage: {
        type: Function,
        default: () => {},
      },
    },
    computed: {
      length() { return this.pages.length; },
    },
    methods: {
      isImage(page) { return isImage(page.filename); },
      handleClick(e) { this.selectPage(e.currentTarget.dataset.index); },
    },
  };
</script>
