var formats = require('./formats.json');

var allFormats = new Set(
  Object.keys(formats)
    .reduce((list, key) => list.concat(formats[key]), [])
);

module.exports = {
  image: new Set(formats.image),
  markdown: new Set(formats.markdown),
  all: allFormats,
};
