export function normalizeName(input) {
  if (typeof input !== 'string') throw new Error('Input must be a string');

  const parts = input.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]; // Mononym

  const first = parts[0];
  const last = parts[parts.length - 1];
  const middles = parts.slice(1, -1);

  const initializedMiddles = middles
    .map(name => {
      if (name.length === 1) return name; // No period for single-letter middle names
      return name.charAt(0) + '.';
    })
    .join(' ');

  return `${last}, ${first}${initializedMiddles ? ' ' + initializedMiddles : ''}`;
}
