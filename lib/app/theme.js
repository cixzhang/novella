
function initialize(_theme) {
  var theme = cleanTheme(_theme);
  var stylesheet = document.styleSheets[document.styleSheets.length - 1];
  stylesheet.insertRule(composeRule(
    '.novella-bg',
    'background-color', theme.background), 0);
  stylesheet.insertRule(composeRule(
    '.novella-hc-border',
    'border-color', theme.highlight), 0);
  stylesheet.insertRule(composeRule(
    '.novella-tc',
    'color', theme.text), 0);
  stylesheet.insertRule(composeRule(
    '*', 'color', theme.text), 0);
}

function cleanTheme(_theme) {
  var defaults = {
    background: '#ffffff', // white
    highlight: 'rgb(65, 182, 196)', // bright blue
    text: '#000000', // black
  };

  var theme = Object.assign({}, defaults);
  var themeKeys = Object.keys(defaults);
  themeKeys.forEach(function assignThemeKey(key) {
    theme[key] = _theme[key] || theme[key];
  });
  return theme;
}

function composeRule(iden, attr, color) {
  return iden + ' { ' + attr + ':' + color + '; }';
}

export default {
  initialize,
};

