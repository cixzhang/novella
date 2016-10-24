<template>
  <div class="sidebar">
    <h1>{{ store.title }}</h1>
    <page-list :store="store" ref="pageList"></page-list>
  </div>
</template>

<script>
  import PageList from './PageList.vue';
  import { store } from './props';
  import { scrollToElement } from './helpers';

  export default {
    props: { store },
    components: {
      PageList,
    },
    methods: {
      scrollToPage(n) {
        var list = this.$el.querySelectorAll('li');
        if (!list[n-1]) return;
        scrollToElement(this.$el, list[n-1]);
      },
    },
    mounted: function mounted() {
      this.scrollToPage(this.store.pagenum);
    },
    updated: function updated() {
      this.scrollToPage(this.store.pagenum);
    },
  };
/*
Lazy rendering notes:

- sidebar: get current scroll position
  adjust for top position of pagelist:

  this.$el.getBoundingClientRect().top - this.$refs.pagelist.$el.getBoundingClientRect().top;

- sidebar: compute which indices should be renderd
- sidebar->pagelist: pass indices to render
- pagelist: render the list, provide a height equal to total height
  can estimate? max-height for image is 200px, get average aspect ratio
  1:1 -> width of pagelist (200 - pad * 2)
  1:2 -> 200px
  1:0.5 -> width * 0.5


  imageHeight = 200 (when height > width, else...)
  imageHeight = (height / width) * (pagelistWidth)

  itemHeight = imageHeight + 3 * pad
  totalHeight = sum(itemHeight);

- pagelist: render the provided indices, position them where expected.

*/
</script>

<style scoped>
.sidebar {
  padding: 16px;
  text-align: center;
  max-height: 100%;
  overflow: auto;
  overflow-x: hidden;
  opacity: 1;
  position: relative;
}

.sidebar h1 {
  font-size: 19px;
  font-weight: normal;
  margin: 0;
  margin-bottom: 16px;
}
</style>
