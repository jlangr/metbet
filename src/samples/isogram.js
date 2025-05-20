export const isIsogram = str => {
  const lettersOnlyToLower = str.toLowerCase().replace(/[^a-z]/g, '');
  return new Set(lettersOnlyToLower).size === lettersOnlyToLower.length;
}

// ===

export function isIsogramOld(str) {
  var seen = [];
  var lower = '';
  for (var i = 0; i < str.length; i++) {
    var c = str[i].toLowerCase();
    if (c === ' ' || c === '-') continue;
    lower += c;
  }
  for (var j = 0; j < lower.length; j++) {
    if (seen.indexOf(lower[j]) !== -1) {
      return false;
    }
    seen.push(lower[j]);
  }
  return true;
}
