/* globals data */

import Vue from 'vue';
import App from './App.vue';
import Router from './router';
import { restrict } from './helpers';

var total = data.pages.length;
var local = window.localStorage;

var restrictPage = (n) => restrict(n, 1, total);

var controls = {
  'q': 'page:prev',
  'w': 'page:next',
  '[': 'page:prev',
  ']': 'page:next',
};

var store = {
  title: data.title,
  pages: data.pages,
  pageroute: '#/page',
  pagenum: restrictPage(local.getItem('pagenum')),
  showsidebar: true,
  controls,
};

Router.config({ mode: 'hash' });
Router.add(/page\/([\d\w]*)/, (pagenum) => {
  if (pagenum === 'last') pagenum = total;
  pagenum = restrictPage(pagenum);
  store.pagenum = pagenum;
  local.setItem('pagenum', pagenum);
})
.check(window.location.href)
.listen();

document.addEventListener('keypress', (e) => {
  if (e.key in controls) {
    var event = new CustomEvent(controls[e.key]);
    document.dispatchEvent(event);
  }
});

document.addEventListener('page:prev', () => {
  var pagenum = restrictPage(store.pagenum - 1);
  Router.navigate(`${store.pageroute}/${pagenum}`);
});

document.addEventListener('page:next', () => {
  var pagenum = restrictPage(store.pagenum + 1);
  Router.navigate(`${store.pageroute}/${pagenum}`);
});

document.addEventListener('toggle:sidebar', () => {
  store.showsidebar = !store.showsidebar;
});

Vue.component('app', App);
var app = new Vue({
  el: '#container',
  data: { store },
});

export default app;
