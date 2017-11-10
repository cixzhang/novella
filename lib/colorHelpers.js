
var tinycolor = require('./deps.build').tinycolor;
var getColors = require('./deps.build').getColors;

var defaults = {
  background: 'rgb(255, 255, 255)',
  highlight: 'rgb(65, 182, 196)',
  text: 'rgb(0, 0, 0)',
}

function getValidColor(color1, color2) {
  if (tinycolor(color1).isValid()) return color1;
  if (tinycolor(color2).isValid()) return color2;
  return null;
}

function assignTheme(initial, override) {
  var theme = {};
  var themeKeys = Object.keys(initial);
  themeKeys.forEach(function assignThemeKey(key) {
    theme[key] = getValidColor(override[key], initial[key]);
  });
  return theme;
}

function constructTheme(_theme) {
  var theme = assignTheme(defaults, _theme);

  // Derived colors
  theme.highlight_60 = tinycolor(theme.highlight).setAlpha(0.6).toRgbString();
  theme.highlight_20 = tinycolor(theme.highlight).setAlpha(0.2).toRgbString();

  theme.text_10 = tinycolor(theme.text).setAlpha(0.1).toRgbString();
  theme.text_20 = tinycolor(theme.text).setAlpha(0.2).toRgbString();
  return theme;
}

function detectTheme(file, overrides) {
  var theme = {};
  return getColors(file)
    .then((colors) => {
      var opaque = colors
        .filter(c => (c.alpha() === 1))
        .map(c => c.hex());
      if (opaque.length) {
        theme.background = getValidColor(overrides.background, opaque[0]);
        theme.text = getValidColor(
          overrides.text,
          tinycolor.mostReadable(
            theme.background,
            opaque,
            { includeFallbackColors: true }
          ).toHexString());
        theme.highlight = getValidColor(overrides.highlight, null);

        while (opaque.length && !theme.highlight) {
          color = opaque.shift();
          var readable = tinycolor.isReadable(
            theme.background,
            color,
            { level: 'AA', size: 'large' })
          if (readable && color !== theme.text) {
            theme.highlight = color;
          }
        }
      }
    })
    .catch((err) => { console.log(err); })
    .then(() => theme);
}

module.exports = {
  defaults,
  assignTheme,
  constructTheme,
  detectTheme
};

