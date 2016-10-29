<template>
  <div class="page-control">
    <a class="prev" :href="getRoute(store.pagenum - 1)" :disabled="!canPrev()">
      <span>prev</span>
    </a>
    <a class="next" :href="getRoute(store.pagenum + 1)" :disabled="!canNext()">
      <span>next</span>
    </a>
    <Shortcuts :controls="store.controls"></Shortcuts>
  </div>
</template>

<script>
  import Shortcuts from './Shortcuts.vue';
  import { store } from './props';

  export default {
    props: { store },
    components: {
      Shortcuts,
    },
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
  position: absolute;
  bottom: 0;
  top: auto;
  left: 16px;
  right: 16px;
  bottom: 16px;
}

.page-control .prev {
  float: left;
}

.page-control .next {
  float: right;
}

.page-control .shortcuts {
  clear: both;
}
</style>
