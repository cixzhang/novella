export function restrict(value, min, max) {
  var num = Number(value);
  num = Math.min(num, max);
  num = Math.max(num, min);
  return num;
}
