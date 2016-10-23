<template>
  <ul class="page-list">
    <li v-for="n in Math.min(length, 10)" :data-selected="isSelected(n)">
      <a :href="getRoute(n)">
        <img v-if="isImage(n)" :src="getSource(n)" />
        <span>{{ n }}</span>
      </a>
    </li>
  </ul>
</template>

<script>
  import { isImage } from './files';
  import { store } from './props';

  export default {
    props: { store },
    computed: {
      length() { return this.store.pages.length; },
    },
    methods: {
      isImage(n) {
        var page = this.store.pages[n-1];
        return isImage(page.filename);
      },
      isSelected(n) {
        console.log(n, this.store.pagenum);
        return n === this.store.pagenum;
      },
      handleClick(e) {
        this.clickPage(e.currentTarget.dataset.index);
      },
      getSource(n) {
        var page = this.store.pages[n-1];
        return `${page.location}/${page.filename}`;
      },
      getRoute(pageNum) {
        var route = this.store.pageroute;
        if (!route) return null;
        return `${route}/${pageNum}`;
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
  margin-bottom: 2em;
}

.page-list li:last-child {
  margin-bottom: 1em;
}

.page-list li[data-selected] img {
  border: 1px solid rgba(71, 169, 79, 0.4);
  box-shadow: 2px 2px 10px 1px rgba(71, 169, 79, 0.2);
}

.page-list li img {
  width: 100%;
  height: auto;
  box-shadow: 2px 2px 10px 1px rgba(0, 0, 0, 0.1);
}

.page-list li span {
  position: absolute;
  bottom: -1.5em;
  left: 0;
  font-size: 0.8em;
  opacity: 0.5;
  width: 100%;
  text-align: center;
}
</style>
