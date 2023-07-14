export function isDateString(dateString) {
    return (dateString + '').match(
        /^([23]\d{3}|\d{1,2}[./-]\d{1,2}[./-][23]\d{3}|[23]\d{3}[./-]\d{1,2}[./-]\d{1,2})$/,
    )
}

export function convertDateString(dateString) {
    dateString = (dateString + '').trim()
    if (!isDateString(dateString)) {
        return false
    }

    dateString = dateString.replace(/[./]/g, '-')
    const parts = dateString.split('-')

    let d = null
    try {
        if (parts.length === 1) {
            d = `${parts[0]}-01-01`
        } else if (parts[0].length === 4) {
            d = `${parts[0]}-${parts[1] || '01'}-${parts[2] || '01'}`
        } else {
            d = `${parts[2]}-${parts[1] || '01'}-${parts[0] || '01'}`
        }
    } catch (error) {
        console.warn('date conversion failed', error)
    }

    return d
}
