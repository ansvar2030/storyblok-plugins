function easeOutCubic(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b
}

function easeOutSine(t, b, c, d) {
    return c * Math.sin((t / d) * (Math.PI / 2)) + b
}

const targetYear = 2045
const year = new Date().getFullYear()
const years = []
for (let i = 0; i < targetYear - year + 1; i++) {
    years.push(year + i)
}

// co2 emissions
const onePoint5Path = []
const startEmissions = 40
const endEmissions2030 = startEmissions * 0.1
const yearDelta = 2030 - (year + 1)
for (let i = 0; i <= yearDelta; i++) {
    const yearEmissions =
        startEmissions * (1 - easeOutSine(i, 0, 0.9, yearDelta))
    // onePoint5Path.push({ x: `${year + i}-01-01`, y: yearEmissions })
    onePoint5Path.push(yearEmissions)
}

for (let i = 0; i <= 5; i++) {
    const yearEmissions = endEmissions2030 * (1 - Math.max(0, i / 5))
    // onePoint5Path.push({ x: `${2030 + i}-01-01`, y: yearEmissions })
    onePoint5Path.push(yearEmissions)
}

for (let i = 2036; i <= targetYear; i++) {
    // onePoint5Path.push({ x: `${i}-01-01`, y: 0 })
    onePoint5Path.push(0)
}

const estEmissions = []
for (let i = year; i <= targetYear; i++) {
    // estEmissions.push({
    //     x: `${i}-01-01`,
    //     y:
    //         startEmissions *
    //         (1 - easeOutCubic(i - year, 0, 0.5, targetYear - year)),
    // })
    estEmissions.push(
        startEmissions *
            (1 - easeOutCubic(i - year, 0, 0.5, targetYear - year)),
    )
}

export default {
    years,
    onePoint5Path,
    estEmissions,
}
