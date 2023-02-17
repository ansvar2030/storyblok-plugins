<template>
    <div :class="[model.plugin]">
        <div class="icon-table">
            <div
                class="group"
                v-for="(icons, group) in filteredIconGroups"
                :key="group"
            >
                <div
                    v-for="(svg, name) in icons"
                    :key="name"
                    :class="['icon', { active: selectedIcon === name }]"
                    @click.prevent.stop="
                        selectedIcon = selectedIcon === name ? null : name
                    "
                    :title="formatName(name)"
                    v-html="svg"
                ></div>
            </div>
        </div>
    </div>
</template>

<script>
    function mapFiles(context) {
        const keys = context.keys()
        const values = keys.map(context)

        const groups = {}
        for (const [index, key] of keys.entries()) {
            const sKey = key.slice(2, -4)
            const parts = sKey.split('/')
            parts.pop()
            const groupKey = parts.join('_')

            if (!groups[groupKey]) {
                groups[groupKey] = {}
            }
            groups[groupKey][sKey] = values[index]
        }

        return groups

        // return keys.reduce(
        //     (accumulator, key, index) => ({
        //         ...accumulator,
        //         [key.slice(2, -4)]: values[index],
        //     }),
        //     {},
        // )
    }
    const iconGroups = mapFiles(
        require.context('!svg-inline-loader!./icons/', true, /\.(svg)$/),
    )

    // Select an icon

    // Parameters:
    // - filter: comma separated list of group names
    //   e.g. contact

    const pluginName = 'klimaportal-icons'

    export default {
        mixins: [window.Storyblok.plugin],

        data() {
            console.log(iconGroups)
            return {
                iconGroups,
                selectedIcon: this.$props.contentmodel.name || null,
            }
        },

        computed: {
            filteredIconGroups() {
                if (!this.options.filter) {
                    return this.iconGroups
                }

                const names = this.options.filter.replace(/\s/g, '').split(',')
                const filtered = {}
                for (const key in this.iconGroups) {
                    if (names.includes(key)) {
                        filtered[key] = this.iconGroups[key]
                    }
                }
                return filtered
            },
        },

        methods: {
            initWith() {
                return {
                    plugin: pluginName,
                    name: null,
                }
            },

            formatName(name) {
                return name.replace(/\//g, ' / ').replace(/-/g, ' ')
            },
        },

        watch: {
            selectedIcon: {
                handler: function (name) {
                    this.model.name = name || null
                    this.$emit('changed-model', this.model)
                },
                deep: true,
            },
        },
    }
</script>

<style lang="scss">
    .klimaportal-icons {
        position: relative;

        .icon-table {
            display: flex;
            flex-flow: column wrap;
            align-items: center;
            justify-content: flex-start;
            gap: 0.25rem;
            padding: 0.5rem;
            margin: 0;
            list-style: none;
            // background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
            background-color: #fff;
            color: #1b243f;
            font-size: 14px;
            font-weight: 500;
            border-radius: 5px;
            border: 1px solid #dfe3e8;

            .group {
                display: flex;
                width: 100%;
                flex-flow: row wrap;
                align-items: center;
                justify-content: flex-start;
                gap: 0.25rem;
            }

            .icon {
                position: relative;
                display: block;
                width: 1.75rem;
                height: 1.75rem;
                padding: 0.25rem;
                overflow: hidden;
                color: #000;
                border: 1px solid #eee;
                cursor: pointer;
                box-shadow: 0 0 2px 2px rgba(#fff, 0);
                border-radius: 3px;
                background-color: transparent;
                transition: color 0.25s, border-color 0.25s, box-shadow 0.25s,
                    background-color 0.25s;

                &.active {
                    color: #fff;
                    background-color: #00b3b0;
                }

                &:hover {
                    border-color: #00b3b0;
                    box-shadow: 0 0 2px 1px rgba(#00b3b0, 0.25);
                }

                svg {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
</style>
