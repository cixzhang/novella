import Vue from 'vue';
import App from './App.vue';
import Page from './Page.vue';
import PageList from './PageList.vue';
import Router from './router';

/* globals data */

var store = {
  title: data.title,
  pages: data.pages,
  pageRoute: '#/page',
  selectedPage: 1,
};

Vue.component('app', App);
Vue.component('page', Page);
Vue.component('page-list', PageList);

Router.config({ mode: 'hash' });
Router.add(/page\/(\d*)/, (page) => {
  store.selectedPage = Number(page);
})
.check(window.location.href)
.listen();

var app = new Vue({
  el: '#container',
  data: store,
});

export default app;
