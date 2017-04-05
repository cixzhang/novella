/* globals data */

import { restrict } from './helpers';

var total = data.pages.length;
var local = window.localStorage;

var saveableKeys = ['pagenum', 'showsidebar'];

var store = {
  title: data.title,
  pages: data.pages,
  pagecount: data.pages.length,
  pageroute: '#/page',
  pagenum: restrictPage(local.getItem('pagenum')),
  showsidebar: true,
  controls: {
    'q': 'page:prev',
    'w': 'page:next',
    '[': 'page:prev',
    ']': 'page:next',
  },
  keys: {
    '81': 'q',
    '87': 'w',
    '219': '[',
    '221': ']',
  },
};

export function restrictPage(n) { return restrict(n, 1, total); }

export function saveStore(store) {
  saveableKeys.forEach((key) => {
    local.setItem(key, JSON.stringify(store[key]));
  });
}

export function loadStore(store) {
  saveableKeys.forEach((key) => {
    if (JSON.parse(local.getItem(key)) != null) {
      store[key] = JSON.parse(local.getItem(key));
    }
  });
}

export default store;
