
import formats from '../formats.json';

export function isImage(filename) {
  var imageTypes = new Set(formats.image);
  var split = filename.split('.');
  var type = '.' + split[split.length - 1];
  return imageTypes.has(type);
}
