<template>
  <button class="sidebar-toggle" v-on:click="toggleSidebar()">
    <i v-if="store.showsidebar" class="icon-book-open"></i>
    <i v-else class="icon-book"></i>
  </button>
</template>

<script>
  import { store } from './props';

  export default {
    props: { store },
    methods: {
      toggleSidebar() {
        var event = new CustomEvent('toggle:sidebar');
        document.dispatchEvent(event);
      },
    },
  };
</script>

<style scoped>
.sidebar-toggle {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 24px;
  width: 40px;
  border: none;
  background: transparent;
  opacity: 0.2;
  padding: 0 0 3px 0;
  z-index: 1;
  outline: none;
  transition: all 0.5s ease;
  cursor: pointer;
}

.sidebar-toggle:hover {
  opacity: 1;
}
</style>
