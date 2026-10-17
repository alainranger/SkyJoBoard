# 🎲 SkyJo Scoreboard

Application de feuille de pointage pour le jeu de cartes SkyJo, construite avec **SvelteKit** et **TypeScript**.

Créer en collaboration avec [Claude](https://claude.ai/).

## ✨ Caractéristiques

- 🎮 Gestion complète des scores pour 2-8 joueurs
- 📊 Statistiques en temps réel (leader, meilleur score)
- 🔄 Gestion automatique des manches
- 🎯 Détection automatique de fin de partie (100 points)
- 📱 Interface responsive avec Tailwind CSS
- 🧪 **55 tests unitaires** avec Vitest
- 🏗️ **Architecture testable** suivant les best practices
- 🔒 Type-safe avec TypeScript
- 🌐 Support ngrok pour tests sur appareils externes

## 🚀 Démarrage Rapide

### Installation

```bash
npm install
```

### Développement

```bash
# Serveur de développement local
npm run dev

# Avec ngrok pour tests sur appareils externes
npm run dev:ngrok
```

### Tests

```bash
# Mode watch (tests automatiques au changement)
npm test

# Exécution unique
npm run test:run

# Interface UI graphique
npm run test:ui
```

### Build Production

```bash
npm run build
npm run preview
```

## 📁 Structure du Projet

```text
SkyJoBoard/
├── src/
│   ├── lib/
│   │   ├── types/
│   │   │   └── game.ts              # Types TypeScript
│   │   ├── logic/
│   │   │   ├── gameLogic.ts         # Logique métier (pure functions)
│   │   │   └── gameLogic.test.ts    # Tests (31 tests)
│   │   └── stores/
│   │       ├── gameStore.ts         # Store Svelte
│   │       └── gameStore.test.ts    # Tests (24 tests)
│   └── routes/
│       ├── +layout.svelte           # Layout principal
│       └── +page.svelte             # Page scoreboard
├── vitest.config.ts                 # Config tests
├── vite.config.ts                   # Config Vite
├── svelte.config.js                 # Config SvelteKit
├── tsconfig.json                    # Config TypeScript
└── package.json                     # Dépendances
```

## 🏛️ Architecture

Le projet suit une architecture en couches pour une **testabilité maximale** :

1. **Types Layer** (`types/game.ts`)
   - Interfaces TypeScript
   - Constantes du jeu

2. **Logic Layer** (`logic/gameLogic.ts`)
   - 11 fonctions pures
   - Aucune dépendance, 100% testable
   - Calculs, validation, règles du jeu

3. **State Layer** (`stores/gameStore.ts`)
   - Store Svelte centralisé
   - Actions : `addPlayer`, `updateScore`, `endRound`...
   - Derived stores : `totals`, `leader`, `hasScores`...

4. **UI Layer** (`routes/+page.svelte`)
   - Composant Svelte pur
   - Pas de logique métier
   - Consommation du store

### Flux de Données

```text
User Action → Store Action → Pure Function → State Update → UI Re-render
```

## 🧪 Tests

**55 tests unitaires** couvrant toute la logique :

- ✅ Calculs de scores
- ✅ Détection de fin de partie
- ✅ Validation des manches
- ✅ Gestion des joueurs
- ✅ Derived stores
- ✅ Edge cases

```bash
# Lancer les tests
npm test

# Voir la coverage
npm test -- --coverage
```

## 🎯 Principes de Design

### SOLID

- **S**ingle Responsibility : Chaque fonction a une responsabilité
- **O**pen/Closed : Extensions sans modifications
- **L**iskov Substitution : Types cohérents
- **I**nterface Segregation : Interfaces spécifiques
- **D**ependency Inversion : Injection de dépendances

### Patterns

- **Store Pattern** : Gestion d'état centralisée
- **Factory Pattern** : Création de joueurs
- **Observer Pattern** : Derived stores
- **Command Pattern** : Actions du store

### Clean Code

- ✅ Fonctions pures (pas d'effets de bord)
- ✅ Type safety complet
- ✅ Separation of Concerns
- ✅ DRY (Don't Repeat Yourself)

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** : Architecture détaillée et design patterns
- **[TESTING.md](./TESTING.md)** : Guide complet des tests unitaires
- **[REFACTORING.md](./REFACTORING.md)** : Historique du refactoring
- **[SUMMARY.md](./SUMMARY.md)** : Résumé exécutif des changements

## 🛠️ Technologies

- **SvelteKit 2.49.1** : Framework full-stack
- **Svelte 5** : Avec runes modernes ($state, $derived)
- **TypeScript 5.9.3** : Type safety
- **Vite 7.2.6** : Build tool avec HMR
- **Tailwind CSS 4.1.17** : Styling utility-first
- **Vitest** : Framework de tests
- **Ngrok** : Tunneling pour tests externes

## 🎮 Règles du Jeu

- 2-8 joueurs
- Maximum 20 manches
- Fin de partie à 100 points
- Le joueur avec le **plus bas score** gagne

## 🌐 Ngrok (Tests Externes)

Pour tester sur mobile ou autre appareil :

```bash
# 1. Installer ngrok (si pas déjà fait)
brew install ngrok

# 2. Démarrer ngrok
ngrok http 5173

# 3. Mettre à jour l'URL automatiquement
npm run update:ngrok

# 4. Démarrer le serveur
npm run dev:ngrok
```

L'URL ngrok sera automatiquement détectée et configurée.

## 📊 Exemple d'Utilisation du Code

### Fonction Pure (Testable)

```typescript
export function calculatePlayerTotal(player: Player): number {
  return player.scores.reduce((sum, score) => sum + score, 0);
}
```

### Test Unitaire

```typescript
it("should calculate total score for a player", () => {
  const player: Player = { name: "Alice", scores: [10, 20, 30] };
  expect(calculatePlayerTotal(player)).toBe(60);
});
```

### Utilisation dans UI

```svelte
<script lang="ts">
  import { gameStore, totals, leader } from '$lib/stores/gameStore';
  $: ({ players, rounds } = $gameStore);
</script>

<button onclick={gameStore.addPlayer}>+ Joueur</button>
<div>Leader: {$leader.name} ({$leader.total} points)</div>
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT.

## 👨‍💻 Auteur

Développé avec ❤️ en utilisant les meilleures pratiques de développement moderne.

---

**Made with Svelte, TypeScript, and lots of ☕.**
