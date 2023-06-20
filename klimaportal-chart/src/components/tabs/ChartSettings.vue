<template>
    <div class="chart-settings">
        <div class="setting width">
            <q-select
                v-model="chartData.width.value"
                :options="chartData.width.options"
                emit-value
                borderless
                map-options
            />
            <div class="line"></div>
        </div>

        <div class="chart-container">
            <chart-preview
                ref="chartPreview"
                :editable="true"
            />
        </div>

        <div class="group-left">
            <div :class="['setting title', { show: chartData.title.show }]">
                <q-checkbox
                    v-model="chartData.title.show"
                    label="Titel"
                    @update:model-value="
                        (value) =>
                            value &&
                            $nextTick(() =>
                                $refs.chartPreview.$refs.inputTitle.focus(),
                            )
                    "
                />
                <div class="line"></div>
            </div>
            <div
                :class="[
                    'setting description',
                    { show: chartData.description.show },
                ]"
            >
                <q-checkbox
                    v-model="chartData.description.show"
                    label="Beschreibung"
                    @update:model-value="
                        (value) =>
                            value &&
                            $nextTick(() =>
                                $refs.chartPreview.$refs.inputDescription.focus(),
                            )
                    "
                />
                <div class="line"></div>
            </div>
            <div class="setting grid">
                <q-checkbox
                    v-model="chartData.grid.show"
                    label="Gitter"
                />
                <q-select
                    v-model="chartData.grid.value"
                    :options="chartData.grid.options"
                    emit-value
                    borderless
                    map-options
                    :disable="!chartData.grid.show"
                />
            </div>
            <div class="setting tooltip">
                <q-checkbox
                    v-model="chartData.tooltip.show"
                    label="Tooltip"
                />
            </div>
            <div class="setting x-axis">
                X-Achse
                <q-select
                    v-model="chartData.xAxis.type.value"
                    :options="chartData.xAxis.type.options"
                    emit-value
                    borderless
                    map-options
                />
                <q-select
                    v-show="chartData.xAxis.type.value === 'date'"
                    v-model="chartData.xAxis.dateFormat.value"
                    :options="chartData.xAxis.dateFormat.options"
                    borderless
                    map-options
                />
                <q-select
                    v-model="chartData.xAxis.angle.value"
                    :options="chartData.xAxis.angle.options"
                    emit-value
                    borderless
                    map-options
                />
            </div>
        </div>
    </div>
</template>

<script>
import { useChartDataStore } from '@/stores/chart-data'
import ChartPreview from '@/components/ChartPreview.vue'

export default {
    components: {
        ChartPreview,
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
}
</script>

<style scoped lang="scss">
.chart-settings {
    display: grid;
    grid-template-columns: auto min-content;
    grid-template-rows: min-content auto;
}

.setting {
    position: relative;

    &.title,
    &.description {
        display: flex;
        flex-flow: row nowrap;
        align-items: stretch;
        gap: 0.5rem;

        .line {
            position: relative;
            display: block;
            flex: auto 1 0;
            width: auto;
            height: auto;

            &::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 0%;
                display: block;
                width: calc(100% + 0.5rem);
                height: 1px;
                background-color: #000;
                transform: scale(0, 1);
                transform-origin: left;
                transition: transform 0.3s ease-in-out;
            }
        }

        &.show {
            .line {
                &::after {
                    transform: scale(1, 1);
                }
            }
        }
    }

    &.title {
        margin-top: 1.5rem;
    }

    &.description {
        margin-top: 0;
    }

    &.width {
        grid-column: 2;

        .q-select {
            position: relative;
            z-index: 5;
            margin: 0 auto;
            padding: 0 0.5rem;
            width: fit-content;
            background-color: #fff;
        }

        .line {
            position: absolute;
            z-index: 1;
            left: 0;
            top: calc(50% - 4px);
            display: block;
            width: 100%;
            height: 10px;
            border-left: 1px solid #000;
            border-right: 1px solid #000;

            &::before {
                content: '';
                position: absolute;
                top: 4px;
                left: 0;
                display: block;
                width: 100%;
                height: 1px;
                background-color: #000;
            }
        }
    }

    &.group-left {
        grid-column: 1;
        grid-row: 2;
    }
}

.chart-container {
    grid-column: 2;
    grid-row: 2;
}
</style>
