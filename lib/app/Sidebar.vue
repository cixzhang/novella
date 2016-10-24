<template>
  <div class="sidebar" v-on:scroll="updateVisiblePages()">
    <h1>{{ store.title }}</h1>
    <page-list
      :store="store"
      :visible-pages="visiblePages"
      ref="pagelist">
    </page-list>
  </div>
</template>

<script>
  import PageList from './PageList.vue';
  import { store } from './props';
  import { scrollToRange } from './helpers';

  export default {
    props: { store },
    data: () => ({
      visiblePages: [],
    }),
    components: {
      PageList,
    },
    methods: {
      scrollToPage(n) {
        var pagelist = this.$refs.pagelist;
        var pagelistTop = pagelist.$el.getBoundingClientRect().top;
        var pagetop = pagelist.positions[n-1];
        var pagebot = pagelist.positions[n];
        var delta = this.$el.scrollTop + pagelistTop;
        scrollToRange(this.$el, [pagetop + delta, pagebot + delta]);
      },
      updateVisiblePages() {
        var pagelist = this.$refs.pagelist;
        var pagelistTop = pagelist.$el.getBoundingClientRect().top;
        var height = this.$el.getBoundingClientRect().height;

        var top = Math.max(-pagelistTop, 0);
        var bottom = Math.min(height - pagelistTop, pagelist.getTotalHeight());

        var visiblePages = [];
        this.store.pages.forEach((page, n) => {
          var position = pagelist.positions[n];
          var next = pagelist.positions[n+1];
          if (next > top && position < bottom) {
            visiblePages.push(n+1);
          }
        });
        this.visiblePages = visiblePages;
      },
    },
    mounted: function mounted() {
      this.scrollToPage(this.store.pagenum);
      this.updateVisiblePages();
    },
  };
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
