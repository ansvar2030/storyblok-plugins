import { defineConfig, type PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import * as querystring from 'querystring'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import { fileURLToPath, URL } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue({
            template: { transformAssetUrls },
        }),
        cssInjectedByJsPlugin(),
        quasar({
            sassVariables: 'src/assets/quasar-variables.scss',
        }),
        printProd(),
        printDev(),
    ],
    build: {
        rollupOptions: {
            output: {
                format: 'commonjs',
                entryFileNames: `[name].js`,
                chunkFileNames: `[name].js`,
                assetFileNames: `[name].[ext]`,
                // manualChunks: {
                //     vendor: ['vue3-apexcharts'],
                //     // ...renderChunks(dependencies),
                // },
            },
            // external: ['vue3-apexcharts'],
        },
    },
    server: {
        port: 8080,
        host: true,
    },
    resolve: {
        alias: [
            //     {
            //         find: 'vue3-apexcharts',
            //         // replacement:
            //         //     'https://www.unpkg.com/apexcharts@3.41.0/dist/apexcharts.esm.js',
            //         replacement: 'dist-apexcharts/vue3-apexcharts.esm.js',
            //         // replacement:
            //         //     'https://cdn.hub.ansvar.com/vue3-apexcharts.esm.js',
            //     },
            {
                find: '@',
                replacement: fileURLToPath(new URL('./src', import.meta.url)),
            },
        ],
    },
})

const sandboxBaseUrl = `https://plugin-sandbox.storyblok.com/field-plugin`
const sandboxUrl = (fieldPluginUrl: string) => {
    const urlQuery = querystring.stringify({
        url: fieldPluginUrl,
    })
    return `${sandboxBaseUrl}?${urlQuery}`
}

const styles = {
    reset: '\u001b[0m',
    green: '\u001b[32m',
    bold: '\u001b[1m',
}

// Utility functions for printing to terminal

const green = (text: string) => `${styles.green}${text}${styles.reset}`
const bold = (text: string) => `${styles.bold}${text}${styles.reset}`

const arrow = green('➜')

function printProd(): PluginOption {
    return {
        name: 'storyblok-field-plugin-print-prod',
        // https://vitejs.dev/guide/api-plugin.html#plugin-ordering
        enforce: 'post',
        writeBundle: () => {
            console.log(`
  Deploy the plugin to production with:

    ${green('yarn deploy')}
      `)
        },
    }
}

function printDev(): PluginOption {
    return {
        name: 'storyblok-field-plugin-print-dev',
        // https://vitejs.dev/guide/api-plugin.html#plugin-ordering
        enforce: 'post',
        // https://vitejs.dev/guide/api-plugin.html#conditional-application
        apply: 'serve',
        configureServer(server) {
            // Overrides the message that Vite prints out when the server is started. To reduce complexity, it does not include color
            server.printUrls = () => {
                const localUrl = server.resolvedUrls!.local[0]
                const networkUrl = server.resolvedUrls!.network[0]

                console.log(`
    ${arrow}  ${bold(
                    'Partner Portal',
                )}:  https://app.storyblok.com/#/partner/fields
    ${arrow}  ${bold('My plugins')}:      https://app.storyblok.com/#/me/plugins

    ${arrow}  ${bold('Local')}:    ${localUrl}
    ${arrow}  ${bold('Network')}:  ${networkUrl}

  See the plugin in action on

    ${arrow}  ${bold('Sandbox')}: ${sandboxUrl(localUrl)}
          `)
            }
        },
    }
}
