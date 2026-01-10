import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const allowedHosts = ['localhost', '.localhost'];

    // Ajouter l'hôte ngrok depuis .env.local si disponible
    if (env.NGROK_URL) {
        try {
            const ngrokHost = new URL(env.NGROK_URL).hostname;
            allowedHosts.push(ngrokHost);
            console.log(`✅ Ngrok host autorisé: ${ngrokHost}`);
        } catch {
            console.warn('⚠️ NGROK_URL invalide dans .env.local');
        }
    }

    return {
        plugins: [tailwindcss(), sveltekit()],
        server: {
            host: '0.0.0.0',
            allowedHosts
        }
    };
});
