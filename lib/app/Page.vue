<template>
  <div class="page">
    <div>
      <page-content :page="page" :thumbs="false">
      </page-content>
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
  };
</script>

<style scoped>
  .page {
    text-align: center;
  }

  .page span {
    font-size: 12px;
    opacity: 0.5;
  }
</style>
