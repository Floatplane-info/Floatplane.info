import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import {cloudflareHandlers} from "./vote-cf-handlers.ts";

export default defineConfig({
    plugins: [
        tailwindcss(),
        sveltekit(),
        cloudflareHandlers()
    ]
});
