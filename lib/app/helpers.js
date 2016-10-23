export function restrict(value, min, max) {
  var num = Number(value);
  num = Math.min(num, max);
  num = Math.max(num, min);
  return num;
}

export function scrollToElement(parent, element) {
  var parentRect = parent.getBoundingClientRect();
  var elementRect = element.getBoundingClientRect();

  if (elementRect.bottom > parentRect.bottom) {
    return element.scrollIntoView(false);
  }

  if (elementRect.top < parentRect.top) {
    element.scrollIntoView(true);
  }
}
