import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import {
    colorPalette,
    chartTypeOptions,
    stackedOptions,
    seriesTypeOptions,
    // unitOptions,
    strokeStyleOptions,
    fillStyleOptions,
    widthOptions,
    gridOptions,
    dataTypeOptions,
    dateFormats,
    createChartDefaultOptions,
} from './options'

import dummyData from '@/tools/dummy-data.js'

// import { useFieldPlugin } from '@/useFieldPlugin'
import { useSheetManagerStore } from '@/stores/sheet-manager'

export const useChartDataStore = defineStore(
    'chart-data',
    () => {
        // const plugin = useFieldPlugin()
        const sheetManager = useSheetManagerStore()

        const width = ref({
            value: '',
        })
        width.value.value = widthOptions[0].value

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
            value: '',
        })
        grid.value.value = gridOptions[0].value

        const tooltip = ref({
            show: true,
        })

        const xAxis = ref({
            range: {
                text: '',
                sheet: '',
            },
            type: {
                value: '',
            },
            categories: [],
            dateFormat: {
                value: '',
            },
            angle: {
                value: 0,
            },
        })
        xAxis.value.type.value = dataTypeOptions[0].value
        xAxis.value.dateFormat.value = dateFormats[0]

        const type = ref('')
        type.value = chartTypeOptions[0].value

        const isSingleSeriesType = computed(() =>
            ['radialBar', 'donut'].includes(type.value),
        )

        const stacked = ref('')
        stacked.value = stackedOptions[0].value

        const createSeries = (templateSeries) => {
            const data = {
                id: Math.random().toString(36).slice(2, 9),
                show: true,
                name: '',
                range: {
                    text: '',
                    sheet: '',
                },
                data: [],
                type: seriesTypeOptions[0].value,
                unit: '[Einheit]',
                color: colorPalette[
                    Math.floor(Math.random() * colorPalette.length)
                ],
                style: {
                    stroke: strokeStyleOptions[0],
                    fill: fillStyleOptions[0],
                },
                dataLabel: false,
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
        const filteredSeriesList = computed(() => {
            const list = seriesList.value.filter(
                (item) => item.show && item.data.length > 0,
            )

            if (isSingleSeriesType.value) {
                return list.slice(0, 1)
            }
            return list
        })

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
            const opts = createChartDefaultOptions()

            opts.chart.type = type.value

            const typeCount = {}
            filteredSeriesList.value.forEach((series) => {
                typeCount[series.type] = (typeCount[series.type] || 0) + 1
            })

            if ((!typeCount['bar'] && typeCount['line']) || typeCount['area']) {
                opts.chart.type = 'line'
            }

            opts.grid.show = grid.value.show
            opts.grid.xaxis.lines.show = ['vertical', 'both'].includes(
                grid.value.value,
            )

            opts.grid.yaxis.lines.show = ['horizontal', 'both'].includes(
                grid.value.value,
            )

            opts.tooltip.enabled = tooltip.value.show

            opts.xaxis.labels.rotate = 0 - xAxis.value.angle.value
            opts.xaxis.labels.rotateAlways = xAxis.value.angle.value > 0
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
                const config = w?.config?.customData[seriesIndex] || {}

                return isNaN(y)
                    ? ''
                    : y.toFixed(config?.tooltip?.precision) +
                          (config?.unit && ' ' + config?.unit)
            }

            opts.chart.stacked = stacked.value !== 'off'
            opts.chart.stackType = stacked.value === '100%' ? '100%' : 'normal'

            opts.stroke = {
                width: 2, //type.value === 'bar' ? 1 : 2,
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
                // if (type.value === 'bar') {
                // const width = item.type === 'bar' ? 1 : 2
                // opts.stroke.width.push(width)
                // }

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
                    dataLabel: item.dataLabel,
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
            // console.log('update chartSeries')

            if (isSingleSeriesType.value) {
                if (filteredSeriesList.value.length === 0) {
                    dataSeries.push(...dummyData.estEmissions)
                } else {
                    dataSeries.push(...filteredSeriesList.value[0].data)
                }
            } else {
                for (const item of filteredSeriesList.value) {
                    dataSeries.push({
                        name: item.name,
                        data: [...item.data],
                        type: item.type === 'default' ? type.value : item.type,
                        color: item.color.hex,
                    })
                }

                if (!dataSeries.length) {
                    dataSeries.push(
                        {
                            name: 'Emissionen',
                            data: dummyData.estEmissions,
                        },
                        {
                            name: '1,5°C Pfad ',
                            data: dummyData.onePoint5Path,
                        },
                    )
                }
            }

            return dataSeries
        })

        const transformedData = ref({})
        watch(
            () => [chartSeries.value, chartOptions.value],
            () => {
                transformedData.value.options = chartOptions.value
                transformedData.value.series = chartSeries.value
                console.log('update transformedData')
            },
            { immediate: true, deep: true },
        )
        // const transformedData = computed(() => {
        //     return {
        //         options: chartOptions.value,
        //         series: chartSeries.value,
        //     }
        // })

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

        function setPreset(preset) {
            type.value = preset.type
            // change all series type to default
            seriesList.value.forEach((item) => {
                item.type = 'default'
            })

            if (preset.value === 'bar-line') {
                seriesList.value.slice(1).forEach((item) => {
                    item.type = 'line'
                })
            }

            if (preset.stacked) {
                stacked.value = preset.stacked
            } else {
                stacked.value = stackedOptions[0].value
            }
        }

        const loading = ref(false)
        function reloadData() {
            if (loading.value) {
                return false
            }

            loading.value = true
            console.info('loading data')

            return Promise.all(
                [xAxis.value, ...filteredSeriesList.value].map((item) => {
                    return sheetManager
                        .getSheetData(
                            sheetManager.sheetId,
                            item.range.sheet + '!' + item.range.text,
                        )
                        .then((data) => {
                            item.data = sheetManager.transformSheetData(
                                data,
                                item.range.direction,
                            )
                        })
                        .catch((error) => {
                            item.data = []
                            console.error(error)
                        })
                        .then(() => {
                            loading.value = false
                        })
                }),
            )
        }

        return {
            // settings
            loading,
            width,
            title,
            description,
            source,
            grid,
            tooltip,
            xAxis,
            stacked,
            type,
            seriesList,

            // methods
            addSeries,
            removeSeries,
            reloadData,
            setPreset,

            // output
            transformedData,
        }
    },
    {
        persist: true,
    },
)
