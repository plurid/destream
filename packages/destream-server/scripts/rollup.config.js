// #region imports
    // #region libraries
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
    ],
    plugins: [
        typescript({
            tsconfig: './tsconfig.json',
        }),
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
