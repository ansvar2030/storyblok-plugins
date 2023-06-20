<script setup lang="ts">
// import ModalToggle from './ModalToggle.vue'
// import Counter from './Counter.vue'
// import AssetSelector from './AssetSelector.vue'
// import { useFieldPlugin } from '../../useFieldPlugin'
// import { ref } from 'vue'
// import { matAddchart } from '@quasar/extras/material-icons'
import ChartSettings from './ChartSettings.vue'
import DataSetup from './DataSetup.vue'

// function closeModal() {
//     plugin.actions.setModalOpen(false)
// }

const presetList = [
    'bar',
    'area',
    'line',
    'radial',
    'bar-stacked',
    'area-stacked',
    'line-stacked',
    'donut',
    'bar-line',
]

// const optionsHTML = presetList.map((name) => {
//     return {
//         label: `<img
//                     src="/chart-presets/${name}.svg"
//                     alt=""
//                     width="111"
//                     height="106"
//                 />`,
//         value: name,
//         html: true,
//     }
// })
</script>

<template>
    <div class="container">
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
                v-for="preset of presetList"
                color="grey"
                outline
            >
                <img
                    :src="`/chart-presets/${preset}.svg`"
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
.container {
    display: grid;
    grid-template-columns: minmax(25%, 50%) 1fr;
    grid-template-rows: min-content min-content 1fr;
    padding: var(--k-gap);
    gap: var(--k-gap);
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
    justify-content: space-between;
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

.chart-preview {
    grid-column: 2;
    grid-row: 2;
}

.data-setup {
    grid-column: 1 / span 2;
    grid-row: 3;
}
</style>
