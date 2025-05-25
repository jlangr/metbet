export const normalizeName = name => {
    const cleanName = name.trim().replace(/\s+/g, ' ')
    const parts = cleanName.split(' ')
    if (parts.length === 1) return parts[0]
    const lastName = parts.pop()
    const firstName = parts.shift()
    const middleInitials = parts.map(getInitial).join(' ')
    return formatName(lastName, firstName, middleInitials)
}

const getInitial = name => `${name.charAt(0)}.`

const formatName = (lastName, firstName, middleInitials) => {
    return middleInitials ? `${lastName}, ${firstName} ${middleInitials}` : `${lastName}, ${firstName}`
}
