<template>
  <ul class="page-list">
    <li v-for="n in Math.min(length, 10)">
      <a :href="getRoute(n)" :data-index="n">
        <img v-if="isImage(n)" :src="getSource(n)" />
        <span>{{ n }}</span>
      </a>
    </li>
  </ul>
</template>

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

.page-list li img {
  width: 100%;
  height: auto;
  box-shadow: 1px 3px 10px 1px rgba(0,0,0,0.05);
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
