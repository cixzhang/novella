<template>
  <ul class="page-list">
    <li
      v-for="n in visiblePages"
      :data-highlight="isSelected(n)"
      :key="getSource(n)"
      :style="{ top: getPosition(n) + 'px' }">
      <a :href="getRoute(n)">
        <page-content
          :src="getSource(n)" 
          :style="contentStyle">
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
      contentStyle: Object,
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
      getSource(n) {
        var page = this.store.pages[n-1];
        return `${page.location}/${page.filename}`;
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
  max-width: 100%;
  box-shadow: 2px 2px 10px 1px rgba(0, 0, 0, 0.1);
}
.page-list li[data-highlight] .page-content {
  border: 1px solid rgba(71, 169, 79, 0.4);
  box-shadow: 2px 2px 10px 1px rgba(71, 169, 79, 0.2);
}
</style>
