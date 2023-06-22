<template>
    <div :class="[model.plugin]">
        <multiselect
            v-if="options.disable_create"
            v-model="list"
            :options="selectOptions"
            label="name"
            track-by="value"
            :taggable="true"
            :multiple="true"
            :loading="loading"
            :preselect-first="true"
            :close-on-select="false"
            :clear-on-select="false"
            :preserve-search="true"
            :placeholder="'Select items'"
            :max-height="200"
        >
            <template slot="option" slot-scope="{ option }">
                <span class="indent" v-if="option.parent">—</span>
                {{ option.name }}
            </template>
        </multiselect>
        <multiselect
            v-else
            v-model="list"
            :options="selectOptions"
            label="name"
            track-by="value"
            :taggable="true"
            :multiple="true"
            :loading="loading"
            :preselect-first="true"
            :close-on-select="false"
            :clear-on-select="false"
            :preserve-search="true"
            :placeholder="'Select or type to create new'"
            @tag="addOption"
            :max-height="200"
        >
            <template slot="option" slot-scope="{ option }">
                <span class="indent" v-if="option.parent">—</span>
                {{ option.name }}
            </template>
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
    // - options: list of tags, or url. format: (string | { name, value })[] or nested objects with key: items

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

            return {
                selectOptions,
                list,
                loading: true,
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

                new Promise((resolve) => {
                    if (!this.options.options) {
                        return resolve()
                    }

                    if (/^https?:\/\//.test(this.options.options)) {
                        // is url
                        fetch(this.options.options)
                            .then((response) => {
                                if (!response.ok) {
                                    throw new Error('failed to load options')
                                }

                                return response.json()
                            })
                            .then((data) => {
                                if (!data || !data.length) {
                                    return
                                }

                                // check if data is nested
                                if (typeof data[0] === 'object') {
                                    if (data[0].items) {
                                        for (const item of data) {
                                            this.selectOptions.push({
                                                name: item.name,
                                                value: item.value,
                                            })

                                            for (const subItem of item.items) {
                                                this.selectOptions.push({
                                                    name: subItem.name,
                                                    value: subItem.value,
                                                    parent: item.value,
                                                })
                                            }
                                        }
                                    } else {
                                        for (const item of data) {
                                            this.selectOptions.push({
                                                name: item.name,
                                                value: item.value,
                                            })
                                        }
                                    }
                                } else {
                                    for (const item of data) {
                                        this.selectOptions.push(item)
                                    }
                                }
                            })
                            .catch((error) => {
                                console.warn(error)
                            })
                            .then(() => resolve())
                    } else {
                        const tags = this.options.options
                            .replace(/\s*,\s*/g, ',')
                            .split(',')

                        for (const tag of tags) {
                            this.selectOptions.push({
                                name: tag,
                                value: tag,
                            })
                        }

                        resolve()
                    }
                }).then(() => {
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

                    if (
                        this.options.content_type ||
                        this.options.content_type_field
                    ) {
                        const delay = Math.random() * 750 + 250
                        setTimeout(() => {
                            this.loadOptions(true)
                        }, delay)
                    } else {
                        this.tagsLoaded()
                        this.loading = false
                    }
                })

                console.log(pluginName, 'created', this)
            },

            tagsLoaded() {
                const key = this.$props.contentmodel.list
                    ? 'list'
                    : this.$props.contentmodel.tags
                    ? 'tags'
                    : false

                if (key) {
                    for (let tag of this.$props.contentmodel[key]) {
                        const newOption = { name: tag, value: tag }
                        const option = this.selectOptions.find(
                            (o) => o.value === tag,
                        )

                        if (option) {
                            this.list.push(option)
                        } else {
                            this.selectOptions.unshift(newOption)
                            this.list.push(newOption)
                        }
                    }
                }
            },

            isTagsChanged() {
                const tagsModel = [...this.model.list]
                const tagsList = [...this.list]

                return tagsModel.sort().join(';') !== tagsList.sort().join(';')
            },

            addOption(text) {
                const value = (text || '').trim()
                const option = { name: value, value }
                this.selectOptions.push(option)
                this.list.push(option)
            },

            fetchAllStories(url, query, page = 1) {
                const perPage = 100

                return this.api
                    .get(url, {
                        ...query,
                        per_page: perPage,
                        page,
                    })
                    .then((result) => {
                        if (result?.data?.stories?.length === perPage) {
                            return this.fetchAllStories(
                                url,
                                query,
                                page + 1,
                            ).then((stories) => {
                                return [...result.data.stories, ...stories]
                            })
                        }

                        return result.data.stories
                    })
            },

            loadOptions(force = false) {
                if ((this.optionsLoaded || this.loading) && !force) {
                    return
                }

                console.log('loading options')

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

                if (!contentType) {
                    this.loading = false
                    return
                }

                this.fetchAllStories('cdn/stories', {
                    version: 'draft',
                    content_type: contentType,
                    starts_with,
                })
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
                            this.selectOptions.push({
                                name: tag,
                                value: tag,
                            })
                        }

                        this.tagsLoaded()
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
                        this.model.list = value.map((i) => i.value)
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
        height: 300px;
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
            padding: 0 0.75rem;
            min-height: 2rem;
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
                margin-right: 0.75rem;
                color: #1b243f;
                opacity: 0;
                transition: opacity 0.2s, color 0.1s;
            }

            &--highlight {
                color: #fff;
                background-color: #00b3b0;

                &::before {
                    color: #fff;
                }
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

            .indent {
                margin-right: 0.75rem;
            }
        }
    }
</style>
