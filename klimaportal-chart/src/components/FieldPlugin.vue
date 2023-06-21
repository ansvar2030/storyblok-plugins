<script setup lang="ts">
import { useFieldPlugin } from '../useFieldPlugin'
import { ref } from 'vue'
import { matAddchart } from '@quasar/extras/material-icons'
import TabSettings from './tabs/settings/Settings.vue'
import TabData from './tabs/data/Data.vue'

const plugin = useFieldPlugin()

const tab = ref('setup')
</script>

<template>
    <div class="container">
        <header>
            <h1>Diagramm <q-icon :name="matAddchart" /> Editor</h1>
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
                <tab-settings />
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
}
</style>
