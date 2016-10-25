<template>
  <div
    class="sidebar"
    v-on:scroll="updateVisiblePages()"
    :style="{ width: width + 'px', padding: padding + 'px' }">
    <slot></slot>
    <page-list
      :store="store"
      :visible-pages="visiblePages"
      :positions="positions"
      :content-style="getListContentStyle()"
      :style="getListStyle()"
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
    computed: {
      positions() {
        var total = 0;
        var positions = this.store.pages.map((page, n) => {
          var top = total;
          total += this.computeHeight(n+1);
          return top;
        });
        positions.push(total);
        return positions;
      },
    },
    data: () => ({
      width: 200,
      maxContentHeight: 200,
      padding: 16,
      visiblePages: [],
    }),
    components: {
      PageList,
    },
    methods: {
      computeHeight(n) {
        var WIDTH = this.width;
        var MAX_CONTENT_HEIGHT = this.maxContentHeight;
        var PAD = this.padding;

        var imageHeight;
        var page = this.store.pages[n-1];
        var ratio = page.height / page.width;

        if (ratio > 1) imageHeight = MAX_CONTENT_HEIGHT;
        else imageHeight = ratio * (WIDTH - PAD * 2);

        return imageHeight + PAD * 3;
      },
      scrollToPage(n) {
        var index = n-1;
        var scrollTop = this.$el.scrollTop;
        var pagelist = this.$refs.pagelist;
        var pagelistTop = pagelist.$el.getBoundingClientRect().top;
        var pagetop = this.positions[index];
        var pagebot = this.positions[index + 1];
        scrollToRange(this.$el, [scrollTop + pagetop + pagelistTop, scrollTop + pagebot + pagelistTop]);
      },
      updateVisiblePages() {
        var pagelist = this.$refs.pagelist;
        var pagelistTop = pagelist.$el.getBoundingClientRect().top;
        var height = this.$el.getBoundingClientRect().height;

        var top = Math.max(-pagelistTop, 0);
        var bottom = Math.min(height - pagelistTop, this.getTotalHeight());

        var visiblePages = [];
        this.store.pages.forEach((page, index) => {
          var position = this.positions[index];
          var next = this.positions[index + 1];
          if (next > top && position < bottom) {
            visiblePages.push(index+1);
          }
        });
        this.visiblePages = visiblePages;
      },
      getTotalHeight() {
        return this.positions[this.positions.length - 1];
      },
      getListStyle() {
        return { height: this.getTotalHeight() + 'px' };
      },
      getListContentStyle() {
        return { 'max-height': this.maxContentHeight + 'px' };
      },
    },
    mounted: function mounted() {
      this.boundUpdateVisiblePages = () => this.updateVisiblePages();
      this.scrollToPage(this.store.pagenum);
      this.updateVisiblePages();
      window.addEventListener('resize', this.boundUpdateVisiblePages);
    },
    beforeDestroy: function beforeDestroy() {
      window.removeEventListener('resize', this.boundUpdateVisiblePages);
    },
    watch: {
      store: {
        handler: function store() { this.scrollToPage(this.store.pagenum); },
        deep: true,
      },
    },
  };
</script>

<style scoped>
.sidebar {
  text-align: center;
  max-height: 100%;
  overflow: auto;
  overflow-x: hidden;
  opacity: 1;
  position: relative;
}
</style>
