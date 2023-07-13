export function isDateString(dateString) {
    return dateString.match(
        /^(\d{1,2}[./-]\d{1,2}[./-][23]\d{3}|[23]\d{3}[./-]\d{1,2}[./-]\d{1,2})$/,
    )
}

export function convertDateString(dateString) {
    if (!isDateString(dateString)) {
        return false
    }

    dateString = dateString.replace(/[./]/g, '-')
    const parts = dateString.split('-')

    let d = null
    try {
        // const month = parseInt(parts[1], 10) - 1
        if (parts[0].length === 4) {
            d = `${parts[0]}-${parts[1]}-${parts[2]}`
            // d = new Date(parts[0], month, parts[2])
        } else {
            d = `${parts[2]}-${parts[1]}-${parts[0]}`
            // d = new Date(parts[2], month, parts[0])
        }
    } catch (error) {
        console.warn('date conversion failed', error)
    }

    return d
}
