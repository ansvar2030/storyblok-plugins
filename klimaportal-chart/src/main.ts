import { createApp } from 'vue'

import App from './App.vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { Quasar, Notify } from 'quasar'
import quasarLang from 'quasar/lang/de'
import quasarIconSet from 'quasar/icon-set/svg-material-icons'
import VueApexCharts from 'vue3-apexcharts'
import VueNumberFormat from '@coders-tm/vue-number-format'

import filters from './tools/filters.js'

import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

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
        storage: {
            getItem(key) {
                // delay till app is mounted
                return localStorage.getItem(key)
                // return store[key] || null
            },
            setItem(key, value) {
                // console.log(app)
                // store[key] = value
                // plugin.setContent(store)
                return localStorage.setItem(key, value)
            },
        },
    }),
)
app.use(pinia)

app.provide('filters', filters)

app.use(Quasar, {
    plugins: { Notify }, // import Quasar plugins and add here
    lang: quasarLang,
    iconSet: quasarIconSet,
    /*
  config: {
    brand: {
      // primary: '#e46262',
      // ... or all other brand colors
    },
    notify: {...}, // default set of options for Notify Quasar plugin
    loading: {...}, // default set of options for Loading Quasar plugin
    loadingBar: { ... }, // settings for LoadingBar Quasar plugin
    // ..and many more (check Installation card on each Quasar component/directive/plugin)
  }
  */
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
