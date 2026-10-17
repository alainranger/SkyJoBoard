# 🧪 Guide des Tests Unitaires

## Pourquoi des Tests ?

Les tests unitaires garantissent que :

- ✅ Le code fonctionne comme prévu
- ✅ Les modifications futures ne cassent pas le code existant
- ✅ La logique métier est correcte
- ✅ Les edge cases sont gérés

## Structure des Tests

```
src/lib/
├── logic/
│   ├── gameLogic.ts        # Code à tester
│   └── gameLogic.test.ts   # Tests unitaires (31 tests)
└── stores/
    ├── gameStore.ts        # Code à tester
    └── gameStore.test.ts   # Tests unitaires (24 tests)
```

## 🚀 Exécuter les Tests

```bash
# Mode watch (recommandé) - Les tests se relancent automatiquement
npm test

# Exécution unique - Pour CI/CD
npm run test:run

# Interface UI - Visualisation graphique
npm run test:ui
```

## 📝 Anatomie d'un Test

### Structure de Base

```typescript
import { describe, it, expect } from 'vitest';
import { calculatePlayerTotal } from './gameLogic';
import type { Player } from '$lib/types/game';

describe('calculatePlayerTotal', () => {
  it('should calculate total score for a player', () => {
    // Arrange (Préparer)
    const player: Player = { name: 'Alice', scores: [10, 20, 30] };
    
    // Act (Agir)
    const result = calculatePlayerTotal(player);
    
    // Assert (Vérifier)
    expect(result).toBe(60);
  });
});
```

### Concepts Clés

- **`describe()`** : Groupe de tests pour une fonction ou fonctionnalité
- **`it()` ou `test()`** : Un test individuel
- **`expect()`** : Assertion sur le résultat
- **`beforeEach()`** : Code exécuté avant chaque test

## 🎯 Types de Tests

### 1. Tests de Fonctions Pures (gameLogic.test.ts)

```typescript
describe('calculatePlayerTotal', () => {
  it('should calculate total score for a player', () => {
    const player: Player = { name: 'Alice', scores: [10, 20, 30] };
    expect(calculatePlayerTotal(player)).toBe(60);
  });

  it('should return 0 for player with no scores', () => {
    const player: Player = { name: 'Bob', scores: [] };
    expect(calculatePlayerTotal(player)).toBe(0);
  });

  it('should handle negative scores', () => {
    const player: Player = { name: 'Charlie', scores: [10, -5, 15] };
    expect(calculatePlayerTotal(player)).toBe(20);
  });
});
```

**Avantages** :

- Tests simples et rapides
- Pas d'état à gérer
- Résultats prévisibles

### 2. Tests de Store (gameStore.test.ts)

```typescript
import { get } from 'svelte/store';
import { gameStore } from './gameStore';

describe('gameStore', () => {
  beforeEach(() => {
    gameStore.reset(); // Réinitialiser avant chaque test
  });

  it('should add a new player', () => {
    gameStore.addPlayer();
    const state = get(gameStore);
    expect(state.players).toHaveLength(3);
    expect(state.players[2].name).toBe('Joueur 3');
  });
});
```

**Particularités** :

- Utilisation de `get()` pour lire la valeur du store
- `beforeEach()` pour réinitialiser l'état
- Tests des actions et derived stores

## 📊 Coverage des Tests

### gameLogic.test.ts (31 tests)

| Fonction | Tests | Edge Cases |
|----------|-------|------------|
| `calculatePlayerTotal` | 3 | Scores vides, négatifs |
| `calculateAllTotals` | 1 | Plusieurs joueurs |
| `findLeader` | 2 | Égalité de scores |
| `areAllScoresEntered` | 3 | Scores partiels, 0 |
| `hasAnyScores` | 3 | Aucun score, vide |
| `checkGameEnd` | 2 | Game over, en cours |
| `createPlayer` | 2 | 0 rounds, N rounds |
| `canAddPlayer` | 2 | Max atteint |
| `canRemovePlayer` | 2 | Min atteint |
| `canAddRound` | 2 | Max atteint |

### gameStore.test.ts (24 tests)

| Fonctionnalité | Tests | Scénarios |
|----------------|-------|-----------|
| Initial state | 2 | État par défaut |
| addPlayer | 3 | Ajout, limite max |
| removePlayer | 2 | Suppression, limite min |
| updatePlayerName | 2 | Valide, invalide |
| updateScore | 3 | Normal, vide, négatif |
| endRound | 3 | Validation, game over |
| Derived stores | 5 | Calculs automatiques |
| reset | 1 | Réinitialisation complète |

## 🔍 Matchers Vitest Courants

