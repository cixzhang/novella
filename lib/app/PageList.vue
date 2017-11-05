<template>
  <ul class="page-list">
    <li
      v-for="n in visiblePages"
      :data-highlight="isSelected(n)"
      :key="getKey(n)"
      :style="{ top: getPosition(n) + 'px' }">
      <a :href="getRoute(n)">
        <page-content
          :page="getPage(n)"
          :thumbs="true">
        </page-content>
        <div class="pagenum">{{ n }}</div>
      </a>
    </li>
  </ul>
</template>

<script>
  import PageContent from './PageContent.vue';
  import { store } from './props';

  export default {
    props: {
      store,
      positions: Array,
      visiblePages: Array,
    },
    computed: {
      length() { return this.store.pages.length; },
    },
    components: { PageContent },
    methods: {
      isSelected(n) {
        return n === this.store.pagenum;
      },
      handleClick(e) {
        this.clickPage(e.currentTarget.dataset.index);
      },
      getPage(n) {
        return this.store.pages[n-1];
      },
      getKey(n) {
        var page = this.getPage(n);
        return page.index;
      },
      getRoute(n) {
        var route = this.store.pageroute;
        if (!route) return null;
        return `${route}/${n}`;
      },
      getPosition(n) {
        return this.positions[n-1];
      },
    },
  };
</script>

<style scoped>
.page-list {
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
}

.page-list li {
  width: 100%;
  height: auto;
  padding: 16px 0;
  text-align: center;
  position: absolute;
}

.page-list .pagenum {
  font-size: 12px;
  line-height: 16px;
  opacity: 0.5;
  width: 100%;
}

.page-list .page-content {
  max-height: 100%;
}
.page-list li[data-highlight] .page-content {
  border-width: 1px;
  border-style: solid;
}
</style>
