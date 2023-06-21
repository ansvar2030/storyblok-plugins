<script>
import { useChartDataStore } from '@/stores/chart-data'
import ChartPreview from '@/components/ChartPreview.vue'
import Series from './Series.vue'

export default {
    components: {
        ChartPreview,
        Series,
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

<template>
    <div class="container">
        <!-- <header>
            <h2>Daten</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis</p>
        </header> -->

        <div class="chart-column">
            <chart-preview />

            <div class="row">
                <q-btn
                    outline
                    label="Daten neu laden"
                    icon="refresh"
                    @click="chartData.reloadData"
                />
                <span class="hint">
                    Hier kannst die Ansicht aktualisieren, wenn du in
                    GoogleSheet Änderungen vorgenommen hast.
                </span>
            </div>

            <div class="row">
                <q-toggle
                    v-model="chartData.stacked"
                    label="Stacking"
                />

                <span class="hint">
                    Mehrere Datensätze können aufeinander gestapelt statt unter
                    übereinander angezeigt werden.
                </span>
            </div>
        </div>

        <div class="series-data">
            <series />
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    display: grid;
    grid-template-columns: min-content 1fr;
    grid-template-rows: min-content min-content 1fr;
    padding: var(--k-gap);
    gap: var(--k-gap);
}

header {
    grid-column: 1 / span 2;
    grid-row: 1;
}

.chart-column {
    grid-column: 1;
    grid-row: 2;
    margin-right: 1rem;
    // align-self: flex-start;

    .chart-preview {
        margin-bottom: 2rem;
    }

    > .row {
        margin-bottom: 1rem;
    }

    .q-btn {
        width: 100%;
        margin-bottom: 0.5rem;
    }

    .hint {
        font-size: 0.75rem;
        line-height: 1.2;
        color: var(--k-color-gray-500);
    }
}

.series-data {
    grid-column: 2;
    grid-row: 2;
    // display: flex;
    // flex-flow: column;
    // gap: var(--k-gap);
    // width: 100%;
}
</style>
