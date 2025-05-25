import {normalizeName} from '../name-normalizer.mjs'
describe('normalizeName', () => {
    it('handles mononyms', () => {
        expect(normalizeName('Plato')).toBe('Plato')
    })

    it('handles duonyms', () => {
        expect(normalizeName('Clarence Ellis')).toBe('Ellis, Clarence')
    })

    it('trims spaces and handles multiple middle names', () => {
        expect(normalizeName('  Alan    Mathison  Turing  ')).toBe('Turing, Alan M.')
    })

    it('initializes middle name', () => {
        expect(normalizeName('Donald Ervin Knuth')).toBe('Knuth, Donald E.')
    })

    it('initializes multiple middle names', () => {
        expect(normalizeName('Grace Brewster Murray Hopper')).toBe('Hopper, Grace B. M.')
    })
})
