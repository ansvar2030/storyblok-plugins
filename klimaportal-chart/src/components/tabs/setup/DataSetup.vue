<template>
    <div class="data-setup">
        <q-dialog v-model="dialogChooseTemplate.show">
            <q-card>
                <q-card-section>
                    <div class="text-h6">Template auswählen</div>
                </q-card-section>

                <q-separator />

                <q-card-section
                    style="max-height: 50%"
                    class="scroll"
                >
                    <q-field
                        :error="dialogChooseTemplate.error.name === 'template'"
                        :error-message="dialogChooseTemplate.error.message"
                        no-error-icon
                    >
                        <q-list bordered>
                            <q-item
                                v-for="item of templates"
                                :key="item.id"
                            >
                                <q-item-section
                                    side
                                    top
                                >
                                    <q-radio
                                        v-model="dialogChooseTemplate.id"
                                        :val="item.id"
                                    />
                                </q-item-section>
                                <!-- clickable
                                v-ripple
                                :href="item.link"
                                target="_blank" -->
                                <q-item-section>{{ item.name }}</q-item-section>
                                <q-item-section avatar>
                                    <q-btn
                                        color="primary"
                                        icon="launch"
                                        type="a"
                                        round
                                        :href="item.link"
                                        target="_blank"
                                    />
                                </q-item-section>
                                <!-- <q-item-section avatar>
                                    <q-btn
                                        color="primary"
                                        icon="file_copy"
                                        type="a"
                                        round
                                        :href="item.link"
                                        target="_blank"
                                    />
                                </q-item-section> -->
                            </q-item>
                        </q-list>
                    </q-field>
                </q-card-section>

                <q-separator />

                <q-card-section>
                    <q-input
                        v-model="dialogChooseTemplate.name"
                        label="Name des Sheets"
                        :error="dialogChooseTemplate.error.name === 'name'"
                        :error-message="dialogChooseTemplate.error.message"
                    />
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn
                        flat
                        label="Abbrechen"
                        color="primary"
                        v-close-popup
                    />
                    <q-btn
                        label="Kopieren"
                        icon="file_copy"
                        color="secondary"
                        @click="validateTemplateData"
                        :loading="dialogChooseTemplate.loading"
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <div class="data-row">
            <div class="sheet-selection">
                <div class="sheet">
                    <q-select
                        v-if="sheetManager.communityFolder.sheets.length > 0"
                        v-model="sheetManager.sheetId"
                        :options="sheetManager.communityFolder.sheets"
                        emit-value
                        option-value="id"
                        option-label="name"
                        map-options
                        clearable
                        label="Sheet auswählen"
                        hint="Sammle alle Daten für dieses Diagramm in einem Google Spreadsheet."
                    ></q-select>
                </div>

                <q-btn
                    v-show="sheetManager.sheet?.link"
                    color="primary"
                    icon="launch"
                    type="a"
                    round
                    :href="sheetManager.sheet?.link"
                    target="_blank"
                />
            </div>

            <div class="x-axis-range">
                <RangeSelect
                    ref="xAxisRange"
                    label="Bereich für X-Achse"
                    :sheet="chartData.xAxis.range.sheet"
                    :range="chartData.xAxis.range.text"
                    @update:range-details="(val) => (xAxis.rangeDetails = val)"
                    @update:data="(val) => (xAxis.data = val)"
                />
            </div>

            <div class="buttons">
                <q-btn
                    color="primary"
                    flat
                    dense
                    icon="refresh"
                    label="Sheets neu laden"
                    @click="reloadSheets"
                    :loading="loadingSheets"
                />
                <q-btn
                    color="secondary"
                    flat
                    dense
                    label="Neues Sheet"
                    @click="dialogChooseTemplate.show = true"
                />
                <q-btn
                    outline
                    class="reload-data"
                    label="Daten neu laden"
                    icon="refresh"
                    :loading="chartData.loading"
                    @click="() => chartData.reloadData()"
                />
            </div>
        </div>

        <div class="example">
            <label class="form-label">Beispiel</label>

            <img
                :src="`/sheet-example.svg`"
                alt=""
                width="1028"
                height="182"
            />
        </div>
    </div>
