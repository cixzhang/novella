<template>
  <div class="page">
    <slot name="header">
      <sidebar-toggle :store="store"></sidebar-toggle>
      <page-header :store="store"></page-header>
    </slot>
    <article>
      <page-content :page="getPage(store.pagenum)" :thumbs="false">
      </page-content>
      <slot></slot>
    </article>
    <slot name="footer">
      <page-control :store="store">
        <shortcuts :store="store"></shortcuts>
      </page-control>
    </slot>
  </div>
</template>

<script>
  import PageHeader from './PageHeader.vue';
  import PageContent from './PageContent.vue';
  import PageControl from './PageControl.vue';
  import SidebarToggle from './SidebarToggle.vue';
  import Shortcuts from './Shortcuts.vue';
  import { store } from './props';

  export default {
    props: { store },
    components: {
      PageHeader,
      PageContent,
      PageControl,
      SidebarToggle,
      Shortcuts,
    },
    methods: {
      getPage(n) {
        return this.store.pages[n - 1];
      },
    },
  };
</script>

<style scoped>
.page {
  background: white;
  box-shadow: 2px 2px 10px 1px rgba(0, 0, 0, 0.1);
  min-height: 100%;
  min-width: 80%;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  flex-direction: column;
}

.page article {
  overflow: auto;
  padding: 36px 16px 72px;
}

.page .shortcuts {
  clear: both;
}
</style>
