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
  border-radius: 0 0 5px 0;
  color: white;
  background-color: rgba(65, 182, 196, 0.6);
  padding: 0 0 3px 0;
  z-index: 1;
  outline: none;
  transition: all 0.5s ease;
}

.sidebar-toggle:hover {
  background-color: rgba(65, 182, 196, 1);
}
</style>
