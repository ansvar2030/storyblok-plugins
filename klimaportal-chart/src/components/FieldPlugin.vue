<script setup lang="ts">
// import ModalToggle from './ModalToggle.vue'
// import Counter from './Counter.vue'
// import AssetSelector from './AssetSelector.vue'
import { useFieldPlugin } from '../useFieldPlugin'
import { ref, markRaw } from 'vue'
import { matAddchart } from '@quasar/extras/material-icons'
import Settings from './tabs/Settings.vue'

const plugin = useFieldPlugin()

// export default {
//     components: {
//         Settings,
//     },

//     data() {
//         return {
//             plugin: markRaw(plugin),
//             matAddchart: markRaw(matAddchart),

//             presetList: [
//                 'bar',
//                 'area',
//                 'line',
//                 'radial',
//                 'bar-stacked',
//                 'area-stacked',
//                 'line-stacked',
//                 'donut',
//                 'bar-line',
//             ],

const splitterModel = ref(20)
const tab = ref('setup')
//         }
//     },
// }

// function closeModal() {
//     plugin.actions.setModalOpen(false)
// }

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
            <h1>Diagramm <q-icon :name="matAddchart" /> Editor</h1>
        </header>

        <q-splitter
            v-model="splitterModel"
            horizontal
        >
            <template v-slot:before>
                <q-tabs
                    v-model="tab"
                    inline-label
                    v-bind="{ align: 'left' }"
                >
                    <q-tab
                        name="setup"
                        icon="build"
                        label="Einrichtung"
                    />
                    <q-tab
                        name="data"
                        icon="table_chart"
                        label="Daten"
                    />
                    <q-tab
                        name="extras"
                        icon="settings_suggest"
                        label="Extras"
                    />
                </q-tabs>
            </template>

            <template v-slot:after>
                <q-tab-panels
                    v-model="tab"
                    animated
                    swipeable
                    transition-prev="jump-up"
                    transition-next="jump-up"
                >
                    <q-tab-panel name="setup">
                        <div class="text-h4 q-mb-md">Setup</div>
                        <settings />
                    </q-tab-panel>

                    <q-tab-panel name="data">
                        <div class="text-h4 q-mb-md">Data</div>
                        <p>
                            Lorem ipsum dolor sit, amet consectetur adipisicing
                            elit. Quis praesentium cumque magnam odio iure
                            quidem, quod illum numquam possimus obcaecati
                            commodi minima assumenda consectetur culpa fuga
                            nulla ullam. In, libero.
                        </p>
                        <p>
                            Lorem ipsum dolor sit, amet consectetur adipisicing
                            elit. Quis praesentium cumque magnam odio iure
                            quidem, quod illum numquam possimus obcaecati
                            commodi minima assumenda consectetur culpa fuga
                            nulla ullam. In, libero.
                        </p>
                    </q-tab-panel>

                    <q-tab-panel name="extras">
                        <div class="text-h4 q-mb-md">Extras</div>
                        <p>
                            Lorem ipsum dolor sit, amet consectetur adipisicing
                            elit. Quis praesentium cumque magnam odio iure
                            quidem, quod illum numquam possimus obcaecati
                            commodi minima assumenda consectetur culpa fuga
                            nulla ullam. In, libero.
                        </p>
                        <p>
                            Lorem ipsum dolor sit, amet consectetur adipisicing
                            elit. Quis praesentium cumque magnam odio iure
                            quidem, quod illum numquam possimus obcaecati
                            commodi minima assumenda consectetur culpa fuga
                            nulla ullam. In, libero.
                        </p>
                        <p>
                            Lorem ipsum dolor sit, amet consectetur adipisicing
                            elit. Quis praesentium cumque magnam odio iure
                            quidem, quod illum numquam possimus obcaecati
                            commodi minima assumenda consectetur culpa fuga
                            nulla ullam. In, libero.
                        </p>
                    </q-tab-panel>
                </q-tab-panels>
            </template>
        </q-splitter>
    </div>
</template>

<style scoped lang="scss">
.container {
    padding: 0;
}
</style>
