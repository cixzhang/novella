<template>
  <div class="page-control">
    <a class="prev" :href="getRoute(store.pagenum - 1)" :disabled="!canPrev()">
      prev ([ q)
    </a>
    <a class="next" :href="getRoute(store.pagenum + 1)" :disabled="!canNext()">
      (] w) next
    </a>
  </div>
</template>

<script>
  import Page from './Page.vue';
  import PageList from './PageList.vue';
  import { store } from './props';

  export default {
    props: { store },
    data: () => ({
      animateSidebar: null,
      hideSidebar: false,
    }),
    components: {
      Page,
      PageList,
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
  left: 0;
  right: 0;
  margin: 1em;
}

.prev, .next {
  text-decoration: none;
}

.prev[disabled],
.next[disabled] {
  pointer-events: none;
  opacity: 0.2;
  color: black;
}

.prev {
  float: left;
}

.next {
  float: right;
}
</style>
