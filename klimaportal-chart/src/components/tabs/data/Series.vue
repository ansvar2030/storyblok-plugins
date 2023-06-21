<template>
    <div class="series-list">
        <q-list bordered>
            <q-expansion-item
                group="somegroup"
                icon="dataset_linked"
                :header-style="{ color: item?.color?.hex }"
                :label="item.name || 'Neuer Datensatz'"
                :model-value="index === openedIndex"
                @update:model-value="
                    (value) => (value ? (openedIndex = index) : true)
                "
                class="series-item"
                v-for="(item, index) of seriesList"
                :key="item.name"
            >
                <div class="settings">
                    <div class="row">
                        <div class="option">
                            <q-input
                                :modelValue="item.name"
                                @change="(value) => (item.name = value)"
                                label="Datensatz Name"
                            />
                        </div>

                        <div class="option">
                            <q-input
                                v-model="item.dataReference"
                                label="Datenreferenz"
                                bottom-slots
                            >
                                <template v-slot:hint>
                                    Gib den Bereich aus deinem GoogleSheet für
                                    diesen Datensatz an.
                                </template>
                                <template v-slot:append>
                                    <q-btn
                                        icon="help"
                                        flat
                                        round
                                        @click="dialogDataReferenceHelp = true"
                                    />
                                </template>
                            </q-input>
                        </div>
                    </div>

                    <div class="row">
                        <div class="option">
                            <q-select
                                v-model="item.color"
                                :options="chartData.colorPalette"
                                label="Farbe"
                            >
                                <template v-slot:selected>
                                    <span
                                        class="color-option"
                                        v-if="item.color"
                                    >
                                        <span
                                            class="color-drop"
                                            :style="{ color: item?.color?.hex }"
                                        ></span>
                                        <q-item-label>{{
                                            filters.firstUpperCase(
                                                item?.color?.key?.replace(
                                                    '.',
                                                    ' ',
                                                ),
                                            )
                                        }}</q-item-label>
                                    </span>
                                </template>
                                <template v-slot:option="scope">
                                    <q-item v-bind="scope.itemProps">
                                        <q-item-section avatar>
                                            <span
                                                class="color-drop"
                                                :style="{
                                                    color: scope.opt.hex,
                                                }"
                                            ></span>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label>{{
                                                filters.firstUpperCase(
                                                    scope.opt.key.replace(
                                                        '.',
                                                        ' ',
                                                    ),
                                                )
                                            }}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>
                        </div>
                        <div class="option">
                            <q-select
                                v-model="item.style"
                                :options="chartData.strokeStyleOptions"
                                label="Stil"
                            ></q-select>
                        </div>
                        <div class="option">
                            <q-select
                                v-model="item.dataLabel"
                                :options="chartData.dataLabelOptions"
                                label="Datenbeschriftung"
                            ></q-select>
                        </div>
                    </div>

                    <q-separator />
                    <div class="row">tooltip</div>

                    <q-separator />
                    <div class="row">yAxis</div>

                    <div class="actions">
                        <q-btn
                            class="remove"
                            flat
                            label="Datensatz entfernen"
                            icon="delete"
                            @click="dialogRemoveSeries = { show: true, item }"
                        />
                    </div>
                </div>
            </q-expansion-item>
        </q-list>

        <q-btn
            outline
            label="Datensatz hinzufügen"
            icon="add"
            @click="addSeries"
        />

        <q-dialog
            v-model="dialogRemoveSeries.show"
            persistent
        >
            <q-card>
                <q-card-section class="row items-center">
                    <q-avatar icon="warning" />
                    <span class="q-ml-sm">Datensatz entfernen?</span>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn
                        flat
                        label="Abbrechen"
                        color="primary"
                        v-close-popup
                    />
                    <q-btn
                        label="Entfernen"
                        color="secondary"
                        v-close-popup
                        @click="() => removeSeries(dialogRemoveSeries.item)"
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog
            v-model="dialogDataReferenceHelp"
            persistent
        >
            <q-card>
                <q-card-section class="row items-center">
                    <span class="q-ml-sm">Datenreferenz</span>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn
                        label="Schließen"
                        flat
                        v-close-popup
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script>
import { mapState } from 'pinia'
import { useChartDataStore } from '@/stores/chart-data'

export default {
    inject: ['filters'],
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
            openedIndex: 0,
            dialogRemoveSeries: { show: false, item: undefined },
            dialogDataReferenceHelp: false,
        }
    },

    computed: {
        ...mapState(useChartDataStore, ['seriesList']),
    },

    watch: {
        // seriesList: {
        //     handler(value, oldValue) {
        //         console.log(value.length, oldValue.length)
        //         // this.openedIndex = this.seriesList.length - 1
        //     },
        //     deep: true
        // },
    },

    methods: {
        addSeries() {
            this.chartData.addSeries()
            this.openedIndex = this.seriesList.length - 1
        },

        removeSeries(item) {
            this.chartData.removeSeries(item)
            if (this.openedIndex > 0) {
                this.openedIndex--
            } else {
                this.openedIndex = 0
            }
        },
    },
}
</script>

<style scoped lang="scss">
.settings {
    display: flex;
    flex-flow: column;
    gap: var(--k-gap);
    padding: 0 1.5rem 1.5rem;
    // justify-content:space-between;
    border-bottom: 1px solid #000;

    .row {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: 1fr;
        gap: var(--k-gap);
    }

    .actions {
        display: flex;
        align-items: center;
        gap: var(--k-gap);
    }

    .q-btn {
        width: auto;

        &.remove {
            margin-left: auto;
        }
    }
}

:deep(.color-option) {
    display: flex;
    align-items: center;
    flex: auto 1 0;
    gap: 1rem;
    padding: 0 1.5rem;
}

:deep(.color-drop) {
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    background-color: currentColor;
    border: 1px solid rgba(#666, 0.25);
}

.series-list {
    :deep(.q-item__section--main) {
        color: #000;
    }

    .q-list {
        margin-bottom: 1.5rem;
    }
}

.q-expansion-item {
    :deep(.q-item) {
        .q-icon {
            // background-color: #fff;
            // border: 1px solid #999;
            // text-shadow: 1px 1px rgba(#000, 0.25), -1px -1px rgba(#000, 0.25);
        }
    }
}
</style>
