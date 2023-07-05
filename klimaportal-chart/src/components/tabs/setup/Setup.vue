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
        <div class="presets">
            <h3>Diagrammtyp</h3>
            <p>
                Dies sind Voreinstellungen, die sich beliebig anpassen &
                erweitern lassen.
            </p>

            <q-btn
                v-for="preset of presetOptions"
                color="grey"
                outline
                @click="chartData.setPreset(preset)"
                :key="preset.value"
            >
                <img
                    :src="`https://cdn.hub.ansvar.com/chart-presets/${preset.value}.svg`"
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

.presets {
    grid-column: 1;
    grid-row: 2;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-self: self-start;
    gap: 0.5rem;

    h3 {
        line-height: 1;
        margin: 0 0 0.5rem;
    }

    p {
        margin: 0 0 1rem;
    }

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
