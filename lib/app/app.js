import Vue from 'vue';
import App from './App.vue';
import Router from './router';
import theme from './theme';
import store, { saveStore, loadStore, restrictPage } from './store';

loadStore(store);

Router.config({ mode: 'hash' });
Router.add(/page\/([\d\w]*)/, (pagenum) => {
  if (pagenum === 'last') pagenum = store.pagecount;
  pagenum = restrictPage(pagenum);
  store.pagenum = pagenum;
  saveStore(store);
})
.check(window.location.href)
.listen();

document.addEventListener('keydown', (e) => {
  e.preventDefault();
  var controls = store.controls;
  var key = e.key || store.keys[e.keyCode];
  if (key in controls) {
    var event = new CustomEvent(controls[key]);
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
  saveStore(store);
});

theme.initialize(store.theme);

Vue.component('app', App);
var app = new Vue({
  el: '#container',
  data: { store },
});

export default app;
