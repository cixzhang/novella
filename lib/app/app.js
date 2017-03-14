/* globals data */

import Vue from 'vue';
import App from './App.vue';
import Router from './router';
import { restrict } from './helpers';

var total = data.pages.length;
var local = window.localStorage;

var restrictPage = (n) => restrict(n, 1, total);

var saveStore = (store) => {
  var keys = Object.keys(store);

  keys.forEach((key) => {
    local.setItem(key, JSON.stringify(store[key]));
  });
};

var loadStore = (store) => {
  var keys = Object.keys(store);

  keys.forEach((key) => {
    if (JSON.parse(local.getItem(key)) != null) {
      store[key] = JSON.parse(local.getItem(key));
    }
  });
};

var controls = {
  'q': 'page:prev',
  'w': 'page:next',
  '[': 'page:prev',
  ']': 'page:next',
};

var keys = {
  '81': 'q',
  '87': 'w',
  '219': '[',
  '221': ']',
};

var store = {
  title: data.title,
  pages: data.pages,
  pageroute: '#/page',
  pagenum: restrictPage(local.getItem('pagenum')),
  showsidebar: true,
  controls,
};

loadStore(store);

Router.config({ mode: 'hash' });
Router.add(/page\/([\d\w]*)/, (pagenum) => {
  if (pagenum === 'last') pagenum = total;
  pagenum = restrictPage(pagenum);
  store.pagenum = pagenum;
})
.check(window.location.href)
.listen();

document.addEventListener('keydown', (e) => {
  var key = e.key || keys[e.keyCode];
  if (key in controls) {
    var event = new CustomEvent(controls[key]);
    document.dispatchEvent(event);
  }
});

document.addEventListener('page:prev', () => {
  var pagenum = restrictPage(store.pagenum - 1);
  Router.navigate(`${store.pageroute}/${pagenum}`);
  saveStore(store);
});

document.addEventListener('page:next', () => {
  var pagenum = restrictPage(store.pagenum + 1);
  Router.navigate(`${store.pageroute}/${pagenum}`);
  saveStore(store);
});

document.addEventListener('toggle:sidebar', () => {
  store.showsidebar = !store.showsidebar;
  saveStore(store);
});

Vue.component('app', App);
var app = new Vue({
  el: '#container',
  data: { store },
});

export default app;
