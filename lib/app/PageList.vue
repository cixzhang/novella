<template>
  <ul class="page-list">
    <li
      v-for="n in Math.min(length, 10)"
      :data-highlight="isSelected(n)"
      :key="getSource(n)">
      <a :href="getRoute(n)">
        <page-content :src="getSource(n)"></page-content>
        <div class="pagenum">{{ n }}</div>
      </a>
    </li>
  </ul>
</template>

<script>
  import PageContent from './PageContent.vue';
  import { store } from './props';

  export default {
    props: { store },
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
    },
  };
</script>

<style scoped>
.page-list {
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
}

.page-list li {
  width: 100%;
  height: auto;
  position: relative;
  padding: 1em 0;
  text-align: center;
}

.page-list .pagenum {
  font-size: 0.8em;
  opacity: 0.5;
  width: 100%;
}

.page-list .page-content {
  max-width: 100%;
  max-height: 200px;
  box-shadow: 2px 2px 10px 1px rgba(0, 0, 0, 0.1);
}
.page-list li[data-highlight] .page-content {
  border: 1px solid rgba(71, 169, 79, 0.4);
  box-shadow: 2px 2px 10px 1px rgba(71, 169, 79, 0.2);
}
</style>
