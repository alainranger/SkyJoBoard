# Architecture et Tests

## Structure du Code

Le code a été refactorisé pour suivre les meilleures pratiques de programmation et être facilement testable :

### 📁 Structure des Fichiers

```text
src/
├── lib/
│   ├── types/
│   │   └── game.ts              # Types TypeScript et constantes
│   ├── logic/
│   │   ├── gameLogic.ts         # Fonctions pures de logique métier
│   │   └── gameLogic.test.ts    # Tests unitaires pour gameLogic
│   └── stores/
│       ├── gameStore.ts         # Store Svelte pour la gestion d'état
│       └── gameStore.test.ts    # Tests unitaires pour gameStore
└── routes/
    └── +page.svelte             # Composant UI (logique minimale)
```

### 🏛️ Principes de Design Appliqués

#### 1. **Separation of Concerns** (Séparation des responsabilités)

- **Types** (`game.ts`) : Définitions TypeScript et constantes
- **Logic** (`gameLogic.ts`) : Logique métier pure, sans état
- **Store** (`gameStore.ts`) : Gestion d'état centralisée
- **UI** (`+page.svelte`) : Affichage et interactions utilisateur uniquement

#### 2. **Single Responsibility Principle** (Principe de responsabilité unique)

Chaque fonction a une seule responsabilité claire :

- `calculatePlayerTotal()` : Calcule le total d'un joueur
- `areAllScoresEntered()` : Vérifie si tous les scores sont entrés
- `checkGameEnd()` : Détermine si la partie est terminée

#### 3. **Pure Functions** (Fonctions pures)

Toutes les fonctions de `gameLogic.ts` sont pures :

- Pas d'effets de bord
- Résultats déterministes (mêmes entrées → mêmes sorties)
- Facilement testables
- Exemples :

  ```typescript
  export function calculatePlayerTotal(player: Player): number {
    return player.scores.reduce((sum, score) => sum + score, 0);
  }
  ```

#### 4. **Store Pattern** (Pattern de Store)

Utilise Svelte stores pour centraliser l'état :

- **Writable Store** : État principal du jeu
- **Derived Stores** : Valeurs calculées automatiquement (`totals`, `leader`, etc.)
- **Actions** : Méthodes pour modifier l'état (`addPlayer`, `updateScore`, etc.)

#### 5. **Dependency Injection** (Injection de dépendances)

Les fonctions reçoivent toutes leurs dépendances en paramètres :

```typescript
export function checkGameEnd(players: Player[]): {
  isOver: boolean;
  winner: string | null;
};
```

#### 6. **Immutability** (Immuabilité)

Le store crée de nouveaux objets au lieu de muter l'état :

```typescript
players: [...state.players, newPlayer]; // Nouveau tableau
```

## 🧪 Tests Unitaires

### Exécuter les Tests

```bash
# Mode watch (recommandé pendant le développement)
npm test

# Exécuter tous les tests une fois
npm run test:run

# Interface UI pour visualiser les tests
npm run test:ui
```

### Couverture des Tests

#### `gameLogic.test.ts` (11 suites de tests)

- ✅ `calculatePlayerTotal` : Calcul des totaux avec scores positifs, négatifs, vides
- ✅ `calculateAllTotals` : Calcul pour tous les joueurs
- ✅ `findLeader` : Identification du joueur en tête
- ✅ `areAllScoresEntered` : Validation de la complétion d'une manche
- ✅ `hasAnyScores` : Détection de scores entrés
- ✅ `checkGameEnd` : Détection de fin de partie
- ✅ `createPlayer` : Factory de joueurs
- ✅ `canAddPlayer` : Validation limite max joueurs
- ✅ `canRemovePlayer` : Validation limite min joueurs
- ✅ `canAddRound` : Validation limite max manches

#### `gameStore.test.ts` (9 suites de tests)

- ✅ État initial du store
- ✅ Ajout de joueurs (avec limite)
- ✅ Suppression de joueurs (avec limite)
- ✅ Mise à jour des noms de joueurs
- ✅ Mise à jour des scores
- ✅ Fin de manche (validation + game over)
- ✅ Derived stores (`totals`, `leader`, `lowestScore`, `hasScores`)
- ✅ Reset du jeu

### Exemple de Test

```typescript
describe("calculatePlayerTotal", () => {
  it("should calculate total score for a player", () => {
    const player: Player = { name: "Alice", scores: [10, 20, 30] };
    expect(calculatePlayerTotal(player)).toBe(60);
  });

  it("should handle negative scores", () => {
    const player: Player = { name: "Charlie", scores: [10, -5, 15] };
    expect(calculatePlayerTotal(player)).toBe(20);
  });
});
```

## 📊 Design Patterns Utilisés

### 1. **Store Pattern**

Centralisation de l'état de l'application dans un store Svelte.

### 2. **Factory Pattern**

```typescript
function createPlayer(name: string, rounds: number): Player;
```

### 3. **Observer Pattern**

Les derived stores observent automatiquement les changements du store principal.

### 4. **Command Pattern**

Les actions du store encapsulent les opérations :

```typescript
gameStore.addPlayer();
gameStore.updateScore(playerIndex, roundIndex, value);
gameStore.endRound();
```

## 🎯 Avantages de cette Architecture

1. **Testabilité** : Chaque fonction peut être testée indépendamment
2. **Maintenabilité** : Code organisé et facile à comprendre
3. **Réutilisabilité** : Fonctions pures réutilisables dans d'autres contextes
4. **Type Safety** : TypeScript assure la sûreté des types
5. **Prévisibilité** : Flux de données unidirectionnel (Store → UI)
6. **Debugging** : Plus facile de tracer les bugs dans des fonctions isolées

## 🔄 Flux de Données

```text
User Action (UI)
    ↓
Store Action (gameStore.updateScore)
    ↓
Pure Function (gameLogic.calculatePlayerTotal)
    ↓
State Update (Svelte store)
    ↓
Derived Stores Update ($totals, $leader)
    ↓
UI Re-render (+page.svelte)
```

## 📝 Bonnes Pratiques Suivies

- ✅ Typage fort avec TypeScript
- ✅ Fonctions petites et focalisées
- ✅ Nommage explicite et descriptif
- ✅ Séparation UI / Logique / État
- ✅ Tests unitaires complets
- ✅ Constantes extraites (GAME_CONSTANTS)
- ✅ Documentation inline (JSDoc pourrait être ajouté)
- ✅ Validation des entrées
- ✅ Gestion d'erreurs implicite (validation before action)

## 🚀 Pour Aller Plus Loin

Possibles améliorations futures :

- Ajouter JSDoc pour documentation automatique
- Tests d'intégration pour le composant Svelte
- Tests E2E avec Playwright
- Persistence avec localStorage
- Historique des actions (undo/redo)
- Internationalisation (i18n)
