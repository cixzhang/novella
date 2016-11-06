<template>
  <div class="page-header">
    <span>{{ store.title }}</span>
    <span class="sub"> › </span>
    <span>{{ getPage(store.pagenum).name }}</span>
    <span class="right">{{ new Date(getPage(store.pagenum).mtime).toLocaleString() }}</span>
  </div>
</template>

<script>
  import { store } from './props';

  export default {
    props: { store },
    methods: {
      getPage(n) {
        return this.store.pages[n - 1];
      },
    },
  };
</script>

<style scoped>
.page-header {
  width: 100%;
  position: absolute;
  line-height: 36px;
  font-size: 12px;
  padding: 0 16px 0 48px;
  top: 0;
  left: 0;
  background: white;
  opacity: 0.5;
}

.page-header .right {
  float: right;
}

.page-header .sub {
  opacity: 0.5;
}
</style>
