Novella
=======

A static site generator for web comics.

Installing
----------

Requires Node 6.9 (due to lwip)

```
npm install cixzhang/novella
```

Usage
-----

Novella expects your pages to be kept in a directory. Pass this directory as the
first argument to the CLI.

```
Usage: novella /path/to/pages [options]

  -h, --help                       Displays help.
  -v, --version                    Displays version.
  -o, --output String              Output path. Defaults to parent of /path/to/pages.
  -t, --title String               The title of your project.
  --background-color, --bg String  Background color.
  --highlight-color, --hc String   Highlight color.
  --text-color, --tc String        Text color.
  --detect-theme, --dt String      Pass in the filename of a page to detect the theme.
```

Example
-------

You can run the example in this repo:

```
npm run build-example
```

This invokes novella on the pages in the example folder.

