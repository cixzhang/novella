<template>
  <div class="page-control">
    <a class="prev" :href="getRoute(store.pagenum - 1)" :disabled="!canPrev()">
      <span>prev</span>
    </a>
    <a class="next" :href="getRoute(store.pagenum + 1)" :disabled="!canNext()">
      <span>next</span>
    </a>
    <slot></slot>
  </div>
</template>

<script>
  import { store } from './props';

  export default {
    props: { store },
    methods: {
      canPrev() { return this.store.pagenum > 1; },
      canNext() { return this.store.pagenum < this.store.pages.length; },
      getRoute(n) {
        var route = this.store.pageroute;
        if (!route) return null;
        return `${route}/${n}`;
      },
    },
  };
</script>

<style scoped>
.page-control {
  width: 100%;
  position: absolute;
  bottom: 0;
  top: auto;
  padding: 16px;
}

.page-control .prev {
  float: left;
}

.page-control .next {
  float: right;
}
</style>
