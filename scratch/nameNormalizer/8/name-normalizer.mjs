const normalizeName = name => {
    const cleanName = name.trim().replace(/\s+/g, ' ')
    const parts = cleanName.split(' ')
    return formatName(parts)
}

const formatName = parts => {
    if (parts.length === 1) return parts[0]
    if (parts.length === 2) return `${parts[1]}, ${parts[0]}`
    return `${parts[parts.length - 1]}, ${parts[0]} ${initializeMiddleNames(parts.slice(1, -1))}`
}

const initializeMiddleNames = names => names.map(name => `${name.charAt(0)}.`).join(' ')

export { normalizeName }