import { createApp } from 'vue'

import App from './App.vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { Quasar, Notify } from 'quasar'
import quasarLang from 'quasar/lang/de'

import VueApexCharts from 'vue3-apexcharts'
// import * as test from 'https://www.unpkg.com/vue3-apexcharts@1.4.1/src/index.js'
// console.log(VueApexCharts)
import VueNumberFormat from '@coders-tm/vue-number-format'

import filters from './tools/filters.js'

// import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import { storage } from '@/stores/storyblok-storage'

import './assets/index.scss'

if (!document.querySelector('#app')) {
    // In production, `#app` may or may not exist.
    const rootElement = document.createElement('div')
    rootElement.id = 'app'
    document.body.appendChild(rootElement)
}

const app = createApp(App)

const pinia = createPinia()

// const store = {}
pinia.use(
    createPersistedState({
        serializer: {
            serialize: (value) => value,
            deserialize: (value) => value,
        },
        storage,
    }),
)
app.use(pinia)

app.provide('filters', filters)

app.use(Quasar, {
    plugins: { Notify },
    lang: quasarLang,
})

app.use(VueApexCharts)

app.use(VueNumberFormat, {
    decimal: ',',
    separator: '.',
    precision: 0,
    masked: false,
})

app.mount('#app')

// This error replaces another error which message is harder to understand and impossible to avoid util the issue https://github.com/storyblok/field-plugin/issues/107 has been resolved.
throw new Error(
    `This error can be safely ignored. It is caused by the legacy field plugin API. See issue https://github.com/storyblok/field-plugin/issues/107`,
)
