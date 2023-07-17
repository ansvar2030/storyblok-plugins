import DateTime from 'apexcharts/src/utils/DateTime.js'

export const stackedOptions = [
    {
        label: 'Aus',
        value: 'off',
    },
    {
        label: 'Normal',
        value: 'normal',
    },
    {
        label: '100%',
        value: '100%',
    },
]

export const presetOptions = [
    {
        label: 'bar',
        value: 'bar',
        type: 'bar',
        stacked: false,
    },
    {
        label: 'area',
        value: 'area',
        type: 'area',
        stacked: false,
    },
    {
        label: 'line',
        value: 'line',
        type: 'line',
        stacked: false,
    },
    {
        label: 'bar-stacked',
        value: 'bar-stacked',
        type: 'bar',
        stacked: stackedOptions[1].value,
    },
    {
        label: 'area-stacked',
        value: 'area-stacked',
        type: 'area',
        stacked: stackedOptions[1].value,
    },
    {
        label: 'line-stacked',
        value: 'line-stacked',
        type: 'line',
        stacked: stackedOptions[1].value,
    },
    // {
    //     label: 'radial',
    //     value: 'radial',
    //     type: 'radialBar',
    //     stacked: false,
    //     singleSeries: true,
    // },
    // {
    //     label: 'donut',
    //     value: 'donut',
    //     type: 'donut',
    //     stacked: false,
    //     singleSeries: true,
    // },
    {
        label: 'bar-line',
        value: 'bar-line',
        type: 'bar',
        stacked: false,
    },
]

export const colorPalette = [
    {
        key: 'red.300',
        hex: '#f9a3a8',
    },
    {
        key: 'red.600',
        hex: '#ff506a',
    },
    {
        key: 'red.900',
        hex: '#ff0035',
    },
    {
        key: 'orange.300',
        hex: '#ffcf96',
    },
    {
        key: 'orange.600',
        hex: '#ff9b54',
    },
    {
        key: 'orange.900',
        hex: '#ff7614',
    },
    {
        key: 'yellow.300',
        hex: '#ffec96',
    },
    {
        key: 'yellow.600',
        hex: '#fbce50',
    },
    {
        key: 'yellow.900',
        hex: '#ffbe05',
    },
    {
        key: 'lemon.300',
        hex: '#fcf6b1',
    },
    {
        key: 'lemon.600',
        hex: '#fbe662',
    },
    {
        key: 'lemon.900',
        hex: '#ffdc05',
    },
    {
        key: 'moss.300',
        hex: '#c6f18f',
    },
    {
        key: 'moss.600',
        hex: '#aadc41',
    },
    {
        key: 'moss.900',
        hex: '#a0d50a',
    },
    {
        key: 'green.300',
        hex: '#a7e3b4',
    },
    {
        key: 'green.600',
        hex: '#62c882',
    },
    {
        key: 'green.900',
        hex: '#20b54f',
    },
    {
        key: 'cyan.300',
        hex: '#75d8de',
    },
    {
        key: 'cyan.600',
        hex: '#51b7b5',
    },
    {
        key: 'cyan.900',
        hex: '#14a5a3',
    },
    {
        key: 'blue.300',
        hex: '#87b0ff',
    },
    {
        key: 'blue.600',
        hex: '#4983d9',
    },
    {
        key: 'blue.900',
        hex: '#2b6bb5',
    },
    {
        key: 'purple.300',
        hex: '#c08df5',
    },
    {
        key: 'purple.600',
        hex: '#ae53ce',
    },
    {
        key: 'purple.900',
        hex: '#9534b7',
    },
    {
        key: 'pink.300',
        hex: '#ea88cf',
    },
    {
        key: 'pink.600',
        hex: '#e945a3',
    },
    {
        key: 'pink.900',
        hex: '#d90e83',
    },
]

export const chartTypeOptions = [
    {
        label: 'Line',
        value: 'line',
    },
    {
        label: 'Area',
        value: 'area',
    },
    {
        label: 'Bar',
        value: 'bar',
    },
    {
        label: 'Radial',
        value: 'radial',
    },
    {
        label: 'Donut',
        value: 'donut',
    },
]

export const seriesTypeOptions = [
    {
        label: '-',
        value: 'default',
    },
    {
        label: 'Line',
        value: 'line',
    },
    {
        label: 'Area',
        value: 'area',
    },
    {
        label: 'Bar',
        value: 'bar',
    },
]

