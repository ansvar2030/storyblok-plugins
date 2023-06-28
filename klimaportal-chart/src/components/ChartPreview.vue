<template>
    <div
        class="chart-preview chart"
        :class="['width-' + width]"
    >
        <header v-if="!editable">
            <div class="title">
                <h3 v-show="title?.show">
                    {{ title?.value }}
                </h3>
            </div>

            <div class="description">
                <p v-show="description?.show">
                    {{ description?.value }}
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

        <apexchart
            ref="chart"
            :type="options.chart.type"
            :options="options"
            :series="series"
            :height="options.chart.height"
        ></apexchart>

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
import { mapState } from 'pinia'
import { useChartDataStore } from '@/stores/chart-data'

export default {
    props: {
        editable: {
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
        return {}
    },

    computed: {
        ...mapState(useChartDataStore, {
            width: (store) => store.transformedData.width,
            title: (store) => store.transformedData.title,
            description: (store) => store.transformedData.description,
            options: (store) => store.transformedData.options,
            series: (store) => store.transformedData.series,
        }),
    },

    methods: {
        handleInputBlur(key, ev) {
            setTimeout(() => {
                if (this.chartData[key].show && !ev.srcElement.value.trim()) {
                    this.chartData[key].show = false
                }
            }, 100)
        },
    },

    watch: {
        width(val) {
            // console.log(this.$refs.chart)
            this.$nextTick(() => {
                this.$refs.chart.refresh()
            })
        },
    },
}
</script>

<style scoped lang="scss">
.chart {
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
        padding: 0 1rem 1rem;
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

    // .vue-apexcharts {
    //     // height: 260px;
    // }
}
</style>