</template>

<script>
import { mapState } from 'pinia'
import { useSheetManagerStore } from '@/stores/sheet-manager'
import { useChartDataStore } from '@/stores/chart'
import RangeSelect from '@/components/RangeSelect.vue'

export default {
    components: {
        RangeSelect,
    },

    setup() {
        const chartData = useChartDataStore()
        const sheetManager = useSheetManagerStore()

        return {
            chartData,
            sheetManager,
        }
    },

    data() {
        return {
            template: undefined,
            xAxis: {
                rangeDetails: {},
                data: [],
            },

            dialogChooseTemplate: {
                show: false,
                loading: false,
                id: '',
                name: '',
                error: {
                    name: '',
                    message: '',
                },
            },

            loadingSheets: false,
        }
    },

    computed: {
        ...mapState(useSheetManagerStore, ['templates']),

        selectedTemplate() {
            return this.templates.find(
                (template) => template.id === this.dialogChooseTemplate.id,
            )
        },
    },

    methods: {
        validateTemplateData() {
            if (this.dialogChooseTemplate.id === '') {
                this.dialogChooseTemplate.error.name = 'template'
                this.dialogChooseTemplate.error.message =
                    'Bitte wähle ein Template aus'
                return
            }

            if (this.dialogChooseTemplate.name === '') {
                this.dialogChooseTemplate.error.name = 'name'
                this.dialogChooseTemplate.error.message =
                    'Bitte gib einen Namen ein'
                return
            }

            this.dialogChooseTemplate.error.name = ''
            this.dialogChooseTemplate.error.message = ''

            if (this.dialogChooseTemplate.loading) {
                return
            }
            this.dialogChooseTemplate.loading = true

            this.sheetManager
                .copyTemplate(
                    this.dialogChooseTemplate.id,
                    this.dialogChooseTemplate.name,
                )
                .then(({ id }) => {
                    this.dialogChooseTemplate.loading = false
                    this.dialogChooseTemplate.show = false
                    this.sheetManager.sheetId = id
                })
                .catch((error) => {
                    this.dialogChooseTemplate.loading = false
                    this.dialogChooseTemplate.error.name = 'template'
                    this.dialogChooseTemplate.error.message = error.message
                })
        },

        reloadSheets() {
            if (this.loadingSheets) {
                return
            }

            this.loadingSheets = true
            this.sheetManager.getSheets().then(() => {
                this.loadingSheets = false
            })
        },
    },

    watch: {
        'xAxis.rangeDetails': {
            handler() {
                this.chartData.xAxis.range = this.xAxis.rangeDetails
            },
            deep: true,
        },
        'xAxis.data': {
            handler() {
                this.chartData.xAxis.categories = this.xAxis.data
            },
            deep: true,
        },
    },
}
</script>

<style scoped lang="scss">
.data-row {
    display: flex;
    flex-flow: row wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--k-gap);
    margin: 0 0 1.5rem;
}

// .sheet-selection,
// .x-axis-range {
//     // width: min-content;
//     // width: 30%;
//     // flex: auto 0 0;
// }

.sheet-selection {
    padding-top: 0.25rem;
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    justify-content: flex-start;
    gap: var(--k-gap);
    width: 50%;
    flex: auto 0 0;

    .q-select {
        flex: auto 1 0;
        // margin: 0 0 0.5rem;
    }

    .q-btn {
        margin-top: 0.875rem;
        flex: none;
    }

    .sheet {
        flex: auto 1 0;
    }
}

.x-axis-range {
    // padding-top: 1.25rem;
    //     display: flex;
    //     flex-flow: row nowrap;
    //     align-items: center;
    //     justify-content: flex-end;
}

.buttons {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--k-gap);
    width: 100%;
}

.reload-data {
    margin-left: auto;
}

.example {
    .form-label {
        display: block;
        margin: 0 0 1rem;
    }
}
</style>
