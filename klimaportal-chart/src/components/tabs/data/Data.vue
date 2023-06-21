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
        <header>
            <h2>Daten</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis</p>
        </header>

        <chart-preview />

        <div class="series-list">
            <series />
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: min-content min-content 1fr;
    padding: var(--k-gap);
    gap: var(--k-gap);
}

header {
    grid-column: 1 / span 2;
    grid-row: 1;
}

.chart-preview {
    grid-column: 1;
    grid-row: 2;
}

.series-list {
    grid-column: 2;
    grid-row: 2;
}
</style>
