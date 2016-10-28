<template>
  <div class="gallery">
    <button class="sidebar-toggle" v-on:click="toggleSidebar()">
      {{ store.showsidebar ? '« hide pages' : '» show pages' }}
    </button>
    <header>
      <span>{{ store.title }}</span>
      <span>{{ getPage(store.pagenum).name }}</span>
    </header>
    <article>
      <page :page="getPage(store.pagenum)"></page>
      </article>
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
  background: white;
  box-shadow: 2px 2px 10px 1px rgba(0, 0, 0, 0.1);
  min-height: 100%;
  min-width: 80%;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  flex-direction: column;
}

.gallery .sidebar-toggle {
  position: absolute;
  top: 16px;
  left: 16px;
}

.gallery header {
  position: absolute;
  line-height: 2;
  top: 16px;
  right: 16px;
}

.gallery header span:not(:last-child)::after {
  content: ' ›';
  opacity: 0.5;
}

.gallery article {
  overflow: auto;
}
</style>