```typescript
// Égalité stricte
expect(result).toBe(42);
expect(result).toBe(true);

// Égalité profonde (objets/tableaux)
expect(result).toEqual({ name: 'Alice', score: 10 });

// Tableaux
expect(array).toHaveLength(3);
expect(array).toContain('Alice');

// Nullité
expect(result).toBeNull();
expect(result).toBeDefined();
expect(result).toBeTruthy();
expect(result).toBeFalsy();

// Nombres
expect(score).toBeGreaterThan(50);
expect(score).toBeLessThan(100);
expect(score).toBeCloseTo(3.14, 2);

// Strings
expect(name).toMatch(/Alice/);
expect(name).toContain('Ali');

// Fonctions
expect(() => dangerousFunc()).toThrow();
```

## ✍️ Écrire un Nouveau Test

### Étape 1 : Créer le fichier de test

```bash
touch src/lib/logic/myNewFeature.test.ts
```

### Étape 2 : Importer les dépendances

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from './myNewFeature';
```

### Étape 3 : Écrire le test

```typescript
describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction('input');
    expect(result).toBe('expected output');
  });
});
```

### Étape 4 : Exécuter

```bash
npm test
```

## 🎨 Best Practices

### 1. Nommage des Tests

```typescript
// ❌ Mauvais
it('test 1', () => { ... });

// ✅ Bon
it('should calculate total when all scores are positive', () => { ... });
```

### 2. Un Test = Une Assertion (idéalement)

```typescript
// ❌ Mauvais
it('should do everything', () => {
  expect(a).toBe(1);
  expect(b).toBe(2);
  expect(c).toBe(3);
});

// ✅ Bon
it('should set a to 1', () => {
  expect(a).toBe(1);
});

it('should set b to 2', () => {
  expect(b).toBe(2);
});
```

### 3. Tester les Edge Cases

```typescript
describe('divide', () => {
  it('should divide two numbers', () => {
    expect(divide(10, 2)).toBe(5);
  });

  it('should handle division by zero', () => {
    expect(() => divide(10, 0)).toThrow();
  });

  it('should handle negative numbers', () => {
    expect(divide(-10, 2)).toBe(-5);
  });
});
```

### 4. Utiliser beforeEach pour le Setup

```typescript
describe('gameStore', () => {
  let initialState;

  beforeEach(() => {
    gameStore.reset();
    initialState = get(gameStore);
  });

  it('should start with 2 players', () => {
    expect(initialState.players).toHaveLength(2);
  });
});
```

## 🐛 Debugging des Tests

### Afficher des Valeurs

```typescript
it('should work', () => {
  const result = myFunction();
  console.log('Result:', result); // Pour débugger
  expect(result).toBe(expected);
});
```

### Exécuter un Seul Test

```typescript
// Ajouter .only
it.only('should test this specific case', () => {
  // Ce test sera le seul exécuté
});
```

### Ignorer un Test Temporairement

```typescript
// Ajouter .skip
it.skip('should test this later', () => {
  // Ce test sera ignoré
});
```

## 📈 Améliorer la Coverage

### Voir la Coverage

```bash
npm test -- --coverage
```

### Objectifs

- ✅ Fonctions pures : 100% de coverage
- ✅ Store actions : 90%+ de coverage
- ✅ Edge cases : Tous couverts

## 🎓 Ressources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://testingjavascript.com/)
- [Svelte Testing Library](https://testing-library.com/docs/svelte-testing-library/intro/)

## 💡 Tips Avancés

### Test de Derived Stores

```typescript
it('should calculate totals automatically', () => {
  gameStore.updateScore(0, 0, '10');
  const totalsValue = get(totals);
  expect(totalsValue[0].total).toBe(10);
});
```

### Test d'Actions Multiples

```typescript
it('should handle multiple round completion', () => {
  for (let i = 0; i < 5; i++) {
    gameStore.updateScore(0, i, '10');
    gameStore.updateScore(1, i, '20');
    gameStore.endRound();
  }
  const state = get(gameStore);
  expect(state.rounds).toBe(6);
  expect(state.currentRound).toBe(5);
});
```

### Test d'Edge Cases Complexes

```typescript
it('should detect game over at exactly 100 points', () => {
  // Créer un scénario où le joueur atteint exactement 100
  for (let i = 0; i < 10; i++) {
    gameStore.updateScore(0, i, '10');
    gameStore.updateScore(1, i, '5');
    gameStore.endRound();
  }
  const state = get(gameStore);
  expect(state.gameOver).toBe(true);
  expect(state.winnerName).toBe('Joueur 1');
});
```

## 🎯 Prochaines Étapes

1. ✅ Écrire plus de tests pour edge cases
2. ✅ Ajouter tests d'intégration pour le composant Svelte
3. ✅ Configurer CI/CD pour exécuter les tests automatiquement
4. ✅ Mesurer et améliorer la coverage
5. ✅ Ajouter des tests de performance si nécessaire
