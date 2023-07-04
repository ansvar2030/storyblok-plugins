// import babel from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import alias from 'rollup-plugin-alias'
import replace from '@rollup/plugin-replace'

export default [
    {
        external: ['vue'],
        input: 'node_modules/vue3-apexcharts/src/index.js',
        output: [
            {
                file: 'dist-apexcharts/vue3-apexcharts.esm.js',
                format: 'esm', // ES2015 modules version so consumers can tree-shake
            },
        ],
        plugins: [
            nodeResolve(),
            alias({
                entries: [
                    {
                        find: 'apexcharts',
                        replacement:
                            'node_modules/apexcharts/dist/apexcharts.esm.js',
                    },
                ],
            }),
            replace(
                {
                    'process.env.NODE_ENV': JSON.stringify('production'),
                },
                { preventAssignment: false },
            ),
            // babel({
            //     // plugins: ['@babel/plugin-proposal-class-properties'],
            //     // presets: ['@babel/preset-flow'],
            // }),
        ],
    },
]
