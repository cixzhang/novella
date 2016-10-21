import vue from 'rollup-plugin-vue';
import json from 'rollup-plugin-json';

export default {
  entry: 'lib/app/App.vue',
  dest: 'example/novella.js',
  format: 'iife',
  indent: '  ',
  moduleName: 'Novella',
  plugins: [vue(), json()],
};
