
import formats from '../formats.json';

function checkFormat(filename, formats) {
  var types = new Set(formats);
  var split = filename.split('.');
  var type = '.' + split[split.length - 1];
  return types.has(type);
}

export function isImage(filename) {
  return checkFormat(filename, formats.image);
}

export function isMarkdown(filename) {
  return checkFormat(filename, formats.markdown);
}
