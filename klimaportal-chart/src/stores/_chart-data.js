import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import dummyData from '@/tools/dummy-data.js'

export const useChartDataStore = defineStore(
    'chart-data',
    () => {
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
            range: '',
            sheet: '',
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
            categories: [],
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

        function createDefaultOptions() {
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
                        // formatter: (v) => new Date(v).getFullYear(),
                    },
                    y: {
                        formatter: (v) => Math.round(v) + ' Mio. t',
                        title: {
                            formatter: (seriesName) => seriesName,
                        },
                    },
                },
            }
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

        const chartTypeOptions = [
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

        const unitOptions = ['Mio. t', 'Mio. t CO2', 'Mio. t CO2e']

        const strokeStyleOptions = [
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

        const fillStyleOptions = [
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

        const createSeries = (templateSeries) => {
            const data = {
                id: Math.random().toString(36).slice(2, 9),
                name: '',
                range: {
                    text: '',
                    sheet: '',
                },
                data: [],
                type: chartTypeOptions[0],
                unit: '[Einheit]',
                color: colorPalette[
                    Math.floor(Math.random() * colorPalette.length)
                ],
                style: {
                    stroke: strokeStyleOptions[0],
                    fill: fillStyleOptions[0],
                },
                dataLabel: dataLabelOptions[0],
                tooltip: {
                    show: true,
                    format: '',
                    precision: 0,
                },
                yAxis: {
                    separate: false,
                    position: 'left',
                    format: '',
                    precision: 0,
                },
            }

            if (templateSeries) {
                data.range.text = templateSeries.range.text
                data.range.sheet = templateSeries.range.sheet

                data.style.stroke = templateSeries.style.stroke
                data.style.fill = templateSeries.style.fill
                data.dataLabel = templateSeries.dataLabel

                data.tooltip.show = templateSeries.tooltip.show
                data.tooltip.format = templateSeries.tooltip.format
                data.tooltip.precision = templateSeries.tooltip.precision
            }

            return data
        }

        const seriesList = ref([])
        seriesList.value.push(createSeries())
        const filteredSeriesList = computed(() =>
            seriesList.value.filter((item) => item.data.length > 0),
        )

        // function convertSeries(series) {
        //     return {
        //         name: series.name + ' ' + series.unit,
        //         data: [...series.data], //series.data.map((d) => d),
        //         type: 'line',
        //         // unit: series.unit,
        //         color: series.color.hex,
        //         // style: series.style.value,
        //         // dataLabel: series.dataLabel.value,
        //         // tooltip: {
        //         //     precision: series.tooltip.precision,
        //         //     //         show: series.tooltip.show,
        //         //     //         formatter: (v) => Math.round(v) + series.unit,
        //         // },
        //     }
        // }

        const chartOptions = computed(() => {
            console.log('update chartOptions')
            const opts = createDefaultOptions()

            opts.grid.show = grid.value.show
            opts.grid.xaxis.lines.show = ['vertical', 'both'].includes(
                grid.value.value,
            )

            opts.grid.yaxis.lines.show = ['horizontal', 'both'].includes(
                grid.value.value,
            )

            opts.tooltip.enabled = tooltip.value.show

            opts.xaxis.labels.rotate = 0 - xAxis.value.angle.value
            opts.xaxis.categories = [...xAxis.value.categories]

            if (
                xAxis.value.type.value === 'auto' &&
                xAxis.value.categories.length
            ) {
                opts.xaxis.type = 'category'
            } else {
                opts.xaxis.type = 'datetime'
            }

            opts.tooltip.shared = true
            opts.tooltip.y.formatter = function (y, { seriesIndex, w }) {
                const config = w.config.customData[seriesIndex]

                return isNaN(y)
                    ? ''
                    : y.toFixed(config.tooltip.precision) +
                          (config.unit && ' ' + config.unit)
            }

            opts.chart.stacked = stacked.value

            opts.stroke = {
                width: 2,
                dashArray: [],
                curve: [],
            }

            opts.fill = {
                opacity: [],
                type: [],
            }

            opts.dataLabels = {
                enabled: true,
                enabledOnSeries: [],
                formatter: (val, { seriesIndex, w }) => {
                    // const config = w.config.customData[seriesIndex]
                    return isNaN(val) ? '' : val.toFixed(0)
                },
            }

            filteredSeriesList.value.forEach((item, index) => {
                opts.stroke.dashArray.push(
                    item.style.stroke?.settings?.dashArray,
                )
                opts.stroke.curve.push(item.style.stroke?.settings?.curve)

                opts.fill.opacity.push(item.style.fill?.settings?.opacity)
                opts.fill.type.push(item.style.fill?.settings?.type)

                if (item.dataLabel) {
                    opts.dataLabels.enabledOnSeries.push(index)
                }
            })

            opts.customData = []
            for (const item of filteredSeriesList.value) {
                opts.customData.push({
                    name: item.name,
                    unit: item.unit,
                    color: item.color.hex,
                    style: item.style.value,
                    dataLabel: item.dataLabel.value,
                    tooltip: {
                        precision: item.tooltip.precision,
                        //     //         show: series.tooltip.show,
                        //     //         formatter: (v) => Math.round(v) + series.unit,
                    },
                })
            }

            return opts
        })

        const chartSeries = computed(() => {
            const dataSeries = []
            console.log('update chartSeries')

            for (const item of filteredSeriesList.value) {
                dataSeries.push({
                    name: item.name,
                    data: [...item.data],
                    type: item.type.value,
                    color: item.color.hex,
                })
            }

            if (!dataSeries.length) {
                dataSeries.push(
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
                )
            }

            return dataSeries
        })

        const transformedData = computed(() => {
            return {
                width: width.value.value,
                title: title.value,
                description: description.value,
                options: chartOptions.value,
                series: chartSeries.value,
            }
        })

        function addSeries() {
            const lastSeries =
                seriesList.value.length &&
                seriesList.value[seriesList.value.length - 1]

            const series = createSeries(lastSeries)
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
            chartTypeOptions,
            unitOptions,
            colorPalette,
            strokeStyleOptions,
            fillStyleOptions,
            dataLabelOptions,

            // methods
            addSeries,
            removeSeries,
            reloadData,

            // output
            transformedData,
        }
    },
    {
        persist: {
            // beforeRestore: (ctx) => {
            //     const key = ctx.store.$id
            //     const config = useRuntimeConfig()
            //     try {
            //         const persistedData = JSON.parse(localStorage.getItem(key))
            //         if (
            //             persistedData &&
            //             persistedData.version !== config.public.version
            //         ) {
            //             // prevent restore
            //             console.info('version mismatch, clearing order store')
            //             localStorage.setItem(
            //                 key,
            //                 _omit(persistedData, ['data']),
            //             )
            //         }
            //     } catch (error) {
            //         console.warn('order store version check failed', error)
            //         Bugsnag.notify(error, (event) => {
            //             event.context = 'order-store.restore'
            //         })
            //     }
            // },
            // paths: ['version', 'settings', 'data'],
        },
    },
)
