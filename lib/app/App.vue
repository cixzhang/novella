<template>
  <page-list pages="{{ pages }}" select-page="{{ selectPage }}"></page-list>
  <page page="{{ getSelectedPage() }}"></page>
</template>

<style scoped>
</style>

<script>
  import Page from './Page.vue';
  import PageList from './PageList.vue';
  import { pages } from './_propTypes.js';

  export default {
    props: {
      pages,
      selectedPage: {
        type: Number,
        default: 0,
      },
    },
    components: {
      Page,
      PageList,
    },
    methods: {
      selectPage(index) { this.selectedPage = index; },
      getSelectedPage() {
        var index = Math.min(this.selectedPage, this.pages.length - 1);
        return pages[index];
      },
    },
  };
</script>
