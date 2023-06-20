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

    const xAxis = {
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
            value: ref(''),
        },
        dateFormat: {
            options: ['YYYY', 'MM.YYYY', 'DD.MM.YYYY'],
            value: ref(''),
        },
        angle: {
            options: ['0', '22,5', '45', '67,5', '90'],
            value: ref(''),
        },
    }
    xAxis.type.value = xAxis.type.options[0].value
    xAxis.dateFormat.value = xAxis.dateFormat.options[0]
    xAxis.angle.value = xAxis.angle.options[0]

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
                rotate: -45,
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
            offsetY: 10,
            offsetX: 0,
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

    const transformedData = computed(() => {
        return {
            width: width.value.value,
            title: title.value,
            description: description.value,
            options: options.value,
            series: series.value,
        }
    })

    return {
        width,
        title,
        description,
        grid,
        tooltip,
        xAxis,
        transformedData,
    }
})
