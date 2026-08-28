// import tailwindcss from '@tailwindcss/vite';
// import react from '@vitejs/plugin-react';
// import laravel from 'laravel-vite-plugin';
// import { resolve } from 'node:path';
// import { defineConfig, loadEnv } from 'vite';

// export default defineConfig(({ mode }) => {
//     const env = loadEnv(mode, process.cwd(), '');
//     const appUrl = new URL(env.APP_URL || 'http://localhost:8000');
//     const viteHost = env.VITE_DEV_SERVER_HOST || appUrl.hostname;

//     return {
//         plugins: [
//             laravel({
//                 input: ['resources/css/app.css', 'resources/js/app.tsx'],
//                 ssr: 'resources/js/ssr.jsx',
//                 refresh: true,
//             }),
//             react(),
//             tailwindcss(),
//         ],
//         resolve: {
//             alias: {
//                 qs: resolve(__dirname, 'resources/js/shims/qs.ts'),
//                 tslib: resolve(__dirname, 'resources/js/shims/tslib.ts'),
//             },
//         },
//         server: {
//             host: '0.0.0.0',
//             origin: `http://${viteHost}:5173`,
//             cors: {
//                 origin: [appUrl.origin],
//             },
//             hmr: {
//                 host: viteHost,
//             },
//         },
//         esbuild: {
//             jsx: 'automatic',
//         },
//     };
// });
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
            // "npx concurrently -c \"#93c5fd,#c4b5fd,#fdba74\" \"php artisan serve\" \"php artisan queue:listen --tries=1\" \"npm run dev\" --names='server,queue,vite'"
