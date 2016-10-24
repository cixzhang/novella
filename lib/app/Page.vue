<template>
  <div class="page">
    <div>
      <page-content :src="getSource()"></page-content>
    </div>
    <span>{{ new Date(page.mtime).toLocaleString() }}</span>
  </div>
</template>

<script>
  import PageContent from './PageContent.vue';
  import { page } from './props';

  export default {
    props: { page },
    components: { PageContent },
    methods: {
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
