<script setup lang="ts">
import { useFieldPlugin } from '../useFieldPlugin'
import { onMounted, ref } from 'vue'
import { matAddchart } from '@quasar/extras/material-icons'
import TabSetup from './tabs/setup/Setup.vue'
import TabData from './tabs/data/Data.vue'
import { useSheetManagerStore } from '@/stores/sheet-manager'

const plugin = useFieldPlugin()
console.log('plugin', plugin)

const sheetManager = useSheetManagerStore()
onMounted(() => {
    console.log('reset sheetManager')
    sheetManager.reset()
})

const tab = ref('setup')
</script>

<template>
    <div class="container">
        <header>
            <h1>Diagramm <q-icon :name="matAddchart" /> Editor</h1>
            <q-btn
                :icon="
                    plugin.data.isModalOpen ? 'fullscreen_exit' : 'fullscreen'
                "
                round
                color="primary"
                title="In Overlay öffnen"
                @click="
                    () => plugin.actions.setModalOpen(!plugin.data.isModalOpen)
                "
            />
        </header>

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
        <q-separator />

        <q-tab-panels
            v-model="tab"
            animated
            transition-prev="jump-up"
            transition-next="jump-up"
        >
            <q-tab-panel name="setup">
                <tab-setup />
            </q-tab-panel>

            <q-tab-panel name="data">
                <tab-data />
            </q-tab-panel>

            <q-tab-panel name="extras">
                <div class="text-h4 q-mb-md">Extras</div>
                <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Quis praesentium cumque magnam odio iure quidem, quod illum
                    numquam possimus obcaecati commodi minima assumenda
                    consectetur culpa fuga nulla ullam. In, libero.
                </p>
                <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Quis praesentium cumque magnam odio iure quidem, quod illum
                    numquam possimus obcaecati commodi minima assumenda
                    consectetur culpa fuga nulla ullam. In, libero.
                </p>
                <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Quis praesentium cumque magnam odio iure quidem, quod illum
                    numquam possimus obcaecati commodi minima assumenda
                    consectetur culpa fuga nulla ullam. In, libero.
                </p>
            </q-tab-panel>
        </q-tab-panels>
    </div>
</template>

<style scoped lang="scss">
.container {
    padding: 0;

    :deep(.q-tab-panel) {
        background-color: #f9f9f9;
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 1rem;
    }
}
</style>
