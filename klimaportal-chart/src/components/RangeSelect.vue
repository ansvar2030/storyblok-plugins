<template>
    <div class="range-select">
        <label class="form-label">{{ label }}</label>

        <div class="input-row">
            <q-select
                class="sheet-name"
                :modelValue="inputSheetName"
                @update:model-value="updateSheet"
                :options="sheetManager.sheetNames"
                emit-value
                dense
            >
                <template v-slot:after> ! </template>
            </q-select>

            <q-input
                v-model="inputRangeRaw"
                placeholder="D2:D13"
                dense
                no-error-icon
                :rules="[validateRange]"
                @blur="updateRange"
                ><template v-slot:append>
                    <q-btn
                        icon="wysiwyg"
                        :loading="loading"
                        flat
                        round
                        @click="dialogDataPreview.show = true"
                    />
                </template>
            </q-input>
        </div>

        <div :class="['hint', { visible: !inputRange || isRangeValid }]">
            {{ hint }}
        </div>

        <q-dialog v-model="dialogDataPreview.show">
            <q-table
                :loading="loading"
                flat
                bordered
                dense
                class="preview-table-content"
                :title="loadedRange"
                :pagination="{
                    page: 1,
                    rowsPerPage: 15,
                }"
                :rows-per-page-options="[15]"
                :rows="previewTable.rows"
                :columns="previewTable.columns"
            />
        </q-dialog>
    </div>
</template>

<script>
import { useSheetManagerStore } from '@/stores/sheet-manager'

