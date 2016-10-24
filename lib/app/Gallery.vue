<template>
  <div class="gallery">
    <button class="sidebar-toggle" v-on:click="toggleSidebar()">
      {{ store.showsidebar ? 'hide menu' : 'show menu' }}
    </button>
    <page :page="getPage(store.pagenum)"></page>

    <page-control :store="store"></page-control>
  </div>
</template>

<script>
  import Page from './Page.vue';
  import PageControl from './PageControl.vue';
  import { store } from './props';

  export default {
    props: { store },
    components: {
      Page,
      PageControl,
    },
    methods: {
      getPage(n) {
        return this.store.pages[n - 1];
      },
      toggleSidebar() {
        var event = new CustomEvent('toggle:sidebar');
        document.dispatchEvent(event);
      },
    },
  };
</script>

<style scoped>
.gallery {
  padding: 16px;
  background: white;
  box-shadow: 2px 2px 10px 1px rgba(0, 0, 0, 0.1);
  overflow: auto;
  max-height: 100%;
  min-width: 80%;
  transition: all 0.2s ease;
  position: relative;
}
</style>
