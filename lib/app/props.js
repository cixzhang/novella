export var page = {
  validator: (prop) => {
    var isValid = (type) => (
      Object.keys(type).every(key => {
        return key in prop && type[key](prop[key]);
      })
    );

    var types = {
      all: {
        index: v => typeof v === 'number',
        name: v => typeof v === 'string',
        mtime: v => !Number.isNaN(new Date(v).getTime()),
        type: v => typeof v === 'string',
        src: v => typeof v === 'string',
      },
      image: {
        thumb: v => typeof v === 'string',
        width: v => typeof v === 'number',
        height: v => typeof v === 'number',
      },
      markdown: {
        contents: v => typeof v === 'string',
        short: v => typeof v === 'string',
      },
    };

    return isValid(types.all) && isValid(types[prop.type]);
  },
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