export default {
    emits: ['update:range-details', 'update:data'],

    props: {
        label: {
            type: String,
            default: 'Bereich auswählen',
        },
        sheet: {
            type: String,
            default: '',
        },
        range: {
            type: String,
            default: '',
        },
        hint: {
            type: String,
            default: '',
        },
    },
    setup() {
        const sheetManager = useSheetManagerStore()

        return {
            sheetManager,
        }
    },

    data() {
        return {
            inputRangeRaw: this.range,
            inputSheetName: this.sheet,

            nextRange: '',
            loadedRange: '',
            loading: false,
            loadRangeDataPromise: null,
            data: [],

            dialogDataPreview: {
                show: false,
            },
        }
    },

    computed: {
        inputRange() {
            if (!this.inputRangeRaw) {
                return ''
            }

            return this.inputRangeRaw.toUpperCase().trim()
        },

        isRangeValid() {
            return this.validateRange(this.inputRange) === true
        },

        fullRange() {
            const range = this.inputRange
            if (
                !this.inputSheetName ||
                !range ||
                this.validateRange(range) !== true
            ) {
                return ''
            }

            return `${this.inputSheetName}!${range}`
        },

        processedRange() {
            const result = {}

            if (!this.inputRange) {
                return {}
            }

            const text = this.inputRange
            result.text = text
            result.sheet = this.inputSheetName

            if (!text || !this.isRangeValid) {
                return result
            }

            const refs = text.split(':')
            if (refs.length !== 2) {
                return result
            }

            const [start, end] = refs.map((ref) => {
                const [column, rowStr] =
                    ref.match(/([A-Z]+)(\d+)/)?.slice(1) || []

                const row = parseInt(rowStr)
                const columnCharCode = column.charCodeAt(0)

                return {
                    row,
                    column,
                    columnCharCode,
                }
            })

            const direction =
                start.columnCharCode === end.columnCharCode
                    ? 'vertical'
                    : 'horizontal'

            return {
                ...result,
                start,
                end,
                direction,
            }
        },

        transformedData() {
            if (!this.data || !this.data.length) {
                return []
            }

            let series = []
            if (this.processedRange.direction === 'vertical') {
                series = this.data.map((row) => row[0])
            } else {
                series = this.data[0]
            }

            return series.filter(Boolean)
        },

        previewTable() {
            const table = {
                rows: [],
                columns: [],
            }

            if (this.data.length === 0) {
                return table
            }

            if (!this.processedRange.start || !this.processedRange.end) {
                return table
            }

            let columnCount = 0

            for (let ri = 0; ri < this.data.length; ri++) {
                const row = this.data[ri]
                const newRow = {
                    row: '' + (this.processedRange.start.row + ri),
                }

                for (let i = 0; i < row.length; i++) {
                    newRow['value' + (i + 1)] = row[i]
                }

                if (row.length > columnCount) {
                    columnCount = row.length
                }

                table.rows.push(newRow)
            }

            table.columns.push({
                name: 'row',
                label: '',
                field: 'row',
            })

            for (let i = 0; i < columnCount; i++) {
                const name = String.fromCharCode(
                    this.processedRange.start.columnCharCode + i,
                )
                table.columns.push({
                    name,
                    label: name,
                    field: 'value' + (i + 1),
                })
            }

            return table
        },
    },

    beforeUnmount() {
        if (this.loadRangeDataPromise) {
            this.loadRangeDataPromise.abort()
        }
    },

    methods: {
        validateRange(value) {
            if (
                !value ||
                !/^([A-Z]+\d+):([A-Z]+\d+)$/g.test(value.toUpperCase().trim())
            ) {
                return 'Ungültiger Bereich'
            }

            return true
        },

        updateRange() {
            if (!this.isRangeValid) {
                return
            }
            this.loadRangeData(this.fullRange)
        },

        loadRangeData(range, force = false) {
            console.log('loadRangeData', range, force, this.loadedRange)
            if (!range || (!force && this.loadedRange === range)) {
                return
            }

            if (this.loading) {
                this.nextRange = range
                return
            }

            this.loadedRange = range
            this.loading = true

            new Promise((resolve) => {
                console.log('waiting...')
                setTimeout(resolve, 5000)
            }).then(() => {
                console.log('loading...')
                this.loadRangeDataPromise = this.sheetManager
                    .getSheetData(this.sheetManager.sheetId, range)
                    .then((data) => {
                        this.data = data
                    })
                    .catch((error) => {
                        this.data = []
                        console.error(error)
                    })
                    .then(() => {
                        this.loading = false
                        this.loadRangeDataPromise = null

                        if (this.nextRange) {
                            const { nextRange } = this
                            this.nextRange = ''
                            this.loadRangeData(nextRange)
                        }
                    })
            })
        },

        updateSheet(val) {
            this.inputSheetName = val
        },

        reloadData() {
            if (this.fullRange) {
                this.loadRangeData(this.fullRange, true)
            }
        },
    },

    watch: {
        range(value) {
            this.inputRangeRaw = value
        },

        sheet: {
            handler(value) {
                if (!value) {
                    this.inputSheetName = ''
                    return
                }

                if (this.sheetManager.sheetNames.includes(value)) {
                    this.inputSheetName = value
                } else {
                    this.inputSheetName = ''
                }
            },
            immediate: true,
        },

        // fullRange: {
        //     handler(value) {
        //         if (value) {
        //             this.loadRangeData(value)
        //         }
        //     },
        // },

        processedRange: {
            handler(value) {
                this.$emit('update:range-details', value)
            },
        },

        transformedData: {
            handler(value) {
                this.$emit('update:data', value)
            },
        },

        // 'sheetManager.sheetNames': {
        //     handler() {
        //         console.log(
        //             'sheetNames',
        //             1,
        //             this.$props.sheet,
        //             2,
        //             this.inputSheetName,
        //         )
        //         if (
        //             this.$props.sheet &&
        //             this.inputSheetName !== this.$props.sheet &&
        //             this.sheetManager.sheetNames.includes(this.$props.sheet)
        //         ) {
        //             this.inputSheetName = this.$props.sheet
        //         } else {
        //             this.inputSheetName = ''
        //         }
        //     },
        //     immediate: true,
        // },
    },
}
</script>

<style scoped lang="scss">
.range-select {
    :deep(.q-select) {
        .q-field__control-container {
            overflow: hidden;
        }

        .q-field__after {
            padding: 0 0.5rem;
        }
    }

    .input-row {
        display: flex;
        flex-flow: row nowrap;
        align-items: flex-start;
        justify-content: flex-start;

        .q-field {
            padding-bottom: 0;
        }

        :deep(.q-input input) {
            text-transform: uppercase;
        }
    }

    .q-select {
        min-width: 150px;
    }

    .hint {
        margin-top: 0.5rem;
        opacity: 0;
        transition: opacity 0.25s;

        &.visible {
            opacity: 1;
        }
    }
}
</style>

<style lang="scss">
.preview-table-content {
    width: 75vw;
    // min-width: 75%;

    // :deep(.q-table) {
    tr {
        th {
            position: sticky;
            /* higher than z-index for td below */
            z-index: 2;
            /* bg color is important; just specify one */
            background: #00b4ff;
            text-align: center;
        }
    }

    td:first-child {
        position: sticky;
        left: 0;
        width: 6ch;
        background: #00b4ff;
        z-index: 2;
    }
    // }
}
</style>
