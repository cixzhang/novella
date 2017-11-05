
var tinycolor = require('./deps.build').tinycolor;
var defaults = {
  background: 'rgb(255, 255, 255)',
  highlight: 'rgb(65, 182, 196)',
  text: 'rgb(0, 0, 0)',
}

function constructTheme(_theme) {
  var theme = {};
  var themeKeys = Object.keys(defaults);
  themeKeys.forEach(function assignThemeKey(key) {
    var _color = tinycolor(_theme[key]);
    var color = tinycolor(defaults[key]);

    if (_color.isValid()) color = _color;
    theme[key] = color.toRgbString();
  });

  // Derived colors
  theme.highlight_60 = tinycolor(theme.highlight).setAlpha(0.6).toRgbString();
  theme.highlight_20 = tinycolor(theme.highlight).setAlpha(0.2).toRgbString();

  theme.text_10 = tinycolor(theme.text).setAlpha(0.1).toRgbString();
  theme.text_20 = tinycolor(theme.text).setAlpha(0.2).toRgbString();
  return theme;
}

module.exports = { defaults, constructTheme };

