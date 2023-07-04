import { useFieldPlugin } from '../useFieldPlugin'

export function useStoryblokStorage() {
    const plugin = useFieldPlugin()
    //access field plugin
    console.log('useStoryblokStorage')

    // return useFieldPlugin(key, storage)
    // console.log(plugin, storage)
    storage.init(plugin)
    window.plugin = plugin
}
// function getItem(key) {

//     if (!initialized) {

//     }
// }

function Storage() {
    const self = this
    self.plugin = null
    self.data = {}

    return {
        init(plugin) {
            self.plugin = plugin
            self.data = { ...plugin.data.content }
        },

        getItem(key) {
            // console.log('get item', key)
            // delay till app is mounted
            if (!self.plugin) {
                console.warn('plugin not ready', 'get', key)
                return null
            }

            // return JSON.parse(localStorage.getItem(key))
            return self.plugin.data.content[key]
            // return store[key] || null
        },

        setItem(key, value) {
            // if (key === 'chart-data') {
            //     console.log(
            //         'set item',
            //         value.transformedData.options.xaxis.categories,
            //         value.xAxis.categories,
            //     )
            // }

            if (!self.plugin) {
                console.warn('plugin not ready', 'set', key)
                return null
            }

            // localStorage.setItem(key, JSON.stringify(value))

            self.data[key] = JSON.parse(JSON.stringify(value))
            if (self.plugin) {
                self.plugin.actions.setContent(self.data)
            }
        },
    }
}

export const storage = new Storage()
