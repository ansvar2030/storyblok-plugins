<template>
    <div :class="[model.plugin]">
        <multiselect
            v-if="options.disable_create"
            ref="multiselect"
            v-model="list"
            :options="selectOptions"
            label="name"
            track-by="value"
            :customLabel="(item) => item?.nameWithParent || item.name"
            :taggable="true"
            :multiple="true"
            :loading="loading"
            :preselect-first="true"
            :close-on-select="false"
            :clear-on-select="false"
            :preserve-search="true"
            :placeholder="'Select items'"
            :option-height="24"
            @select="onSelectOption"
        >
            <template slot="tag" slot-scope="{ option }">
                <span
                    class="multiselect__tag"
                    :title="option.nameWithParent || option.name"
                >
                    <span>{{ option.nameWithParent || option.name }}</span>
                    <i
                        tabindex="1"
                        @keypress.enter.prevent="removeElement(option)"
                        @mousedown.prevent="removeElement(option)"
                        class="multiselect__tag-icon"
                    ></i>
                </span>
            </template>
            <template slot="option" slot-scope="{ option, search }">
                <span
                    v-if="option.value"
                    :data-value="option.value"
                    :class="[
                        'item',
                        {
                            selected: listWithParents.includes(option.value),
                        },
                    ]"
                >
                    <span class="indent" v-if="option.parent">-</span>
                    {{ option.name }}
                    <span class="parent" v-if="option.parent && search"
                        >({{ option.parentName }})</span
                    >
                </span>
            </template>
        </multiselect>
        <multiselect
            v-else
            ref="multiselect"
            v-model="list"
            :options="selectOptions"
            label="name"
            track-by="value"
            :customLabel="(item) => item?.nameWithParent || item.name"
            :taggable="true"
            :multiple="true"
            :loading="loading"
            :preselect-first="true"
            :close-on-select="false"
            :clear-on-select="false"
            :preserve-search="true"
            :placeholder="'Select or type to create new'"
            :option-height="24"
            @select="onSelectOption"
            @tag="addOption"
        >
            <template slot="tag" slot-scope="{ option }">
                <span
                    class="multiselect__tag"
                    :title="option.nameWithParent || option.name"
                >
                    <span>{{ option.nameWithParent || option.name }}</span>
                    <i
                        tabindex="1"
                        @keypress.enter.prevent="removeElement(option)"
                        @mousedown.prevent="removeElement(option)"
                        class="multiselect__tag-icon"
                    ></i>
                </span>
            </template>
            <template slot="option" slot-scope="{ option, search }">
                <span
                    v-if="option.value"
                    :data-value="option.value"
                    :class="[
                        'item',
                        {
                            selected: listWithParents.includes(option.value),
                        },
                    ]"
                >
                    <span class="indent" v-if="option.parent">-</span>
                    {{ option.name }}
                    <span class="parent" v-if="option.parent && search"
                        >({{ option.parentName }})</span
                    >
                </span>
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

        computed: {
            listWithParents() {
                const result = {}

                this.list.forEach((item) => {
                    result[item.value] = true

                    if (item.parent) {
                        result[item.parent] = true
                    }
                })

                return Object.keys(result)
            },
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

            async pluginCreated() {
                const community = this.storyItem?.full_slug?.split('/')?.[0]
                let baseURL = 'https://localhost:3010'

                if (community) {
                    await this.api
                        .get(`cdn/stories/${community}/settings`, {
                            version: 'draft',
                        })
                        .then((result) => {
                            const { story } = result.data

                            console.log(result, story.content)
                            if (!story?.content?.domain) {
                                return
                            }

                            baseURL = 'https://edit.' + story.content.domain
                            console.log(baseURL)
                        })
                }

                // legacy
                if (!this.model.list) {
                    this.model.list = []
                }

                new Promise((resolve) => {
                    if (!this.options.options) {
                        return resolve()
                    }

                    if (/^(https?:\/\/|\/\w)/.test(this.options.options)) {
                        if (this.options.options.startsWith('/')) {
                            this.options.options =
                                baseURL + this.options.options
                        }
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
                                                    parentName: item.name,
                                                    nameWithParent:
                                                        item.name +
                                                        '/' +
                                                        subItem.name,
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
                    if (!starts_with.endsWith('/')) {
                        starts_with += '/'
                    }

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

            onSelectOption(item) {
                this.$nextTick(() => {
                    // if parent selected and child already in list, remove parent
                    if (!item?.parent) {
                        if (this.list.find((o) => o.parent === item.value)) {
                            const parentIndex = this.list.findIndex(
                                (o) => o.value === item.value,
                            )

                            if (parentIndex > -1) {
                                this.list.splice(parentIndex, 1)
                            }
                        }
                    } else {
                        // if child selected, remove parent if in list
                        const parentIndex = this.list.findIndex(
                            (o) => o.value === item.parent,
                        )

                        if (parentIndex > -1) {
                            this.list.splice(parentIndex, 1)
                        }
                    }
                })
            },

            removeElement(item) {
                const index = this.list.findIndex((o) => o.value === item.value)

                if (index > -1) {
                    this.list.splice(index, 1)
                }
            },
        },
        watch: {
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
        height: 350px;
        overflow: hidden;
    }

    .multiselect {
        &__tags {
            padding: 6px 28px 0 6px;

            &-wrap {
                display: flex;
                flex-flow: row wrap;
                gap: 0.5rem;
                margin: 0 0 6px;
            }
        }

        &__tag {
            display: block;
            margin: 0;
            background-color: #dfe3e8;
            color: #1b243f;
            font-size: 14px;
            font-weight: 500;
            border-radius: 5px;
            max-width: calc(50% - 0.5rem);

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
            font-size: 15px;
            padding: 0;
        }

        &__option {
            padding: 0;
            min-height: 0;
            color: #1b243f !important;
            background-color: #fff !important;
            transition: color 0.1s, background-color 0.1s;

            &::after {
                display: none;
            }

            &--highlight {
                color: #fff;
                background-color: #00b3b0;

                &::before {
                    color: #fff;
                }
            }

            .item {
                display: flex;
                flex-flow: row nowrap;
                font-size: 15px;
                font-weight: 500;
                padding: 0 0.75rem;
                min-height: 1.5rem;
                align-items: center;
                white-space: nowrap;
                background-color: #fff;
                transition: color 0.1s, background-color 0.1s;

                &:hover {
                    color: #fff;
                    background-color: #00b3b0;

                    &::before {
                        color: #fff;
                    }
                }

                &::before {
                    content: '✓';
                    display: inline-block;
                    margin-right: 0.75rem;
                    color: #1b243f;
                    opacity: 0;
                    transition: opacity 0.2s, color 0.1s;
                }

                &.selected {
                    &::before {
                        opacity: 1;
                    }

                    &:not(:hover) {
                        color: #1b243f;
                        background-color: #fff;

                        // &:before {
                        //     color: #fff;
                        // }
                    }
                }

                .indent {
                    margin-right: 0.75rem;
                    // padding-left: 1rem;
                }

                .parent {
                    margin-left: 0.5rem;
                    font-weight: 400;
                    color: #aaa;
                }
            }
        }
    }
</style>
