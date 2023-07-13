<template>
    <div
        class="chart-preview chart"
        :class="['width-' + chartData.width.value]"
    >
        cats: {{ transformedData.options.xaxis?.categories }}
        <header v-if="!editable">
            <div class="title">
                <h3 v-show="chartData.title?.show">
                    {{ chartData.title?.value }}
                </h3>
            </div>

            <div class="description">
                <p v-show="chartData.description?.show">
                    {{ chartData.description?.value }}
                </p>
            </div>
        </header>
        <header v-else>
            <div class="title">
                <q-input
                    v-model="chartData.title.value"
                    ref="inputTitle"
                    :class="['input-title', { show: chartData.title?.show }]"
                    dense
                    @update:model-value="
                        (text) =>
                            !!text.trim()
                                ? (chartData.title.show = true)
                                : false
                    "
                />
            </div>

            <div class="description">
                <q-input
                    v-model="chartData.description.value"
                    ref="inputDescription"
                    :class="[
                        'input-description',
                        { show: chartData.description?.show },
                    ]"
                    dense
                    @update:model-value="
                        (text) =>
                            !!text.trim()
                                ? (chartData.description.show = true)
                                : false
                    "
                />
            </div>
        </header>

        <q-btn
            v-if="refreshButton"
            class="refresh"
            icon="refresh"
            square
            dense
            color="primary"
            title="Chart aktualisieren"
            @click="refresh"
        />

        <q-badge
            color="negative"
            label="Dummy-Daten"
            outline
            :rounded="false"
            v-if="chartData.showDummyData"
            class="is-dummy-data"
        />

        <div :class="['container']">
            <apexchart
                v-if="mounted && transformedData.options?.chart?.type"
                ref="chart"
                :class="classes"
                :key="key"
                :type="transformedData.options?.chart?.type"
                :options="transformedData.options"
                :series="transformedData.series"
                :height="transformedData.options?.chart?.height"
                @animationEnd="updatePreviewImageDebounced"
                @updated="handleChartUpdate"
                @mounted="handleChartUpdate"
            ></apexchart>
        </div>

        <footer v-if="!editable">
            <div
                class="source"
                v-if="!!chartData.source.value.trim()"
            >
                <span>Quelle:</span> {{ chartData.source.value }}
            </div>
        </footer>
        <footer v-else>
            <div class="source">
                <span>Quelle:</span>
                <q-input
                    v-model="chartData.source.value"
                    ref="inputSource"
                    :class="['input-source']"
                    dense
                />
            </div>
        </footer>
    </div>
</template>

<script>
import { useChartDataStore } from '@/stores/chart'
import debounce from '@/tools/debounce'

