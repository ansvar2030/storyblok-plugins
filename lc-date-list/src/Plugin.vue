<template>
    <div :class="[model.plugin]">
        <ul>
            <li v-for="(item, index) of dates" :key="index">
                <sl-input
                    class=""
                    type="date"
                    :value="item.value"
                    @sl-input="
                        (ev) => {
                            item.value = ev.target.value
                        }
                    "
                />
                <sl-icon-button
                    name="x-circle"
                    label="Remove"
                    @click.prevent.stop="removeItem(item)"
                ></sl-icon-button>
            </li>
        </ul>
        <div class="actions">
            <sl-button
                variant="default"
                size="medium"
                @click.prevent.stop="addItem"
            >
                <sl-icon slot="prefix" name="plus-lg"></sl-icon>
                Add Date
            </sl-button>
        </div>
    </div>
</template>

<script>
    // List of dates
    const pluginName = 'lc-date-list'

    const tzOffset = new Date().getTimezoneOffset() / -60
    const tzDiff = tzOffset >= 0 ? '+' : '-'
    const timezone = tzDiff + ('' + Math.abs(tzOffset)).padStart(2, '0')

    function toGMTDateString(date) {
        const pad = (n) => `${n}`.padStart(2, '0')

        return (
            date.getFullYear() +
            '-' +
            pad(date.getMonth() + 1) +
            '-' +
            pad(date.getDate())
        )
    }

    function convertToGMT(str) {
        const date = new Date(str + ' UTC')
        if (isNaN(date)) {
            return null
        }

        return toGMTDateString(date)
    }

    export default {
        mixins: [window.Storyblok.plugin],

        data() {
            const dates = []
            const list = this.$props.contentmodel.list

            if (list && list.length) {
                for (const value of list) {
                    dates.push({ value: convertToGMT(value) })
                }
            } else {
                dates.push({ value: null })
            }

            return {
                dates,
            }
        },

        methods: {
            initWith() {
                return {
                    plugin: pluginName,
                    list: [],
                }
            },
            addItem() {
                let list = this.dates
                list = list.filter((i) => !!i.value)
                list.push({ value: null })
                this.dates = list
            },
            removeItem(item) {
                if (this.dates.length === 1) {
                    this.dates[0].value = null
                } else {
                    this.dates = this.dates.filter((i) => i !== item)
                }
            },
        },
        computed: {
            filteredList() {
                return this.dates.filter((i) => !!i.value)
            },
        },
        watch: {
            dates: {
                handler: function () {
                    this.model.list = this.dates
                        .filter((i) => !!i.value)
                        .map((i) => {
                            let str = new Date(
                                `${i.value}Z${timezone}`,
                            ).toISOString()

                            return str.replace('T', ' ').substring(0, 16)
                        })

                    this.$emit('changed-model', this.model)
                },
                deep: true,
            },
        },
    }
</script>

<style lang="scss">
    .lc-date-list {
        position: relative;
        padding: 0.25rem;
        font-size: 20px;
        max-width: 200px;
        --sl-button-font-size-medium: 14px;

        ul {
            list-style-type: none;
            padding: 0;
        }

        li {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.5rem;

            sl-input {
                flex: auto 1 0;
            }
        }

        .actions {
            display: flex;
            flex-flow: column;
            padding-right: 3rem;
        }
    }
</style>
