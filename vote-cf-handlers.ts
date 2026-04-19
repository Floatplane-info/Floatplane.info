/*

A vite plugin that adds the handlers from src/worker-handlers.ts to the worker.

This has to be post build because SvelteKit always overwrites the `main` file in `wrangler.jsonc` for some reason

 */

import fs from 'fs';
import path from 'path';
import {type Plugin, transformWithOxc} from 'vite';

export function cloudflareHandlers(): Plugin {
    return {
        name: 'cloudflare-handlers',
        enforce: 'post',
        async closeBundle() {
            const workerPath = path.resolve('.svelte-kit/cloudflare/_worker.js');
            const handlersPath = path.resolve('src/worker-handlers.ts');

            if (!fs.existsSync(workerPath)) {
                console.log('ℹ️ Worker file not found, skipping handler append');
                return;
            }

            if (!fs.existsSync(handlersPath)) {
                console.log('ℹ️ Handlers file not found, skipping handler append');
                return;
            }

            try {
                let workerContent = fs.readFileSync(workerPath, 'utf-8');
                const handlersContent = fs.readFileSync(handlersPath, 'utf-8');

                workerContent += `\n\n// === Custom Cloudflare Handlers ===\n`;

                const compiled = await transformWithOxc(
                    handlersContent,
                    'workers-handles.ts',
                    {
                        lang: 'ts',
                        target: 'es2022',
                        sourcemap: false,
                    }
                );
                workerContent += compiled.code;

                fs.writeFileSync(workerPath, workerContent);
                console.log('✓ Appended custom Cloudflare handlers to worker');
            } catch (e) {
                console.error('✗ Failed to append Cloudflare handlers:', e);
                throw e;
            }
        }
    };
}
