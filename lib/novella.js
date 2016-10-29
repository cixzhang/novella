/* eslint no-console: 0 */

var path = require('path');
var colors = require('colors');
var optionator = require('optionator');
var files = require('./fileHelpers');
var version = require('../package.json').version;
var formats = require('./formats.json');
var build = require('./build');

var DIR = __dirname;

var optionParser = optionator({
  prepend: 'Usage: novella /path/to/pages [options]',
  append: `Version ${version}`,
  options: [
    {
      option: 'help',
      alias: 'h',
      type: 'Boolean',
      description: 'Displays help.',
    },
    {
      option: 'version',
      alias: 'v',
      type: 'Boolean',
      description: 'Displays version.',
    },
    {
      option: 'output',
      alias: 'o',
      type: 'String',
      description: 'Output path. Defaults to parent of /path/to/pages.',
    },
    {
      option: 'title',
      alias: 't',
      type: 'String',
      description: 'The title of your project.',
    },
  ],
});

var acceptedFormats = new Set(formats.image);

function Novella({ title, pages }) {
  this.title = title;
  this.pages = path.resolve(process.cwd(), pages);
}

Novella.prototype.generate = function({ output }) {
  // TODO: accept output location
  var location = this.pages;
  var outputToPagesRel = path.relative(output, this.pages);

  files.read(location)
  .then((dir) => {
    var pages = dir.contents
      .filter(file => acceptedFormats.has(path.extname(file)))
      .map((filename, index) => {
        return construct(filename, index, location, outputToPagesRel);
      });
    return Promise.all(pages);
  }).then((pages) =>
    build({
      data: { title: this.title, pages },
      app: path.resolve(DIR, 'app/app.js'),
      location: output,
    })
  ).catch((err) => {
    console.log(colors.red('***'));
    console.log(colors.red(err));
    console.log(colors.red('***'));
    process.exit(1);
  });
};

function construct(filename, index, location, output) {
  var filepath = path.resolve(location, filename);
  var name = path.basename(filepath, path.extname(filepath));
  var mtime = files.stat(filepath).mtime;
  var page = { index, name, filename, location: output, mtime };

  return files.statImage(filepath).then(([width, height]) => {
    page.width = width;
    page.height = height;
    return page;
  });
}

function invoke(args) {
  var options = optionParser.parseArgv(args);
  var scriptArgIndex = args.indexOf(__filename);
  var pagesArgIndex = 1;

  if (scriptArgIndex > 0) {
    pagesArgIndex = scriptArgIndex + 1;
  }

  var pagesDir = args[pagesArgIndex];

  if (options.help || !pagesDir) {
    console.log(optionParser.generateHelp());
    return;
  }

  if (options.version) {
    console.log(`v${version}`);
    return;
  }

  var novella = new Novella({
    pages: pagesDir,
    title: options.title || '',
  });

  return novella.generate({
    output: options.output || path.resolve(pagesDir, '..'),
  });
}

if (require.main === module) {
  invoke(process.argv);
} else {
  module.exports = Novella;
}
