
var boxShadow = '2px 2px 10px 1px';
function initialize(theme) {
  var stylesheet = document.styleSheets[document.styleSheets.length - 1];
  stylesheet.insertRule(composeRule(
    '.novella-bg',
    'background-color', theme.background), 0);
  stylesheet.insertRule(composeRule(
    '[data-highlight] .novella-box',
    'border-color', theme.highlight_60), 0);
  stylesheet.insertRule(composeRule(
    '[data-highlight] .novella-box',
    'box-shadow', boxShadow + ' ' + theme.highlight_20), 0);
  stylesheet.insertRule(composeRule(
    '.novella-tc',
    'color', theme.text), 0);
  stylesheet.insertRule(composeRule(
    '.novella-tc-bg',
    'background-color', theme.text_20), 0);
  stylesheet.insertRule(composeRule(
    '.novella-box',
    'box-shadow', boxShadow + ' ' + theme.text_10), 0);
  stylesheet.insertRule(composeRule(
    '*', 'color', theme.text), 0);
}

function composeRule(iden, attr, color) {
  return iden + ' { ' + attr + ':' + color + '; }';
}

export default {
  initialize,
};

