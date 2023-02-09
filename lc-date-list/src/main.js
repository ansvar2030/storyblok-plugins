// import Vue from 'vue'
import Plugin from './Plugin.vue'
// import BlokInk from 'storyblok-design-system'

// import 'storyblok-design-system/dist/storyblok-design-system.css'

// Vue.use(BlokInk)
const shoelaceBase =
    'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0/dist'

function addScript(url) {
    const script = document.createElement('script')
    script.type = 'module'
    script.src = url
    script.setAttribute('data-shoelace', shoelaceBase)
    document.head.append(script)
}

addScript(shoelaceBase + '/components/button/button.js')
addScript(shoelaceBase + '/components/icon-button/icon-button.js')
addScript(shoelaceBase + '/components/icon/icon.js')
addScript(shoelaceBase + '/components/input/input.js')

const link = document.createElement('link')
link.rel = 'stylesheet'
link.href = shoelaceBase + '/themes/light.css'
document.head.append(link)

window.Storyblok.vue.config.ignoredElements = [/^sl-/]

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
