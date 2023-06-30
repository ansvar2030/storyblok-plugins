<script lang="ts">
import ChartSettings from './ChartSettings.vue'
import DataSetup from './DataSetup.vue'
import { presetOptions } from '@/stores/chart/options'
import { useChartDataStore } from '@/stores/chart'

export default {
    components: {
        ChartSettings,
        DataSetup,
    },

    setup() {
        const chartData = useChartDataStore()

        return {
            chartData,
            presetOptions,
        }
    },
}
</script>

<template>
    <div class="setup">
        <header>
            <h2>Diagrammtyp</h2>
            <p>
                Das ist eine Voreinstellung, die sich beliebig anpassen &
                erweitern lässt.
            </p>
        </header>
        <!-- <q-select
            filled
            v-model="preset"
            label="Standard"
            :options="optionsHTML"
        /> -->
        <div class="presets">
            <q-btn
                v-for="preset of presetOptions"
                color="grey"
                outline
                @click="chartData.setPreset(preset)"
            >
                <img
                    :src="`/chart-presets/${preset.value}.svg`"
                    alt=""
                    width="111"
                    height="106"
                />
            </q-btn>
        </div>
        <chart-settings />

        <data-setup />
    </div>
</template>

<style scoped lang="scss">
.setup {
    display: grid;
    grid-template-columns: minmax(25%, 50%) 1fr;
    grid-template-rows: min-content min-content 1fr;
    gap: var(--k-gap);
    padding: 0;
}

header {
    grid-column: 1 / span 2;
    grid-row: 1;
}

.presets {
    grid-column: 1;
    grid-row: 2;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-self: self-start;
    gap: 0.5rem;

    .q-btn {
        padding: 1px;
    }

    img {
        display: block;
    }
}

.chart-settings {
    grid-column: 2;
    grid-row: 2;
    margin-bottom: 2rem;
}

.data-setup {
    grid-column: 1 / span 2;
    grid-row: 3;
}
</style>
