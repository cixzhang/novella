export var page = {
  index: Number,
  name: String,
  mtime: Date,
  type: String,
  src: String,

  // Images
  thumb: String,
  width: Number,
  height: Number,

  // Markdown
  contents: String,
};

export var pages = Array;

export var store = {
  title: String,
  pages,
  pageroute: String,
  pagenum: Number,
  sidebar: Boolean,
  controls: Object,
};
