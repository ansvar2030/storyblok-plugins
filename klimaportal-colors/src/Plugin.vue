<template>
    <div :class="[model.plugin]">
        <ul class="color-table">
            <li
                v-for="item of filteredColors"
                :key="item.path"
                :class="[
                    {
                        active:
                            selectedColor &&
                            selectedColor.name.slice(0, item.path.length) ===
                                item.path,
                    },
                ]"
            >
                <span class="name">{{ getNameByPath(item.path) }}</span>
                <div
                    v-for="{ key, value } of item.colors"
                    :key="key"
                    :class="[
                        'color',
                        {
                            active:
                                selectedColor &&
                                selectedColor.name === item.path + '.' + key,
                        },
                    ]"
                    :style="{ backgroundColor: value, '--b-color': value }"
                    :title="key"
                    @click.prevent.stop="
                        selectedColor =
                            selectedColor &&
                            selectedColor.name === item.path + '.' + key
                                ? null
                                : { name: item.path + '.' + key, value }
                    "
                ></div>
            </li>
        </ul>
    </div>
</template>

<script>
    const colors = {
        primary: {
            dark: '#0d89ff',
            base: '#0d89ff',
            light: '#0d89ff',
        },
        secondary: {
            dark: '#0eb232',
            base: '#0eb232',
            light: '#0eb232',
        },

        gray: {
            900: '#0f172a',
            800: '#1e293b',
            700: '#334155',
            600: '#475569',
            500: '#64748b',
            400: '#94a3b8',
            300: '#cbd5e1',
            200: '#e2e8f0',
            100: '#f1f5f9',
            50: '#f8fafc',
        },

        palette: {
            red: {
                900: '#ff0035',
                600: '#ff506a',
                300: '#f9a3a8',
            },
            orange: {
                900: '#ff7614',
                600: '#ff9b54',
                300: '#ffcf96',
                100: '#fef5d4',
            },
            yellow: {
                900: '#ffbe05',
                600: '#fbce50',
                300: '#ffec96',
                100: '#fffce4',
            },
            lemon: {
                900: '#ffdc05',
                600: '#fbe662',
                300: '#fcf6b1',
            },
            moss: {
                900: '#a0d50a',
                600: '#aadc41',
                300: '#c6f18f',
                100: '#e6fed3',
            },
            green: {
                900: '#20b54f',
                600: '#62c882',
                300: '#a7e3b4',
                100: '#e3fef2',
            },
            cyan: {
                900: '#14a5a3',
                600: '#51b7b5',
                300: '#75d8de',
                100: '#eafdff',
            },
            blue: {
                900: '#2b6bb5',
                600: '#4983d9',
                300: '#87b0ff',
            },
            purple: {
                900: '#9534b7',
                600: '#ae53ce',
                300: '#c08df5',
            },
            pink: {
                900: '#d90e83',
                600: '#e945a3',
                300: '#ea88cf',
            },
        },
    }

    function generateColorList(colors, prefix = '') {
        const list = []
        for (const key in colors) {
            const value = colors[key]

            if (typeof value === 'object') {
                const path = prefix ? prefix + '.' + key : key
                const subList = generateColorList(value, path)
                list.push(...subList)
                // console.log(subList)
                // for (const item of subList) {
                //     list.push({
                //         name: path + '.' + item.name,
                //         colors: item.colors,
                //     })
                // }
            } else if (typeof value === 'string') {
                list.push({
                    path: prefix,
                    colors: Object.entries(colors)
                        .reverse()
                        .map((color) => ({ key: color[0], value: color[1] })),
                })
                break
                // for (const [name, color] of Object.entries())
            }
        }

        return list
    }

    // console.log(generateColorList(colors))

    // Select a color

    // Parameters:
    // - filter comma separated list of color names
    //   e.g. palette.red, secondary

    const pluginName = 'klimaportal-colors'

    export default {
        mixins: [window.Storyblok.plugin],

        data() {
            let selectedColor = null
            if (this.$props.contentmodel.value) {
                selectedColor = {
                    name: this.$props.contentmodel.name,
                    value: this.$props.contentmodel.value,
                }
            }

            return {
                flatColors: generateColorList(colors),
                selectedColor,
            }
        },

        methods: {
            initWith() {
                return {
                    plugin: pluginName,
                    value: null,
                    name: null,
                }
            },

            getNameByPath(path) {
                const parts = path.split('.')
                return parts
                    .map(
                        (part) =>
                            part.slice(0, 1).toUpperCase() + part.slice(1),
                    )
                    .join(' ')
            },
        },

        computed: {
            filteredColors() {
                if (!this.options.filter) {
                    return this.flatColors
                }

                const filter = (this.options.filter || '')
                    .replace(/\s/g, '')
                    .split(',')
                const list = []
                for (const f of filter) {
                    for (const item of this.flatColors) {
                        if (item.path.slice(0, f.length) === f) {
                            list.push(item)
                            break
                        }
                    }
                }

                return list
            },
        },

        watch: {
            selectedColor: {
                handler: function (color) {
                    if (color) {
                        this.model.value = color.value
                        this.model.name = color.name
                    } else {
                        this.model.value = null
                        this.model.name = null
                    }

                    this.$emit('changed-model', this.model)
                },
                deep: true,
            },
        },
    }
</script>

<style lang="scss">
    .klimaportal-colors {
        position: relative;

        .color-table {
            padding: 0;
            margin: 0;
            list-style: none;
            background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
            background-color: #dfe3e8;
            color: #1b243f;
            font-size: 14px;
            font-weight: 500;
            border-radius: 5px;
            border: 1px solid #dfe3e8;

            li {
                display: flex;
                flex-flow: row nowrap;
                user-select: none;
                padding: 0.25rem 0.5rem;
                border-top: 2px solid transparent;
                border-bottom: 2px solid transparent;
                transition: border-color 0.25s;

                &.active,
                &:hover {
                    border-color: #fff;
                }
            }

            .name {
                display: block;
                width: 15ch;
            }

            .color {
                --b-color: transparent;
                position: relative;
                display: block;
                width: 1.25rem;
                height: 1.25rem;
                border: 2px solid #fff;
                outline: 1px solid transparent;
                box-shadow: 0 0 2px 1px transparent;
                cursor: pointer;
                overflow: hidden;
                flex: auto 0 0;
                transition: border 0.25s, box-shadow 0.25s, outline 0.25s;

                &:hover {
                    z-index: 10;
                    box-shadow: -2px -2px 2px 1px rgba(#ccc, 0.75),
                        2px 2px 2px 1px rgba(#666, 0.75);
                }

                &.active {
                    z-index: 5;
                    outline: 1px solid #000;
                }
            }
        }
    }
</style>
