<template>
    <div :class="[model.plugin]">
        <multiselect
            v-if="options.disable_create"
            v-model="list"
            :options="selectOptions"
            :taggable="true"
            :multiple="true"
            :preselect-first="true"
            :close-on-select="false"
            :clear-on-select="false"
            :preserve-search="true"
            :placeholder="'Select items'"
            @open="loadOptions"
            :max-height="200"
        >
        </multiselect>
        <multiselect
            v-else
            v-model="list"
            :options="selectOptions"
            :taggable="true"
            :multiple="true"
            :preselect-first="true"
            :close-on-select="false"
            :clear-on-select="false"
            :preserve-search="true"
            :placeholder="'Select or type to create new'"
            @tag="addOption"
            @open="loadOptions"
            :max-height="200"
        >
        </multiselect>
    </div>
</template>

<script>
    // Shared Tags

    // A multi-select field with the possibility to create new entries on-the-fly. Share suggestions based on ContentTypes.

    // Parameters:
    // - content_type event
    // - starts_with {0}/{1}/
    // - key field_name
    // - disable_create: don't allow creation of tags
    // - content_type_field: path, set content type based on another field
    // - default: default tags

    const pluginName = 'lc-shared-tags'
    import Multiselect from 'vue-multiselect'

    export default {
        mixins: [window.Storyblok.plugin],
        components: {
            Multiselect,
        },

        data() {
            const list = []
            const selectOptions = []

            const key = this.$props.contentmodel.list
                ? 'list'
                : this.$props.contentmodel.tags
                ? 'tags'
                : false

            if (key) {
                for (let tag of this.$props.contentmodel[key]) {
                    selectOptions.push(tag)
                    list.push(tag)
                }
            }

            return {
                selectOptions,
                list,
                loading: false,
                optionsLoaded: false,
            }
        },

        methods: {
            initWith() {
                return {
                    plugin: pluginName,
                    list: [],
                    changed: false,
                }
            },

            findContentBlok(uid, list) {
                for (let value of Object.values(list)) {
                    if (!value || typeof value !== 'object') {
                        continue
                    }

                    if (Array.isArray(value)) {
                        const result = this.findContentBlok(uid, value)
                        if (result) {
                            return result
                        }
                    } else if (value._uid === uid) {
                        return value
                    } else {
                        const result = this.findContentBlok(uid, value)
                        if (result) {
                            return result
                        }
                    }
                }

                return false
            },

            pluginCreated() {
                // legacy
                if (!this.model.list) {
                    this.model.list = []
                }

                if (
                    this.list.length === 0 &&
                    !this.model.changed &&
                    this.options.default
                ) {
                    const defaultTags = this.options.default
                        .replace(/\s*,\s*/g, ',')
                        .split(',')

                    for (const tag of defaultTags) {
                        this.list.push(tag)
                    }
                }

                // console.log(pluginName, 'created', this)
            },

            isTagsChanged() {
                const tagsModel = [...this.model.list]
                const tagsList = [...this.list]

                return tagsModel.sort().join(';') !== tagsList.sort().join(';')
            },

            addOption(text) {
                const value = (text || '').trim()
                this.selectOptions.push(value)
                this.list.push(value)
            },

            loadOptions() {
                if (this.optionsLoaded || this.loading) {
                    return
                }

                let starts_with = this.options.starts_with || undefined
                if (starts_with && this.storyItem?.full_slug) {
                    let parts = this.storyItem.full_slug.split('/')
                    starts_with = starts_with.replaceAll(
                        /\{(\d)\}/g,
                        (_match, index) => parts[index] || '',
                    )
                }

                this.loading = true

                let contentType
                if (this.options.content_type) {
                    contentType = this.options.content_type
                } else if (!contentType && this.options.content_type_field) {
                    const contentBlok = this.findContentBlok(
                        this.blockId,
                        this.storyItem.content,
                    )

                    let type =
                        contentBlok &&
                        contentBlok[this.options.content_type_field]

                    if (typeof type === 'string' && type.length) {
                        contentType = type
                    }
                }

                this.api
                    .get('cdn/stories', {
                        version: 'draft',
                        content_type: contentType,
                        starts_with,
                    })
                    .then((result) => result.data.stories)
                    .then((stories) => {
                        const tags = {}

                        for (let tag of this.list) {
                            if (tag) {
                                tags[tag] = true
                            }
                        }

                        stories.forEach((story) => {
                            for (let [key, value] of Object.entries(
                                story.content,
                            )) {
                                if (
                                    typeof value === 'object' &&
                                    value.plugin === this.model.plugin &&
                                    (this.options.key
                                        ? key === this.options.key
                                        : true) &&
                                    Array.isArray(value.list)
                                ) {
                                    for (let tag of value.list) {
                                        let text = (tag + '').trim()
                                        if (text) {
                                            tags[text] = true
                                        }
                                    }
                                }
                            }
                        })

                        return Object.keys(tags).sort((a, b) =>
                            a
                                .toLocaleLowerCase()
                                .localeCompare(b.toLocaleLowerCase()),
                        )
                    })
                    .then((list) => {
                        this.loading = false
                        this.optionsLoaded = true

                        this.selectOptions.length = 0
                        for (let tag of list) {
                            this.selectOptions.push(tag)
                        }
                    })
                    .catch((error) => {
                        console.warn(error)
                        this.loading = false
                    })
            },
        },
        watch: {
            // model: {
            //     handler: function (value) {
            //         console.log('model changed!', value)
            //     },
            //     deep: true,
            // },
            list: {
                handler: function (value) {
                    if (this.isTagsChanged()) {
                        this.model.list = [...value]
                        this.model.changed = true
                        this.$emit('changed-model', this.model)
                    }
                },
                deep: true,
            },
        },
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss">
    .lc-shared-tags {
        position: relative;
        height: 250px;
        overflow: hidden;
    }

    .multiselect {
        &__tag {
            background-color: #dfe3e8;
            color: #1b243f;
            font-size: 14px;
            font-weight: 500;
            border-radius: 5px;

            &-icon {
                line-height: 19px;

                &:after {
                    color: #1b243f;
                }

                &:hover {
                    background-color: #00b3b0;
                }
            }
        }

        &__input {
            padding: 0;
        }

        &__placeholder {
            font-size: 16px;
            padding: 0;
        }

        &__option {
            display: flex;
            flex-flow: row nowrap;
            font-weight: 500;
            align-items: center;
            color: #1b243f;
            background-color: #fff;
            transition: color 0.1s, background-color 0.1s;

            &::after {
                display: none;
            }

            &::before {
                content: '✓';
                display: inline-block;
                margin-right: 0.5rem;
                color: #1b243f;
                opacity: 0;
                transition: opacity 0.2s;
            }

            &--highlight {
                color: #fff;
                background-color: #00b3b0;
            }

            &--selected {
                color: #1b243f;
                background-color: #fff;
                font-weight: 500;

                &::before {
                    opacity: 1;
                }

                &.multiselect__option--highlight {
                    color: #fff;
                    background-color: #00b3b0;
                }
            }
        }
    }
</style>
