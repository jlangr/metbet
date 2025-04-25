import {isIsogram as isIsogram, isIsogramOld} from '../../../src/examples/isogram.js'


// [isIsogram, isIsogramOld].forEach(isIsogram =>

// input is an isogram when
//   is word with unique letters
//     smelt
//
//   is hyphenated word with unique letters
//     go-kart
//
//   is sentence with unique letters
//     flux zebra horn
//
// input is not an isogram when
//   is word with duplicated letters
//     puzzlement
//
//   is hyphenated word with duplicated letters
//     know-it-all
//
//   is sentence with duplicated letters
//     subterranean homesick alien
//

describe('isIsogram', () => {

  [isIsogram, isIsogramOld].forEach(isIsogram =>
    describe('implementations', () => {
      describe('input is an isogram when', () => {
        it('is word with unique letters', () => {
          expect(isIsogram('smelt')).toBe(true)
        })

        it('is hyphenated word with unique letters', () => {
          expect(isIsogram('go-kart')).toBe(true)
        })

        it('is sentence with unique letters', () => {
          expect(isIsogram('flux zebra hit')).toBe(true)
        })
      })

      describe('input is not an isogram when', () => {
        it('is word with duplicated letters', () => {
          expect(isIsogram('puzzlement')).toBe(false)
        })

        it('is hyphenated word with duplicated letters', () => {
          expect(isIsogram('know-it-all')).toBe(false)
        })

        it('is sentence with duplicated letters', () => {
          expect(isIsogram('subterranean homesick alien')).toBe(false)
        })
      })
    }))
})
