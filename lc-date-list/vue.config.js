// const { globalStyles } = require('storyblok-design-system/config/globals')

// function addStyleResource(rule) {
//     rule.use('style-resource').loader('style-resources-loader').options({
//         patterns: globalStyles,
//     })
// }

module.exports = {
    configureWebpack: {
        output: {
            filename: 'export.js',
        },
        optimization: {
            splitChunks: false,
        },
    },
    filenameHashing: false,
    runtimeCompiler: true,
    productionSourceMap: false,
    css: {
        extract: false,
    },
    // chainWebpack: (config) => {
    //     config.module
    //         .rule('vue')
    //         .use('vue-loader')
    //         .tap((options) => {
    //             options.compilerOptions.isCustomElement = (tag) =>
    //                 tag.startsWith('sl-')

    //             console.log(options)
    //             return options
    //         })
    // },
}
