#!/usr/bin/env node
/* eslint no-console: 0 */

var path = require('path');
var optionator = require('optionator');
var files = require('./fileHelpers');
var version = require('../package.json').version;
var formats = require('./formats');
var construct = require('./construct');
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

function Novella({ title, pages }) {
  this.title = title;
  this.pages = path.resolve(process.cwd(), pages);
}

Novella.prototype.generate = function({ output }) {
  var source = this.pages;
  var outputToPagesRel = path.relative(output, this.pages);

  files.read(source)
  .then((dir) => {
    var pages = dir.contents
      .filter(file => formats.all.has(path.extname(file)))
      .map((filename, index) => {
        console.log(filename);
        return construct({
          source,
          filename,
          index,
          output: outputToPagesRel,
        });
      });
    return Promise.all(pages);
  }).then((pages) => {
    return build({
      source,
      data: { title: this.title, pages },
      app: path.resolve(DIR, 'app/app.js'),
      output,
    });
  }).catch((err) => {
    console.log('\u001b[31m', '***', '\u001b[39m');
    console.log('\u001b[31m',   err, '\u001b[39m');
    console.log('\u001b[31m', '***', '\u001b[39m');
    process.exit(1);
  });
};

function invoke(args) {
  var options = optionParser.parseArgv(args);
  var scriptArgIndex = args.indexOf(__filename);
  var pagesArgIndex = 2;

  if (scriptArgIndex > 1) {
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
