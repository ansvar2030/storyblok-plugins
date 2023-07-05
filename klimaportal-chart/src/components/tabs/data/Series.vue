<template>
    <div class="series-list">
        <q-list bordered>
            <q-expansion-item
                v-for="(item, index) of seriesList"
                :key="item.id"
                group="group"
                :icon="item.show ? 'dataset_linked' : 'visibility_off'"
                :header-style="{ color: item?.color?.hex }"
                :label="item.name || 'Neuer Datensatz'"
                :model-value="index === openedIndex"
                @update:model-value="
                    (value) => (value ? (openedIndex = index) : true)
                "
                class="series-item"
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
                                :key="item.id"
                                :sheet="item.range.sheet"
                                :range="item.range.text"
                                label="Datenbereich"
                                @update:range-details="
                                    (val) => (item.range = val)
                                "
                                @update:data="(val) => (item.data = val)"
                                hint="Gib den Bereich aus deinem GoogleSheet für diesen Datensatz an."
                            />
                        </div>
                    </div>

                    <div class="row">
                        <div class="option bottom">
                            <q-btn-dropdown outline>
                                <template v-slot:label>
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
                                <q-color
                                    :model-value="item.color?.hex"
                                    label="Farbe"
                                    defaultView="palette"
                                    no-header
                                    no-header-tabs
                                    no-footer
                                    :palette="colorPaletteFlat"
                                    @update:model-value="
                                        (value) =>
                                            (item.color = colorPalette.find(
                                                (c) => c.hex === value,
                                            ))
                                    "
                                />
                            </q-btn-dropdown>
                            <!-- <q-select
                                v-model="item.color"
                                :options="colorPalette"
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
                            </q-select> -->
                        </div>

                        <div class="option">
                            <q-select
                                v-model="item.type"
                                :options="seriesTypeOptions"
                                emit-value
                                map-options
                                label="Typ"
                            />
                        </div>
                    </div>

                    <div class="row">
                        <div class="option">
                            <q-select
                                label="Einheit"
                                :model-value="item.unit"
                                emit-value
                                use-input
                                hide-selected
                                fill-input
                                :options="unitOptions"
                                options-dense
                                @blur="(ev) => (item.unit = ev.target.value)"
                                ><template v-slot:option="scope">
                                    <q-item-label
                                        header
                                        v-if="scope.opt.group"
                                        v-bind="scope.itemProps"
                                        >{{ scope.opt.group }}</q-item-label
                                    >
                                    <q-item
                                        v-else
                                        v-bind="scope.itemProps"
                                        v-on="scope"
                                    >
                                        <q-item-section>
                                            <q-item-label>{{
                                                scope.opt.label
                                            }}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </template></q-select
                            >
                        </div>

                        <div class="option toggles">
                            <q-field
                                label="Daten-Labels"
                                borderless
                                model-value=" "
                            >
                                <q-toggle v-model="item.dataLabel" />
                            </q-field>
                            <q-field
                                label="Sichtbarkeit"
                                borderless
                                model-value=" "
                            >
                                <q-toggle v-model="item.show" />
                            </q-field>
                        </div>
                    </div>

                    <div class="row">
                        <div class="option">
                            <q-select
                                v-model="item.style.stroke"
                                :options="strokeStyleOptions"
                                label="Strich-Stil"
                            ></q-select>
                        </div>

                        <div class="option">
                            <q-select
                                v-model="item.style.fill"
                                :options="fillStyleOptions"
                                label="Flächen-Stil"
                            ></q-select>
                        </div>
                    </div>

                    <!-- <q-separator />
                    <div class="row">tooltip</div>

                    <q-separator />
                    <div class="row">yAxis</div> -->

                    <q-separator />
                    <div class="actions">
                        <q-btn
                            :class="['move-up', { invisible: index === 0 }]"
                            flat
                            color="grey-8"
                            size="sm"
                            label="Nach oben"
                            icon="arrow_upward"
                            @click="() => moveSeriesUp(index)"
                        />
                        <q-btn
                            :class="[
                                'move-down',
                                { invisible: index === seriesList.length - 1 },
                            ]"
                            flat
                            color="grey-8"
                            size="sm"
                            label="Nach unten"
                            icon="arrow_downward"
                            @click="() => moveSeriesDown(index)"
                        />
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
import { useChartDataStore } from '@/stores/chart'
import RangeSelect from '@/components/RangeSelect.vue'
import {
    colorPalette,
    seriesTypeOptions,
    unitOptions,
    strokeStyleOptions,
    fillStyleOptions,
} from '@/stores/chart/options'

export default {
    inject: ['filters'],

    components: {
        RangeSelect,
    },

    setup() {
        const chartData = useChartDataStore()

        return {
            chartData,
            // options
            colorPalette,
            seriesTypeOptions,
            unitOptions,
            strokeStyleOptions,
            fillStyleOptions,
        }
    },

    data() {
        return {
            openedIndex: 0,
            dialogRemoveSeries: { show: false, item: undefined },

            rangeRefs: {},
        }
    },

    computed: {
        ...mapState(useChartDataStore, ['seriesList']),
        colorPaletteFlat() {
            return this.colorPalette.map((item) => item.hex)
        },
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

        moveSeriesUp(index) {
            if (index === 0) return
            this.moveSeries(index, index - 1)
        },

        moveSeriesDown(index) {
            if (index === this.seriesList.length - 1) return
            this.moveSeries(index, index + 1)
        },

        moveSeries(from, to) {
            const copy = this.seriesList[to]
            this.seriesList[to] = this.seriesList[from]
            this.seriesList[from] = copy
            this.openedIndex = to
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

    > .row {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: 1fr;
        gap: var(--k-gap);
    }

    .option {
        &.bottom {
            display: flex;
            align-items: flex-end;
        }

        &.toggles {
            display: flex;
            flex-flow: row;
            align-items: center;
            // justify-content: space-between;

            .q-field {
                // flex: auto 1 1;
                width: 5.5rem;
            }
        }
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
    padding: 0 0 0 0.25rem;
    text-transform: none;

    .q-item__label {
        line-height: 1 !important;
    }
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

.invisible {
    visibility: hidden;
    pointer-events: none;
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
