// import Vue from 'vue'
// import BlokInk from 'storyblok-design-system'

// import 'storyblok-design-system/dist/storyblok-design-system.css'

// Vue.use(BlokInk)

import Plugin from './Plugin.vue'

document.body.classList.remove('uk-form')

if (process.env.NODE_ENV == 'development') {
    // import('storyblok-design-system/dist/storyblok-design-system.css')
    window.Fieldtype = Plugin
    let customComp = window.Storyblok.vue.extend(window.Fieldtype)
    window.Storyblok.vue.component('custom-plugin', customComp)
    window.StoryblokPluginRegistered = true
} else {
    let init = Plugin.methods.initWith()
    window.storyblok.field_types[init.plugin] = Plugin
}