export const unitOptions = [
    { group: 'Allgemein' },
    'Stk.',
    '%',
    { group: 'Energie' },
    'MWh',
    'GWh',
    'TWh',
    { group: 'Gewicht' },
    't',
    'Tsd. t',
    'Mio. t',
    { group: 'Klima' },
    't CO₂',
    'Mio. t CO₂',
    'Mio. t CO₂e',
].map((item) => {
    if (typeof item === 'string') {
        return {
            label: item,
            value: item,
        }
    }

    return item
})

export const strokeStyleOptions = [
    {
        label: 'durchgezogen',
        value: 'solid-straight',
        settings: {
            dashArray: 0,
            curve: 'straight',
            width: 2,
        },
    },
    {
        label: 'durchgezogen & geglättet',
        value: 'solid-smooth',
        settings: {
            dashArray: 0,
            curve: 'smooth',
            width: 2,
        },
    },
    {
        label: 'gestrichelt',
        value: 'dashed-straight',
        settings: {
            dashArray: 5,
            curve: 'straight',
            width: 2,
        },
    },
    {
        label: 'gestrichelt & geglättet',
        value: 'dashed-smooth',
        settings: {
            dashArray: 5,
            curve: 'smooth',
            width: 2,
        },
    },
]

export const fillStyleOptions = [
    {
        label: '0% transparent',
        value: 'opacity-100',
        settings: {
            opacity: 1,
            type: 'solid',
        },
    },
    {
        label: '25% transparent',
        value: 'opacity-75',
        settings: {
            opacity: 0.75,
            type: 'solid',
        },
    },
    {
        label: '50% transparent',
        value: 'opacity-50',
        settings: {
            opacity: 0.5,
            type: 'solid',
        },
    },
    {
        label: '75% transparent',
        value: 'opacity-25',
        settings: {
            opacity: 0.25,
            type: 'solid',
        },
    },
]

export const dataLabelOptions = [
    {
        label: 'Aus',
        value: 'off',
    },
    {
        label: 'Oben',
        value: 'top',
    },
    {
        label: 'Oben & versetzt',
        value: 'top-offset',
    },
    {
        label: 'Unten & versetzt',
        value: 'bottom-offset',
    },
]

export const widthOptions = [
    { value: 'single', label: 'Einfache Breite' },
    { value: 'double', label: 'Doppelte Breite' },
]

export const gridOptions = [
    {
        value: 'horizontal',
        label: 'Horizontal',
    },
    {
        value: 'vertical',
        label: 'Vertikal',
    },
    {
        value: 'both',
        label: 'Beides',
    },
]

export const dateFormats = [
    { label: 'YYYY', value: 'yyyy' },
    { label: 'MM.YYYY', value: 'MM.yyyy' },
    { label: 'DD.MM.YYYY', value: 'dd.MM.yyyy' },
    { label: 'D.M.YYYY', value: 'd.M.yyyy' },
    { label: 'MMM', value: 'MMM' },
    { label: "MMM 'YY", value: "MMM 'yy" },
]
export const dataTypeOptions = [
    {
        value: 'auto',
        label: 'Auto',
    },
    {
        value: 'datetime',
        label: 'Datum',
    },
    {
        value: 'category',
        label: 'Kategorie',
    },
]

const de = {
    name: 'de',
    options: {
        months: [
            'Januar',
            'Februar',
            'März',
            'April',
            'Mai',
            'Juni',
            'Juli',
            'August',
            'September',
            'Oktober',
            'November',
            'Dezember',
        ],
        shortMonths: [
            'Jan',
            'Feb',
            'Mär',
            'Apr',
            'Mai',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Okt',
            'Nov',
            'Dez',
        ],
        days: [
            'Sonntag',
            'Montag',
            'Dienstag',
            'Mittwoch',
            'Donnerstag',
            'Freitag',
            'Samstag',
        ],
        shortDays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        toolbar: {
            exportToSVG: 'SVG speichern',
            exportToPNG: 'PNG speichern',
            exportToCSV: 'CSV speichern',
            menu: 'Menü',
            selection: 'Auswahl',
            selectionZoom: 'Auswahl vergrößern',
            zoomIn: 'Vergrößern',
            zoomOut: 'Verkleinern',
            pan: 'Verschieben',
            reset: 'Zoom zurücksetzen',
        },
    },
}

