import Vue from 'vue';
import App from './App.vue';
import Page from './Page.vue';
import PageList from './PageList.vue';
import Router from './router';
import { restrict } from './helpers';

/* globals data */

var total = data.pages.length;
var local = window.localStorage;

var restrictPage = (n) => restrict(n, 1, total);

var store = {
  title: data.title,
  pages: data.pages,
  pageroute: '#/page',
  pagenum: restrictPage(local.getItem('pagenum')),
};

Vue.component('app', App);
Vue.component('page', Page);
Vue.component('page-list', PageList);

Router.config({ mode: 'hash' });
Router.add(/page\/([\d\w]*)/, (pagenum) => {
  if (pagenum === 'last') pagenum = total;
  pagenum = restrictPage(pagenum);
  store.pagenum = pagenum;
  local.setItem('pagenum', pagenum);
})
.check(window.location.href)
.listen();

document.body.addEventListener('keypress', (e) => {
  var pagenum = store.pagenum;
  if (e.key === '[') pagenum = restrictPage(store.pagenum - 1);
  if (e.key === ']') pagenum = restrictPage(store.pagenum + 1);
  Router.navigate(`${store.pageroute}/${pagenum}`);
});

var app = new Vue({
  el: '#container',
  data: { store },
});

export default app;
