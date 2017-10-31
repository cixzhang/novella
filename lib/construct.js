var path = require('path');
var markdown = require('./deps.build').markdown;
var files = require('./fileHelpers');
var formats = require('./formats');

function construct({ source, filename, index, output }) {
  var promises = [];
  var filepath = path.resolve(source, filename);
  var fileExt = path.extname(filepath);

  var construction = {
    all: constructGeneral,
    image: constructImage,
    markdown: constructMarkdown,
  };

  Object.keys(formats).forEach(format => {
    if (!formats[format].has(fileExt)) return;
    promises.push(
      construction[format](filepath, { source, filename, index, output })
    );
  });

  return Promise.all(promises)
    .then((results) => Object.assign.apply({}, results));
}

function constructGeneral(filepath, { filename, index, output }) {
  var name = path.basename(filepath, path.extname(filepath));
  var mtime = files.stat(filepath).mtime;
  return { index, name, mtime, src: `${output}/${filename}` };
}

function constructImage(filepath, { filename }) {
  return files.statImage(filepath)
    .then(([width, height]) => (
      { type: 'image', width, height, thumb: `novella/thumbs/${filename}` }
    ));
}

function constructMarkdown(filepath) {
  return files.read(filepath)
    .then(({ contents }) => {
      var short = '...';
      var tree = markdown.parse(contents);
      if (tree.length > 1) {
        short = tree[1][tree[1].length - 1];
      }
      return {
        type: 'markdown',
        contents: markdown.toHTML(contents),
        short,
      };
    });
}

module.exports = construct;
