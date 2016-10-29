<template>
  <div class="shortcuts">
    <div class="shortcut" v-for="shortcut in getShortcuts()">
      <span>{{ shortcut }}</span>
      <div class="shortcut-key" v-for="key in getKeys(shortcut)">
        <span>{{ key }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { store } from './props';

  export default {
    props: { controls: store.controls },
    methods: {
      getShortcuts() {
        var shortcuts = new Set(Object.values(this.controls));
        return Array.from(shortcuts);
      },
      getKeys(event) {
        var controlKeys = Object.keys(this.controls);
        return controlKeys.filter(key => this.controls[key] === event);
      },
    },
  };
</script>

<style>
.shortcuts {
  color: #ccc;
  font-size: 10px;
}

.shortcut {
  display: inline-block;
  margin-right: 1em;
  color: #999;
}

.shortcut-key {
  display: inline-block;
  text-transform: uppercase;
  text-align: center;
}

.shortcut-key span {
  display: inline-block;
  line-height: 1.7em;
  height: 1.7em;
  width: 1.7em;
  border: 1px solid #999;
  border-radius: 3px;
  margin-left: 5px;
}

.shortcut-key::after {
  content: '/';
  margin-left: 5px;
}

.shortcut-key:last-of-type::after {
  content: '';
}
</style>
