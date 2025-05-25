const normalizeName = name => {
    const cleanName = name.trim().replace(/\s+/g, ' ')
    const parts = cleanName.split(' ')
    if (parts.length === 1) return parts[0]
    const lastName = parts.pop()
    const firstName = parts.shift()
    const middleInitials = parts.map(name => `${name.charAt(0)}.`).join(' ')
    return `${lastName}, ${firstName} ${middleInitials}`.trim()
}