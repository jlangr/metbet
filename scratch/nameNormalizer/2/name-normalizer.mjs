const normalizeName = name => {
    const cleanName = name.trim().replace(/\s+/g, ' ')
    const parts = cleanName.split(' ')
    switch (parts.length) {
        case 1:
            return parts[0]
        case 2:
            return `${parts[1]}, ${parts[0]}`
        default:
            return formatMultipleParts(parts)
    }
}

const formatMultipleParts = parts => {
    const lastName = parts.pop()
    const firstName = parts.shift()
    const middleInitials = parts.map(getInitial).join(' ')
    return `${lastName}, ${firstName} ${middleInitials}.`
}

const getInitial = name => `${name.charAt(0)}.`

export { normalizeName }