<script setup lang="ts">
import { useFieldPlugin } from '../useFieldPlugin'
import { onMounted, ref } from 'vue'
import { matAddchart } from '@quasar/extras/material-icons'
import TabSetup from './tabs/setup/Setup.vue'
import TabData from './tabs/data/Data.vue'
import { useSheetManagerStore } from '@/stores/sheet-manager'
import { useStoryblokStorage } from '@/stores/storyblok-storage'

const plugin = useFieldPlugin()
const storyblokStorage = useStoryblokStorage()

onMounted(() => {
    const sheetManager = useSheetManagerStore()
    sheetManager.reset()
})

const tab = ref('setup')
</script>

<template>
    <div :class="['container', { 'in-modal': plugin.data.isModalOpen }]">
        <header>
            <h1>
                Diagramm
                <q-icon
                    :name="matAddchart"
                    color="secondary"
                />
                Editor
            </h1>
            <q-btn
                :icon="
                    plugin.data.isModalOpen ? 'fullscreen_exit' : 'fullscreen'
                "
                class="open-modal-round"
                round
                color="primary"
                title="In Overlay öffnen"
                @click="
                    () => plugin.actions.setModalOpen(!plugin.data.isModalOpen)
                "
            />

            <q-btn
                class="open-modal"
                :icon="plugin.data.isModalOpen ? 'fullscreen_exit' : 'launch'"
                color="primary"
                label="In Overlay öffnen"
                @click="
                    () => plugin.actions.setModalOpen(!plugin.data.isModalOpen)
                "
            />
        </header>

        <div class="content">
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
                <!-- <q-tab
                name="extras"
                icon="settings_suggest"
                label="Extras"
            /> -->
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

                <!-- <q-tab-panel name="extras">
                    <div class="text-h4 q-mb-md">Extras</div>
                    <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Quis praesentium cumque magnam odio iure quidem,
                        quod illum numquam possimus obcaecati commodi minima
                        assumenda consectetur culpa fuga nulla ullam. In,
                        libero.
                    </p>
                    <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Quis praesentium cumque magnam odio iure quidem,
                        quod illum numquam possimus obcaecati commodi minima
                        assumenda consectetur culpa fuga nulla ullam. In,
                        libero.
                    </p>
                    <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Quis praesentium cumque magnam odio iure quidem,
                        quod illum numquam possimus obcaecati commodi minima
                        assumenda consectetur culpa fuga nulla ullam. In,
                        libero.
                    </p>
                </q-tab-panel> -->
            </q-tab-panels>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/tools.scss';

.container {
    overflow: hidden;
    padding: 0;
    max-width: var(--k-page-max-width);
    margin: 0 auto;

    :deep(.q-tab-panel) {
        background-color: #f9f9f9;
    }

    &.in-modal {
        header {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;

            .q-btn {
                &.open-modal {
                    display: none;
                }

                &.open-modal-round {
                    display: inline-flex;
                }
            }
        }

        .content {
            display: block;
        }
    }
}

header {
    display: flex;
    flex-flow: column;
    padding: 0.5rem 1rem;

    h1 {
        line-height: 1.2;
    }

    .q-btn {
        &.open-modal {
            display: block;
            width: fit-content;
            margin: 1rem 0 0;
        }

        &.open-modal-round {
            display: none;
        }
    }
}

.content {
    display: none;
}

@include bp-lg {
    .container {
        &.in-modal {
        }
    }

    header {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;

        .q-btn {
            &.open-modal {
                display: none;
            }

            &.open-modal-round {
                display: inline-flex;
            }
        }
    }

    .content {
        display: block;
    }
}
</style>
