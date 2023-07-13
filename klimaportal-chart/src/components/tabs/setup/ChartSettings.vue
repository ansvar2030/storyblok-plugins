<template>
    <div class="chart-settings">
        <div class="setting width">
            <q-select
                v-model="chartData.width.value"
                :options="widthOptions"
                emit-value
                borderless
                map-options
                dense
            />
            <div class="line"></div>
        </div>

        <div class="chart-container">
            <chart-preview
                ref="chartPreview"
                :editable="true"
                :refresh-button="true"
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
                <div class="sub">
                    <q-select
                        v-model="chartData.grid.value"
                        :options="gridOptions"
                        emit-value
                        borderless
                        dense
                        map-options
                        :disable="!chartData.grid.show"
                    />
                </div>
            </div>
            <div class="setting tooltip">
                <q-checkbox
                    v-model="chartData.tooltip.show"
                    label="Tooltip"
                />
            </div>
            <div class="setting x-axis">
                <div class="sub">
                    <div class="label">X-Achse</div>

                    <q-select
                        v-model="chartData.xAxis.type.value"
                        :options="dataTypeOptions"
                        emit-value
                        borderless
                        dense
                        map-options
                        label="Typ"
                    />
                    <q-select
                        v-show="chartData.xAxis.type.value === 'datetime'"
                        v-model="chartData.xAxis.dateFormat.value"
                        :options="dateFormats"
                        borderless
                        dense
                        label="Datumsformat"
                    />
                    <!-- <q-select
                        v-model="chartData.xAxis.angle.value"
                        :options="chartData.xAxis.angle.options"
                        emit-value
                        borderless
                        dense
                        map-options
                        label="Winkel"
                    /> -->
                    <div class="angle">
                        <div class="label">Winkel</div>
                        <q-slider
                            :modelValue="chartData.xAxis.angle.value"
                            @change="
                                (value) => (chartData.xAxis.angle.value = value)
                            "
                            label
                            label-always
                            switch-label-side
                            markers
                            :label-value="chartData.xAxis.angle.value + ' °'"
                            :min="0"
                            :step="22.5"
                            :max="45"
                            dense
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useChartDataStore } from '@/stores/chart'
import ChartPreview from '@/components/ChartPreview.vue'
import {
    widthOptions,
    gridOptions,
    dataTypeOptions,
    dateFormats,
} from '@/stores/chart/options'

export default {
    components: {
        ChartPreview,
    },

    setup() {
        const chartData = useChartDataStore()

        return {
            chartData,

            widthOptions,
            gridOptions,
            dataTypeOptions,
            dateFormats,
        }
    },

    data() {
        return {}
    },
}
</script>

<style scoped lang="scss">
@import '@/assets/tools.scss';

.chart-settings {
    display: grid;
    grid-template-columns: auto min-content;
    grid-template-rows: min-content auto;
    gap: 0 var(--k-gap);
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
                transition: transform 0.25s $ease-out-sine;
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
        margin-top: 1.25rem;
    }

    &.description {
        margin-top: 0;
    }

    &.width {
        grid-column: 2;
        transform: translate(0, -0.875rem);

        .q-select {
            position: relative;
            z-index: 5;
            margin: 0 auto;
            padding: 0 0.5rem;
            width: fit-content;
            background-color: #f9f9f9;
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

    &.grid {
        margin-top: 1.5rem;
    }

    &.x-axis {
        margin-top: 1.5rem;
    }

    .sub {
        display: flex;
        flex-flow: column;
        gap: 0.5rem;
        padding: 0 0 0 2.5rem;
    }

    .label {
        user-select: none;
    }
}

.group-left {
    grid-column: 1;
    grid-row: 2;
}

.chart-container {
    grid-column: 2;
    grid-row: 2;
}
</style>
