const normalizeName = name => {
    const trimmedName = name.trim()
    const nameParts = trimmedName.split(/\s+/)
    return formatName(nameParts)
}

const formatName = parts => {
    switch (parts.length) {
        case 1:
            return parts[0]
        case 2:
            return `${parts[1]}, ${parts[0]}`
        default:
            return formatMultiple(parts)
    }
}

const formatMultiple = parts => {
    const lastName = parts.pop()
    const firstName = parts.shift()
    const middleInitials = parts.map(initialize).join(' ')
    return `${lastName}, ${firstName} ${middleInitials}`
}

const initialize = name => `${name.charAt(0)}.`

export { normalizeName }