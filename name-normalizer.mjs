import { split, trim, last, initial, dropRight, join, compose, toUpper } from 'lodash/fp'

const splitName = compose(trim, split(' '))
const formatInitials = compose(join('. '), initial, toUpper)
const formatName = nameParts => {
  const lastName = last(nameParts)
  const firstName = nameParts[0]
  const middleNames = dropRight(2, nameParts)
  const initials = middleNames.map(formatInitials)
  return `${lastName}, ${firstName} ${initials.join(' ')}`
}

const nameNormalizer = compose(formatName, splitName)

export default nameNormalizer