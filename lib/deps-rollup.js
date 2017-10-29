
import markdown from 'markdown';
import naturalCompare from 'natural-compare';
import optionator from 'optionator';
import rollup from 'rollup/dist/rollup.js';
import rollupJson from 'rollup-plugin-json';
import rollupVue from 'rollup-plugin-vue';

export const deps = {
  markdown: markdown.markdown,
  naturalCompare,
  optionator,
  rollup,
  rollupJson,
  rollupVue,
};

