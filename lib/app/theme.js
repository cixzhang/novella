
function initialize(theme) {
  var stylesheet = document.styleSheets[document.styleSheets.length - 1];
  stylesheet.insertRule(composeRule(
    '.novella-bg',
    'background-color', theme.background));
  stylesheet.insertRule(composeRule(
    '.novella-hc-border',
    'border-color', theme.highlight));
  stylesheet.insertRule(composeRule(
    '.novella-tc',
    'color', theme.text));
  stylesheet.insertRule(composeRule(
    '*', 'color', theme.text));
}

function composeRule(iden, attr, color) {
  return iden + ' { ' + attr + ':' + color + '; }';
}

export default {
  initialize,
};

