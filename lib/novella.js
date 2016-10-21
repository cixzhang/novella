/* eslint no-console: 0 */

var fs = require('fs');
var path = require('path');
var colors = require('colors');
var optionator = require('optionator');
var files = require('./fileHelpers');
var version = require('../package.json').version;
var formats = require('./formats.json');

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
  ],
});

var acceptedFormats = new Set(formats.image);

function Novella(pages) {
  this.pages = path.resolve(process.cwd(), pages);
}

Novella.prototype.generate = function() {
  // TODO: accept output location
  var location = this.pages;

  files.read(location)
  .then((dir) => {
    return dir.contents
      .filter(file => acceptedFormats.has(path.extname(file)))
      .map((filename, index) => {
        var filepath = path.resolve(location, filename);
        var mtime = fs.lstatSync(filepath).mtime;
        return { index, filename, location, mtime };
      });
  }).then((stuff) => {
    // TODO: use this data to generate static site
    console.log(stuff);
  }).catch((err) => {
    console.log(colors.red(err));
    process.exit(1);
  });
};

function invoke(args) {
  var options = optionParser.parseArgv(args);
  var pagesArgIndex = 1;
  var scriptArgIndex = args.indexOf(__filename);

  if (scriptArgIndex > 0) {
    pagesArgIndex = scriptArgIndex + 1;
  }

  if (options.help) {
    console.log(optionParser.generateHelp());
    return;
  }

  if (options.version) {
    console.log(`v${version}`);
    return;
  }

  var novella = new Novella(args[pagesArgIndex], false);
  return novella.generate(options.output);
}

if (require.main === module) {
  invoke(process.argv);
} else {
  module.exports = Novella;
}
