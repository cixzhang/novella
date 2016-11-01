<template>
  <div class="gallery">
    <button class="sidebar-toggle" v-on:click="toggleSidebar()">
      <i v-if="store.showsidebar" class="icon-book-open"></i>
      <i v-else class="icon-book"></i>
    </button>
    <header>
      <span>{{ store.title }}</span>
      <span>{{ getPage(store.pagenum).name }}</span>
      <span>{{ new Date(getPage(store.pagenum).mtime).toLocaleString() }}</span>
    </header>
    <article>
      <page-content :page="getPage(store.pagenum)" :thumbs="false">
      </page-content>
    </article>
    <page-control :store="store"></page-control>
  </div>
</template>

<script>
  import PageContent from './PageContent.vue';
  import PageControl from './PageControl.vue';
  import { store } from './props';

  export default {
    props: { store },
    components: {
      PageContent,
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
  top: 0;
  left: 0;
  font-size: 24px;
  width: 40px;
  border: none;
  background: transparent;
  border-radius: 0 0 5px 0;
  color: white;
  background-color: rgba(65, 182, 196, 0.6);
  padding: 0;
  z-index: 1;
  outline: none;
  transition: all 0.5s ease;
}

.gallery .sidebar-toggle:hover {
  background-color: rgba(65, 182, 196, 1);
}

.gallery header {
  width: 100%;
  position: absolute;
  line-height: 36px;
  font-size: 12px;
  padding: 0 16px 0 48px;
  top: 0;
  left: 0;
  background: white;
  opacity: 0.5;
}

.gallery header span:last-child {
  float: right;
}

.gallery header span:first-child::after {
  content: ' ›';
  opacity: 0.5;
}

.gallery article {
  overflow: auto;
  padding: 36px 16px;
  text-align: center;
}

.gallery article .text {
  text-align: left;
}
</style>
