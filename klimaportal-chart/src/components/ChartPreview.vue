<template>
    <div
        class="chart-preview chart"
        :class="['width-' + chartData.width.value]"
    >
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
                    label2="Titel"
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
                    label2="Beschreibung"
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

        <div class="container">
            <apexchart
                v-if="mounted && transformedData.options?.chart?.type"
                ref="chart"
                :key="key"
                :type="transformedData.options?.chart?.type"
                :options="transformedData.options"
                :series="transformedData.series"
                :height="transformedData.options?.chart?.height"
                @animationEnd="updatePreviewImageDebounced"
                @updated="updatePreviewImageDebounced"
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
    },

    methods: {
        generateKey() {
            return Math.random().toString(36).slice(2, 9)
        },

        refresh() {
            this.key = this.generateKey()
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
