const { globalStyles } = require('storyblok-design-system/config/globals')

function addStyleResource(rule) {
    rule.use('style-resource').loader('style-resources-loader').options({
        patterns: globalStyles,
    })
}

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
    chainWebpack: (config) => {
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal']

        types.forEach((type) => {
            addStyleResource(config.module.rule('scss').oneOf(type))
        })
    },
}
