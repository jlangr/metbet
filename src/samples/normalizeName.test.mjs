import { normalizeName } from './normalizeName'; // adjust path if needed

describe('normalizeName', () => {
  it('handles mononym', () => {
    expect(normalizeName('Plato')).toBe('Plato');
  });

  it('trims extraneous whitespace', () => {
    expect(normalizeName('  Madonna   \n\r\t   ')).toBe('Madonna');
  });

  it('handles duonym', () => {
    expect(normalizeName('Jeff Langr')).toBe('Langr, Jeff');
  });

  it('initializes single middle name', () => {
    expect(normalizeName('Jeffrey John Langr')).toBe('Langr, Jeffrey J.');
  });

  it('initializes multiple middle names', () => {
    expect(normalizeName('John Jacob Schmingleheimer Schmidt')).toBe('Schmidt, John J. S.');
  });

  it('does not initialize single-letter middle name', () => {
    expect(normalizeName('Harry S Truman')).toBe('Truman, Harry S');
  });
});
