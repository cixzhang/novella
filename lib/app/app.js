import Vue from 'vue';
import App from './App.vue';
import Page from './Page.vue';
import PageList from './PageList.vue';
import Router from './router';

/* globals data */

var local = window.localStorage;

var store = {
  title: data.title,
  pages: data.pages,
  pageroute: '#/page',
  pagenum: local.getItem('pagenum') || 1,
};

Vue.component('app', App);
Vue.component('page', Page);
Vue.component('page-list', PageList);

Router.config({ mode: 'hash' });
Router.add(/page\/([\d\w]*)/, (page) => {
  if (page === 'last') page = store.pages.length;
  else page = Number(page) || 1;
  store.pagenum = page;
  local.setItem('pagenum', page);
})
.check(window.location.href)
.listen();

var app = new Vue({
  el: '#container',
  data: { store },
});

export default app;
