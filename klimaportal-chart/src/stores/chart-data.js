import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import dummyData from '@/tools/dummy-data.js'

export const useChartDataStore = defineStore('chart-data', () => {
    const width = ref({
        options: [
            { value: 'single', label: 'Einfache Breite' },
            { value: 'double', label: 'Doppelte Breite' },
        ],
        value: '',
    })
    width.value.value = width.value.options[0].value

    const title = ref({
        show: false,
        value: '',
    })

    const description = ref({
        show: false,
        value: '',
    })

    const source = ref({
        value: '',
    })

    const grid = ref({
        show: true,
        options: [
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
        ],
        value: '',
    })
    grid.value.value = grid.value.options[0].value

    const tooltip = ref({
        show: true,
    })

    const xAxis = ref({
        type: {
            options: [
                {
                    value: 'auto',
                    label: 'Auto',
                },
                {
                    value: 'date',
                    label: 'Datum',
                },
            ],
            value: '',
        },
        dateFormat: {
            options: ['YYYY', 'MM.YYYY', 'DD.MM.YYYY'],
            value: '',
        },
        angle: {
            // options: ['0°', '22,5°', '45°', '67,5°', '90°'],
            value: 0,
        },
    })
    xAxis.value.type.value = xAxis.value.type.options[0].value
    xAxis.value.dateFormat.value = xAxis.value.dateFormat.options[0]
    // xAxis.angle.value = xAxis.angle.options[0]

    const stacked = ref(false)

    const defaultOptions = {
        chart: {
            type: 'line',
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
            height: 272,
        },
        xaxis: {
            type: 'datetime',
            lines: {
                show: true,
            },
            labels: {
                rotate: 0,
                rotateAlways: true,
            },
        },
        yaxis: [
            {
                lines: {
                    show: false,
                },
                labels: {
                    formatter: function (value) {
                        return Math.round(value)
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
        legend: {
            horizontalAlign: 'left',
            // offsetY: 10,
            // offsetX: 0,
        },
        tooltip: {
            enabled: true,
            shared: true,
            intersect: false,
            x: {
                show: false,
                formatter: (v) => new Date(v).getFullYear(),
            },
            y: {
                formatter: (v) => Math.round(v) + ' Mio. t',
                title: {
                    formatter: (seriesName) => seriesName,
                },
            },
        },
    }

    const colorPalette = [
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

    const strokeStyleOptions = [
        {
            label: 'Durchgezogen',
            value: 'solid',
        },
        {
            label: 'Gestrichelt',
            value: 'dashed',
        },
    ]

    const dataLabelOptions = [
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

    const createSeries = () => ({
        name: '',
        dataReference: '',
        color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
        style: strokeStyleOptions[0],
        dataLabel: dataLabelOptions[0],
        tooltip: {
            show: true,
            format: '',
            precision: 0,
        },
        yAxis: {
            separate: false,
            position: 'left',
            unit: '',
            format: '',
            precision: 0,
        },
    })

    const seriesList = ref([])
    seriesList.value.push(createSeries())

    const transformedData = computed(() => {
        const options = computed(() => {
            const opts = { ...defaultOptions }

            opts.grid.show = grid.value.show
            opts.grid.xaxis.lines.show = ['vertical', 'both'].includes(
                grid.value.value,
            )

            opts.grid.yaxis.lines.show = ['horizontal', 'both'].includes(
                grid.value.value,
            )

            opts.tooltip.enabled = tooltip.value.show

            opts.xaxis.labels.rotate = 0 - xAxis.value.angle.value

            opts.chart.stacked = stacked.value

            return opts
        })

        const series = computed(() => {
            const dataSeries = [
                {
                    name: 'Emissionen',
                    data: dummyData.estEmissions,
                    type: 'line',
                },
                {
                    name: '1,5°C Pfad ',
                    data: dummyData.onePoint5Path,
                    type: 'area',
                },
            ]

            return dataSeries
        })

        return {
            width: width.value.value,
            title: title.value,
            description: description.value,
            options: options.value,
            series: series.value,
        }
    })

    function addSeries() {
        const series = createSeries()
        seriesList.value.push(series)
        return series
    }

    function removeSeries(item) {
        const index = seriesList.value.findIndex((sItem) => sItem === item)

        if (index > -1) {
            seriesList.value.splice(index, 1)
        }
    }

    function reloadData() {
        console.log('reloadData')
    }

    return {
        // settings
        width,
        title,
        description,
        source,
        grid,
        tooltip,
        xAxis,
        stacked,
        seriesList,

        // options
        colorPalette,
        strokeStyleOptions,
        dataLabelOptions,

        // methods
        addSeries,
        removeSeries,
        reloadData,

        // output
        transformedData,
    }
})
