import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


const TARGET_RUNTIME = process.env.LIB_TARGET || 'node';


const build_lib_configs = {
    node: {
        entry: resolve(__dirname, 'src/index.js'),
        name: 'topspin',
        fileName: (format, entryName) => {
            const suffixes = {
                'es': '.esm.js',
                'cjs': '.cjs',
            };
            return 'topspin' + suffixes[format];
        },
        formats: ['es', 'cjs'],
    },
    browser: {
        entry: resolve(__dirname, 'src/browser-component.jsx'),
        name: 'topspin',
        fileName: (format, entryName) => ('topspin.umd.js'),
        formats: ['umd'],
    },
};


const current_build_lib_config = build_lib_configs[TARGET_RUNTIME];


if (current_build_lib_config === undefined) {
    throw new Error('LIB_TARGET is not defined or is not valid');
}


export default defineConfig(({command, mode, isSsrBuild, isPreview}) => {
    let jsxRuntime = 'automatic';
    let minify = 'esbuild';

    if (TARGET_RUNTIME === 'browser') {
        jsxRuntime = 'classic';

        if (mode === 'development') {
            minify = false;
        }
    }

    return {
        plugins: [react({jsxRuntime: jsxRuntime})],
        build: {
            minify: minify,
            lib: {
                ...current_build_lib_config,
            },
            emptyOutDir: false,
            rollupOptions: {
                external: [
                    'react',
                    'react-dom',
                    'react/jsx-runtime',
                ],
                output: {
                    globals: {
                        'react': 'React',
                        'react-dom': 'ReactDOM',
                        'react/jsx-runtime': 'react/jsx-runtime',
                    },
                },
            },
        },
    };
});
