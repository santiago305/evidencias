import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import {
    defineConfig
} from 'vite';
import tailwindcss from "@tailwindcss/vite";
import { resolve } from 'node:path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            qs: resolve(__dirname, 'resources/js/shims/qs.ts'),
            tslib: resolve(__dirname, 'resources/js/shims/tslib.ts'),
        },
    },
    esbuild: {
        jsx: 'automatic',
    },
});
