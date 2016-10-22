<template>
  <ul class="page-list">
    <li v-for="n in Math.min(length, 10)">
      <a :href="getRoute(n)" :data-index="n">
        <img v-if="isImage(n)" :src="getSource(n)" />
      </a>
      <span>{{ n }}</span>
    </li>
  </ul>
</template>

<style scoped>
.page-list {
  flex: 2;
  margin: 0;
  padding: 1em;
  text-align: center;
  list-style: none;
  max-height: 100%;
  overflow: auto;
}
.page-list li,
.page-list li img {
  width: 100%;
  height: auto;
}

.page-list li {
  position: relative;
  margin-bottom: 2em;
  box-shadow: 1px 3px 10px 1px rgba(0,0,0,0.05);
}

.page-list li:last-child {
  margin-bottom: 1em;
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

<script>
  import { isImage } from './_detectFileType';
  import { pages } from './_propTypes.js';

  export default {
    props: {
      pages,
      route: String,
    },
    computed: {
      length() { return this.pages.length; },
    },
    methods: {
      isImage(n) {
        var page = this.pages[n-1];
        return isImage(page.filename);
      },
      handleClick(e) {
        this.clickPage(e.currentTarget.dataset.index);
      },
      getSource(n) {
        var page = this.pages[n-1];
        return `${page.location}/${page.filename}`;
      },
      getRoute(pageNum) {
        if (!this.route) return null;
        return `${this.route}/${pageNum}`;
      },
    },
  };
</script>
