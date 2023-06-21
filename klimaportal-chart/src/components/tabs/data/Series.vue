<template>
    <div class="series-list">
        <div
            class="series-item"
            v-for="item in seriesList"
            :key="item.name"
        >
            <header>
                <h2>{{ item.name || 'Neuer Datensatz' }}</h2>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quis
                </p>
            </header>
            <q-input
                :modelValue="item.name"
                @change="(value) => (item.name = value)"
                label="Datensatz Name"
            />
        </div>
    </div>
</template>

<script>
import { mapState } from 'pinia'
import { useChartDataStore } from '@/stores/chart-data'

export default {
    // props: {
    //     name: { type: String, default: '' },
    //     dataReference: { type: String, default: '' },
    //     color: { type: String, default: '' },
    //     type: { type: String, default: '' },
    //     dataLabel: { type: String, default: '' },
    //     tooltip: {
    //         show: { type: Boolean, default: true },
    //         format: { type: String, default: '' },
    //         precision: { type: Number, default: 0 },
    //     },
    //     yAxis: {
    //         separate: { type: Boolean, default: false },
    //         position: { type: String, default: '' },
    //         unit: { type: String, default: '' },
    //         format: { type: String, default: '' },
    //         precision: { type: Number, default: 0 },
    //     },
    // },

    setup() {
        const chartData = useChartDataStore()

        return {
            chartData,
        }
    },

    data() {
        return {
            ...this.chartData.seriesList,
        }
    },

    computed: {
        ...mapState(useChartDataStore, ['seriesList']), //{
        // width: (store) => store.,
        //         title: (store) => store.transformedData.title,
        //         description: (store) => store.transformedData.description,
        //         options: (store) => store.transformedData.options,
        //         series: (store) => store.transformedData.series,
        //     }),
    },
}
</script>

<style scoped lang="scss"></style>
