# SkyJoBoard - Application Svelte 5

Application de feuille de score pour le jeu SkyJo, développée avec Svelte 5.

Créé en collaboration avec [Claude](https://claude.ai/).  

## 🚀 Démarrage rapide

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build de production
npm run preview
```

## 📋 Fonctionnalités

- ✅ Gestion de plusieurs joueurs (2-8)
- ✅ Ajout de manches (jusqu'à 20)
- ✅ Calcul automatique des totaux
- ✅ Détection automatique du gagnant (quand un joueur atteint 100 points)
- ✅ Interface responsive pour mobile et desktop
- ✅ Réactivité complète avec Svelte 5 runes ($state, $derived)

## 🛠 Technologies

- **Svelte 5** - Framework réactif moderne
- **Vite** - Build tool ultra-rapide
- **CSS pur** - Styles scoped avec gradients et animations

## 📦 Structure du projet

```
SkyJoBoard/
├── src/
│   ├── App.svelte      # Composant principal
│   ├── main.js         # Point d'entrée
│   └── index.html      # Template HTML
├── package.json
├── vite.config.js
└── svelte.config.js
```

## 🎮 Utilisation

1. Ajoutez ou retirez des joueurs avec les boutons + Joueur / - Joueur
2. Modifiez les noms des joueurs en cliquant sur leur nom
3. Entrez les scores de chaque manche
4. Ajoutez des manches avec le bouton + Manche
5. Le gagnant est automatiquement annoncé quand un joueur atteint 100 points

## 📝 Licence

Libre d'utilisation