export default {
    props: {
        editable: {
            type: Boolean,
            default: false,
        },
        refreshButton: {
            type: Boolean,
            default: false,
        },
    },

    setup() {
        const chartData = useChartDataStore()

        return {
            chartData,
        }
    },

    data() {
        return {
            key: this.generateKey(),
            mounted: false,

            maxSeriesLength: 0,

            createChartDefsDebounced: debounce(() => this.createChartDefs(), 50)
                .fn,

            updatePreviewImageDebounced: debounce(
                () =>
                    !this.chartData.showDummyData && this.updatePreviewImage(),
                3000,
            ).fn,
        }
    },

    mounted() {
        // FIXME: hack to fix chart animation
        setTimeout(() => {
            this.mounted = true
        }, 200)
    },

    computed: {
        transformedData() {
            return {
                options: this.chartData.transformedData.options,
                series: this.chartData.transformedData.series,
            }
        },

        classes() {
            const list = [
                {
                    stacked: this.chartData.stacked !== 'off',
                    forecast: this.chartData.forecast.count > 0,
                },
            ]

            if (this.chartData.forecast.count > 0) {
                list.push(
                    'forecast-' +
                        (this.chartData.seriesMaxLength -
                            this.chartData.forecast.count),
                )
            }

            return list
        },
    },

    methods: {
        generateKey() {
            return Math.random().toString(36).slice(2, 9)
        },

        refresh() {
            this.key = this.generateKey()
        },

        createChartDefs() {
            const chart = this.$refs.chart.chart
            const chartId = chart.w.globals.chartID
            console.log('createChartDefs', chart.w)

            const forecast = chart.w.config.forecastDataPoints
            const forecastCutoffIndex = Math.max(
                0,
                this.chartData.seriesMaxLength - forecast.count,
            )

            const Paper = chart.paper()
            const defs = Paper.defs()

            function addDiagonalHatchPattern(name = '', color = '') {
                defs.pattern(4, 4, function (add) {
                    add.rect(2, 4).fill(color || '#fff')
                }).attr({
                    id: 'diagonal-hatch-' + chartId + (name ? '-' + name : ''),
                    patternUnits: 'userSpaceOnUse',
                    patternTransform: 'rotate(45)',
                })
            }
            addDiagonalHatchPattern()

            chart.w.config.colors.forEach((color, index) => {
                addDiagonalHatchPattern('c' + index, color)
            })

            try {
                // absolute mask
                const forecastRect =
                    chart.w.globals.dom.elForecastMask?.children?.[0]

                if (forecastRect) {
                    const x = forecastRect.x.baseVal.value
                    const mask = document.createElementNS(
                        chart.w.globals.SVGNS,
                        'mask',
                    )
                    mask.setAttribute('id', 'diagonal-hatch-mask-' + chartId)
                    Paper.defs().node.appendChild(mask)

                    const sMask = Paper.select(
                        'mask#diagonal-hatch-mask-' + chartId,
                    ).members[0]

                    const r1 = Paper.rect(x, '100%')
                        .fill('#fefefe')
                        .attr({ x: 0, y: 0 })
                    const r2 = Paper.rect('100%', '100%')
                        .fill('url(#diagonal-hatch-' + chartId + ')')
                        .attr({ x: x, y: 0 })

                    sMask.node.appendChild(r1.node)
                    sMask.node.appendChild(r2.node)
                }

                // relative mask
                const relMask = document.createElementNS(
                    chart.w.globals.SVGNS,
                    'mask',
                )
                relMask.setAttribute('id', 'diagonal-hatch-rel-mask-' + chartId)
                Paper.defs().node.appendChild(relMask)

                const sRelMask = Paper.select(
                    'mask#diagonal-hatch-rel-mask-' + chartId,
                ).members[0]

                const relRect = Paper.rect('50%', '50%')
                    .fill('url(#diagonal-hatch-' + chartId + ')')
                    .attr({ x: 10, y: 10 })
                sRelMask.node.appendChild(relRect.node)

                const paths = Paper.node.querySelectorAll(
                    'g.apexcharts-area-series > .apexcharts-series > path:not([clip-path^="url(#forecast"]):not([clip-path^="url(#nonForecast"])',
                )
                for (const path of paths) {
                    path.setAttribute(
                        'mask',
                        'url(#diagonal-hatch-mask-' + chartId + ')',
                    )
                }

                const barGroups = Paper.node.querySelectorAll(
                    'g.apexcharts-bar-series > .apexcharts-series',
                )

                for (const barGroup of barGroups) {
                    const bars = barGroup.querySelectorAll(
                        'path.apexcharts-bar-area:nth-child(n + ' +
                            (forecastCutoffIndex + 1) +
                            ')',
                    )

                    for (const path of bars) {
                        const rgba = path.attributes.fill.value
                        const color =
                            '#' +
                            rgba
                                .slice(5)
                                .split(',')
                                .slice(0, 3)
                                .map((c) =>
                                    parseInt(c).toString(16).padStart(2, '0'),
                                )
                                .join('')

                        const index = chart.w.config.colors.findIndex(
                            (c) => c.toLowerCase() === color,
                        )
                        if (index === -1) {
                            continue
                        }

                        path.setAttribute(
                            'fill',
                            'url(#diagonal-hatch-' +
                                chartId +
                                '-c' +
                                index +
                                ')',
                        )
                    }
                }
            } catch (error) {
                console.log('additional styling failed', error)
            }
        },

        handleChartUpdate() {
            // console.log('update')
            this.updatePreviewImageDebounced()
            this.createChartDefsDebounced()
        },

        updatePreviewImage() {
            this.$refs.chart.chart
                .dataURI({ scale: 0.66 })
                .then(({ imgURI }) => {
                    console.info(
                        'preview image generated',
                        (imgURI.length / 1000).toFixed(1) + 'kb',
                    )
                    this.chartData.previewImage = imgURI
                })
        },

        handleInputBlur(key, ev) {
            setTimeout(() => {
                if (this.chartData[key].show && !ev.srcElement.value.trim()) {
                    this.chartData[key].show = false
                }
            }, 100)
        },
    },

    watch: {
        'chartData.width.value'() {
            setTimeout(() => {
                this.refresh()
            }, 200)
        },

        options: {
            handler(val) {
                console.log('update chart options', JSON.stringify(val))
            },
            deep: true,
        },
    },
}
</script>

<style scoped lang="scss">
.chart {
    position: relative;
    display: flex;
    flex-flow: column;
    border: 1px solid #000;
    box-shadow: 10px 10px 0px 0px #000;
    overflow: hidden;

    &.width {
        &-single {
            width: 272px;
        }

        &-double {
            width: 560px;
        }
    }

    header {
        display: flex;
        flex-flow: column;
        padding: 1rem 1rem 0;

        .q-input {
            opacity: 0.5;

            &.show {
                opacity: 1;
            }
        }
    }

    footer {
        display: flex;
        flex-flow: column;
        padding: 0.5rem 1rem 1rem;
    }

    .container {
        position: relative;
        height: 272px;
    }

    .title {
        h3 {
            font-size: 1.25rem;
            font-weight: 700;
            line-height: 1;
            margin-bottom: 0.5rem;
        }

        .q-input {
            // margin-top: -0.5rem;

            :deep(input) {
                font-size: 1.25rem;
                font-weight: 700;
                line-height: 1;
            }
        }
    }

    .description {
        p {
            font-size: 1rem;
            font-weight: 500;
        }

        .q-input {
            // margin-top: -1rem;

            :deep(input) {
                font-size: 1rem;
                font-weight: 500;
            }
        }
    }

    .source {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.75rem;
        line-height: 1.2;
        font-weight: 500;
        color: var(--k-color-gray-400);
        user-select: none;

        .q-input {
            flex: auto 1 0;

            :deep(.q-field__control) {
                height: 1.5rem;
            }

            :deep(.q-field__native) {
                font-size: 0.75rem;
                font-weight: 500;
                line-height: 1.2;
                padding: 0;
            }
        }
    }

    .q-btn.refresh {
        position: absolute;
        right: 0.25rem;
        top: 0.25rem;
        z-index: 10;
    }

    .q-badge.is-dummy-data {
        position: absolute;
        right: 3rem;
        top: 0.75rem;
        z-index: 10;
    }
}
</style>