export function createChartDefaultOptions() {
    return {
        chart: {
            type: 'line',
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
            height: 272,
            locales: [de],
            defaultLocale: 'de',
            fontFamily: 'Satoshi, sans-serif',
            background: '#fff',
        },
        xaxis: {
            type: 'datetime',
            lines: {
                show: true,
            },
            labels: {
                rotate: 0,
                rotateAlways: true,
                hideOverlappingLabels: true,
                format: 'yyyy',
                style: {
                    fontSize: '12px',
                    fontWeight: 500,
                },
            },

            tooltip: {
                enabled: true,
                formatter(value, { w }) {
                    if (w.config.xaxis.type !== 'datetime') {
                        return value
                    }

                    const { format = 'yyyy' } = w.config.xaxis.labels
                    const d = DateTime.prototype.getDate.call({ w }, value)
                    return DateTime.prototype.formatDate.call({ w }, d, format)
                },
            },
        },
        yaxis: [
            {
                lines: {
                    show: false,
                },
                labels: {
                    style: {
                        fontSize: '12px',
                        fontWeight: 500,
                    },
                },
                title: {
                    style: {
                        fontSize: '15px',
                        fontWeight: 500,
                    },
                },
            },
        ],
        colors: ['#000', '#999'],
        stroke: {
            width: 2,
            dashArray: [0, 5],
        },
        grid: {
            show: true,

            xaxis: {
                lines: {
                    show: true,
                },
            },

            yaxis: {
                lines: {
                    show: false,
                },
            },
        },
        fill: {
            type: 'solid',
            opacity: [1, 0.25],
        },
        markers: {
            size: 0,
            // shape: 'circle',
            // radius: 0,
            fillOpacity: 1,
            strokeColors: '#fff',
            strokeWidth: 2,
            strokeOpacity: 1,
            // strokeDashArray: 0,
            hover: {
                size: 5,
            },
        },
        forecastDataPoints: {
            count: 0,
            fillOpacity: 0.35,
            strokeWidth: 1,
            dashArray: 5,
        },
        legend: {
            horizontalAlign: 'left',
            inverseOrder: false,
            // offsetY: 10,
            // offsetX: 0,
            fontSize: '14px',
            fontWeight: 700,
            markers: {
                width: 10,
                height: 10,
                radius: 0,
                strokeWidth: '1px',
                strokeColor: '#000',
                offsetX: -3,
            },
            itemMargin: {
                horizontal: 10,
            },
        },
        tooltip: {
            enabled: true,
            shared: true,
            intersect: false,
            inverseOrder: false,
            fixed: {
                enabled: true,
                position: 'topLeft',
                offsetX: 0,
                offsetY: 0,
            },
            style: {
                fontSize: '14px',
            },
            x: {
                show: false,
                // formatter: (v) => new Date(v).getFullYear(),
            },
            y: {
                formatter: (v) => Math.round(v) + ' Mio. t',
                title: {
                    formatter: (seriesName) => seriesName,
                },
            },
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                const hiddenSeries = [
                    ...(w?.globals.dom.baseEl.querySelectorAll(
                        '.apexcharts-series-collapsed',
                    ) || []),
                ].map((el) => parseInt(el.getAttribute('data:realIndex'), 10))

                const list = series
                    .map((s, index) => {
                        const config = w?.config?.customData[index] || {}

                        if (
                            !s[dataPointIndex] ||
                            Number.isNaN(s[dataPointIndex])
                        )
                            return false

                        return {
                            index,
                            name: config?.name,
                            color: config?.color,
                            value: s[dataPointIndex]
                                .toFixed(config?.tooltip?.precision)
                                .replace('.', ','),
                            unit: config?.tooltip.unit || config?.unit,
                        }
                    })
                    .filter(
                        (item) => item && !hiddenSeries.includes(item.index),
                    )

                if (!list.length) {
                    return '<div></div>'
                }

                if (w.config.tooltip.inverseOrder) {
                    list.reverse()
                }

                return (
                    '<ul>' +
                    '<li>' +
                    list
                        .map(
                            (item) =>
                                `<span class="marker" style="color:${item.color};"></span>
                                <span class="name">${item.name}:</span> <span class="value">${item.value} ${item.unit}</span>`,
                        )
                        .join('</li><li>') +
                    '</li>' +
                    '</ul>'
                )
            },
        },
    }
}
