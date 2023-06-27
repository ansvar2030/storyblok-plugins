<template>
    <div class="series-list">
        <q-list bordered>
            <q-expansion-item
                group="group"
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
                                class="name"
                                :modelValue="item.name"
                                @change="(value) => (item.name = value)"
                                label="Datensatz Name"
                            />
                        </div>

                        <div class="option">
                            <RangeSelect
                                ref="Datenreferenz"
                                label="Datenbereich"
                                :model-value="item.range.text"
                                @update:range="(val) => (item.range = val)"
                                @update:data="(val) => (item.data = val)"
                                hint="Gib den Bereich aus deinem GoogleSheet für diesen Datensatz an."
                            />
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
                                                ) || '',
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

                    <!-- <q-separator />
                    <div class="row">tooltip</div>

                    <q-separator />
                    <div class="row">yAxis</div> -->

                    <div class="actions">
                        <q-btn
                            class="remove"
                            flat
                            color="grey-8"
                            size="sm"
                            label="Datensatz entfernen"
                            icon="delete"
                            @click="dialogRemoveSeries = { show: true, item }"
                        />
                    </div>
                </div>
            </q-expansion-item>
        </q-list>

        <q-btn
            label="Datensatz hinzufügen"
            color="primary"
            outline
            icon="add"
            @click="addSeries"
        />

        <q-dialog v-model="dialogRemoveSeries.show">
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
    </div>
</template>

<script>
import { mapState } from 'pinia'
import { useChartDataStore } from '@/stores/chart-data'
import RangeSelect from '@/components/RangeSelect.vue'

export default {
    inject: ['filters'],

    components: {
        RangeSelect,
    },

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
        }
    },

    computed: {
        ...mapState(useChartDataStore, ['seriesList']),
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

    .name {
        margin-top: 0.3rem;
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
