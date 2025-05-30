import { URL, fileURLToPath } from 'node:url';

import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        sourcemap: true,
        lib: {
            entry: {
                'cypress-solid': fileURLToPath(new URL('./src/index.ts', import.meta.url)),
                'config': fileURLToPath(new URL('./src/config/index.ts', import.meta.url)),
                'support': fileURLToPath(new URL('./src/support/index.ts', import.meta.url)),
            },
            formats: ['es'],
            fileName: (_, entry) => {
                if (entry.includes('config')) {
                    return 'config.js';
                }

                if (entry.includes('support')) {
                    return 'support.js';
                }

                return 'cypress-solid.js';
            },
        },
        rollupOptions: {
            external: [
                '@inrupt/solid-client-authn-core',
                '@noeldemartin/solid-utils',
                '@noeldemartin/solid-utils/testing',
                '@noeldemartin/solid-utils/chai',
                '@noeldemartin/utils',
                'debug',
                'node:fs',
                'soukai-solid',
                'soukai',
            ],
        },
    },
    optimizeDeps: {
        exclude: ['node:fs'],
    },
    plugins: [
        dts({
            rollupTypes: true,
            tsconfigPath: './tsconfig.json',
            insertTypesEntry: true,
        }),
    ],
    resolve: {
        alias: {
            'cypress-solid': fileURLToPath(new URL('./src/', import.meta.url)),
        },
    },
});
