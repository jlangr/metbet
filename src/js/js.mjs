export const mapRange = (n, fn) =>
  Array.from({length: n}, (_, i) => fn(i));
