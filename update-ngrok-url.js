#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

async function updateNgrokUrl() {
    try {
        // Récupérer l'URL depuis l'API ngrok locale
        const response = await fetch('http://localhost:4040/api/tunnels');
        const data = await response.json();

        // Trouver le tunnel HTTPS
        const httpsTunnel = data.tunnels.find(t => t.proto === 'https');

        if (!httpsTunnel) {
            console.error('❌ Aucun tunnel HTTPS trouvé. Assurez-vous que ngrok est démarré.');
            process.exit(1);
        }

        const ngrokUrl = httpsTunnel.public_url;
        console.log(`✅ URL ngrok détectée: ${ngrokUrl}`);

        // Mettre à jour .env.local
        const envPath = join(process.cwd(), '.env.local');
        let envContent = '';

        try {
            envContent = readFileSync(envPath, 'utf8');
        } catch {
            // Fichier n'existe pas, on le crée
            envContent = '# URL ngrok pour permettre l\'accès externe au serveur de développement\n';
        }

        // Remplacer ou ajouter NGROK_URL
        if (envContent.includes('NGROK_URL=')) {
            envContent = envContent.replace(
                /NGROK_URL=.*/,
                `NGROK_URL=${ngrokUrl}`
            );
        } else {
            envContent += `\nNGROK_URL=${ngrokUrl}\n`;
        }

        writeFileSync(envPath, envContent);
        console.log(`✅ .env.local mis à jour avec: ${ngrokUrl}`);

    } catch (error) {
        console.error('❌ Erreur:', error.message);
        console.log('\n💡 Assurez-vous que ngrok est démarré avec: ngrok http 5173');
        process.exit(1);
    }
}

updateNgrokUrl();
