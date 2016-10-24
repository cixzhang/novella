<template>
  <div class="sidebar">
    <h1>{{ store.title }}</h1>
    <page-list :store="store" ref="pageList"></page-list>
  </div>
</template>

<script>
  import PageList from './PageList.vue';
  import { store } from './props';

  export default {
    props: { store },
    components: {
      PageList,
    },
  };
</script>

<style scoped>
.sidebar {
  padding: 1em;
  text-align: center;
  max-height: 100%;
  overflow: auto;
  overflow-x: hidden;
  opacity: 1;
  position: relative;
}

.sidebar h1 {
  font-size: 1.2em;
  font-weight: normal;
  margin: 0;
  margin-bottom: 1rem;
}
</style>
