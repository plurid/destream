// #region imports
    // #region libraries
    import resolve from '@rollup/plugin-node-resolve';
    import commonjs from '@rollup/plugin-commonjs';
    import typescript from 'rollup-plugin-typescript2';
    import terser from '@rollup/plugin-terser';
    // #endregion libraries
// #endregion imports



// #region module
const pkg = require('../package.json');


export default {
    input: './source/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'es',
            exports: 'named',
        },
    ],
    external: [
        '@apollo/server',
        '@apollo/server/standalone',
        'graphql',
        'graphql-tag',
    ],
    watch: {
        include: 'source/**',
    },
    plugins: [
        typescript({
            tsconfig: './tsconfig.json',
        }),
        resolve({
            preferBuiltins: true,
        }),
        commonjs(),
        terser({
            mangle: false,
            compress: false,
            format: {
                beautify: true,
                comments: false,
            },
        }),
    ],
}
// #endregion module
