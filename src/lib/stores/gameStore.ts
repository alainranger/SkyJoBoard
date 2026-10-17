import { writable, derived } from 'svelte/store';
import type { GameState } from '$lib/types/game';
import {
    calculateAllTotals,
    findLeader,
    createPlayer,
    canAddPlayer,
    canAddRound,
    areAllScoresEntered,
    checkGameEnd,
    hasAnyScores,
} from '$lib/logic/gameLogic';

function createGameStore() {
    const getInitialState = (): GameState => ({
        players: [createPlayer('Joueur 1', 1), createPlayer('Joueur 2', 1)],
        rounds: 1,
        currentRound: 0,
        gameOver: false,
        winnerName: '',
    });

    const { subscribe, set, update } = writable<GameState>(getInitialState());

    return {
        subscribe,

        addPlayer: () =>
            update((state) => {
                // Bloquer l'ajout de joueurs si la partie a commencé
                if (hasAnyScores(state.players)) return state;
                if (!canAddPlayer(state.players.length)) return state;

                return {
                    ...state,
                    players: [
                        ...state.players,
                        createPlayer(`Joueur ${state.players.length + 1}`, state.rounds),
                    ],
                };
            }),

        removePlayer: () =>
            update((state) => {
                // Bloquer la suppression de joueurs si la partie a commencé
                if (hasAnyScores(state.players) || state.players.length <= 2) return state;
                return {
                    ...state,
                    players: state.players.slice(0, -1),
                };
            }),

        updatePlayerName: (playerIndex: number, name: string) =>
            update((state) => {
                if (playerIndex < 0 || playerIndex >= state.players.length) {
                    return state;
                }
                const newPlayers = [...state.players];
                newPlayers[playerIndex] = { ...newPlayers[playerIndex], name };
                return { ...state, players: newPlayers };
            }),

        updateScore: (playerIndex: number, roundIndex: number, value: string) =>
            update((state) => {
                if (playerIndex < 0 || playerIndex >= state.players.length) {
                    return state;
                }
                // Si la valeur est vide, on garde undefined (non entré)
                // Sinon on parse le nombre (accepte 0, négatifs, etc.)
                const scoreValue = value === '' ? undefined : parseInt(value, 10);
                const newPlayers = [...state.players];
                newPlayers[playerIndex] = {
                    ...newPlayers[playerIndex],
                    scores: [...newPlayers[playerIndex].scores],
                };
                newPlayers[playerIndex].scores[roundIndex] = scoreValue;
                return { ...state, players: newPlayers };
            }),

        endRound: () =>
            update((state) => {
                // Vérifier si tous les scores sont entrés
                if (!areAllScoresEntered(state.players, state.currentRound)) {
                    alert('Veuillez entrer tous les scores avant de terminer la manche.');
                    return state;
                }

                // Vérifier si la partie est terminée
                const { isOver, winner } = checkGameEnd(state.players);

                if (isOver && winner) {
                    return {
                        ...state,
                        gameOver: true,
                        winnerName: winner,
                    };
                }

                // Ajouter une nouvelle manche
                if (!canAddRound(state.rounds)) return state;

                return {
                    ...state,
                    rounds: state.rounds + 1,
                    currentRound: state.currentRound + 1,
                    players: state.players.map((player) => ({
                        ...player,
                        scores: [...player.scores, 0],
                    })),
                };
            }),

        reset: () => set(getInitialState()),
    };
}

export const gameStore = createGameStore();

// Stores dérivés pour les statistiques
export const totals = derived(gameStore, ($game) => calculateAllTotals($game.players));

export const leader = derived(totals, ($totals) => findLeader($totals));

export const lowestScore = derived(leader, ($leader) => $leader.total);

export const hasScores = derived(gameStore, ($game) => hasAnyScores($game.players));
