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
                    label="Titel"
                    ref="inputTitle"
                    :class="['input-title', { show: chartData.title?.show }]"
                    dense
                    borderless
                />
            </div>

            <div class="description">
                <q-input
                    v-model="chartData.description.value"
                    label="Beschreibung"
                    ref="inputDescription"
                    :class="[
                        'input-description',
                        { show: chartData.description?.show },
                    ]"
                    dense
                    borderless
                />
            </div>
        </header>

        <apexchart
            ref="chart"
            type="line"
            :options="options"
            :series="series"
        ></apexchart>
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
}
</script>

<style scoped lang="scss">
.chart {
    display: flex;
    flex-flow: column;
    border: 1px solid #000;
    padding: 1rem;
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

        .q-input {
            opacity: 0.5;

            &.show {
                opacity: 1;
            }
        }
    }

    .title {
        // position: relative;

        // &.visible {
        //     h3 {
        //         opacity: 1;
        //     }
        // }

        h3 {
            font-size: 1.25rem;
            font-weight: 700;
            line-height: 1;
            margin-bottom: 0.5rem;
            // opacity: 0;
        }

        .q-input {
            // position: absolute;
            // top: 0;
            // opacity: 1;
            // transform: translate(0, -1.6rem);

            :deep(input) {
                font-size: 1.25rem;
                font-weight: 700;
                line-height: 1;
            }
        }
    }

    .description {
        // position: relative;

        // &.visible {
        //     p {
        //         opacity: 1;
        //     }
        // }

        p {
            font-size: 1rem;
            font-weight: 500;
            // opacity: 0;
        }

        .q-input {
            // position: absolute;
            // top: 0;
            // opacity: 1;
            // transform: translate(0, -1.6rem);

            :deep(input) {
                font-size: 1rem;
                font-weight: 500;
            }
        }
    }

    // :deep(header) {
    //     .q-input {
    //         position: absolute;
    //         top: 0;
    //         opacity: 0.5;
    //         border: 1px solid red;
    //         transform: translate(0, 0rem);
    //     }
    // }

    // .vue-apexcharts {
    //     // height: 260px;
    // }
}
</style>
