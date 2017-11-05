<template>
  <div class="shortcuts">
    <div class="shortcut" v-for="shortcut in getShortcuts()">
      <span>{{ shortcut }}</span>
      <div class="shortcut-key" v-for="key in getKeys(shortcut)">
        <span class="novella-tc-bg">{{ key }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { store } from './props';

  export default {
    props: { store },
    methods: {
      getShortcuts() {
        var shortcuts = new Set(Object.values(this.store.controls));
        return Array.from(shortcuts);
      },
      getKeys(event) {
        var controlKeys = Object.keys(this.store.controls);
        return controlKeys.filter(key => this.store.controls[key] === event);
      },
    },
  };
</script>

<style>
.shortcuts {
  font-size: 10px;
}

.shortcuts .shortcut {
  display: inline-block;
  margin-right: 1em;
  opacity: 0.25;
}

.shortcuts .shortcut-key {
  display: inline-block;
  text-transform: uppercase;
  text-align: center;
}

.shortcuts .shortcut-key span {
  display: inline-block;
  line-height: 1.7em;
  height: 1.7em;
  width: 1.7em;
  border-radius: 3px;
  margin-left: 5px;
}

.shortcuts .shortcut-key::after {
  content: '/';
  margin-left: 5px;
}

.shortcuts .shortcut-key:last-of-type::after {
  content: '';
}
</style>
