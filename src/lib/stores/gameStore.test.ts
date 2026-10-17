import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { gameStore, totals, leader, lowestScore, hasScores } from './gameStore';

describe('gameStore', () => {
    beforeEach(() => {
        // Reset the store before each test
        gameStore.reset();
    });

    describe('initial state', () => {
        it('should have correct initial state', () => {
            const state = get(gameStore);
            expect(state.players).toHaveLength(2);
            expect(state.rounds).toBe(1);
            expect(state.currentRound).toBe(0);
            expect(state.gameOver).toBe(false);
            expect(state.winnerName).toBe('');
        });

        it('should initialize with default player names', () => {
            const state = get(gameStore);
            expect(state.players[0].name).toBe('Joueur 1');
            expect(state.players[1].name).toBe('Joueur 2');
        });
    });

    describe('addPlayer', () => {
        it('should add a new player', () => {
            gameStore.addPlayer();
            const state = get(gameStore);
            expect(state.players).toHaveLength(3);
            expect(state.players[2].name).toBe('Joueur 3');
        });

        it('should not exceed max players', () => {
            // Add players up to max (8)
            for (let i = 0; i < 6; i++) {
                gameStore.addPlayer();
            }
            const state = get(gameStore);
            expect(state.players).toHaveLength(8);

            // Try to add one more
            gameStore.addPlayer();
            const newState = get(gameStore);
            expect(newState.players).toHaveLength(8); // Should still be 8
        });

        it('should not add player after game has started', () => {
            gameStore.updateScore(0, 0, '10');
            gameStore.addPlayer();
            const state = get(gameStore);
            expect(state.players).toHaveLength(2); // Should stay at 2
        });
    });

    describe('removePlayer', () => {
        it('should remove a player', () => {
            gameStore.addPlayer(); // 3 players
            gameStore.removePlayer();
            const state = get(gameStore);
            expect(state.players).toHaveLength(2);
        });

        it('should not go below minimum players', () => {
            gameStore.removePlayer();
            const state = get(gameStore);
            expect(state.players).toHaveLength(2); // Should stay at 2
        });
    });

    describe('updatePlayerName', () => {
        it('should update player name', () => {
            gameStore.updatePlayerName(0, 'Alice');
            const state = get(gameStore);
            expect(state.players[0].name).toBe('Alice');
        });

        it('should not update invalid player index', () => {
            const initialPlayers = get(gameStore).players;
            gameStore.updatePlayerName(999, 'Invalid');
            const newPlayers = get(gameStore).players;
            expect(newPlayers.length).toBe(initialPlayers.length);
            expect(newPlayers[0].name).toBe(initialPlayers[0].name);
        });
    });

    describe('updateScore', () => {
        it('should update player score', () => {
            gameStore.updateScore(0, 0, '25');
            const state = get(gameStore);
            expect(state.players[0].scores[0]).toBe(25);
        });

        it('should handle empty string as undefined (not entered)', () => {
            gameStore.updateScore(0, 0, '');
            const state = get(gameStore);
            expect(state.players[0].scores[0]).toBeUndefined();
        });

        it('should handle negative scores', () => {
            gameStore.updateScore(0, 0, '-5');
            const state = get(gameStore);
            expect(state.players[0].scores[0]).toBe(-5);
        });
    });

    describe('endRound', () => {
        it('should not advance current round when not all scores are entered', () => {
            gameStore.updateScore(0, 0, '10');
            // Player 2 still has 0
            gameStore.endRound();
            const state = get(gameStore);
            expect(state.currentRound).toBe(0); // Should not advance
        });

        it('should end round when all scores are entered', () => {
            gameStore.updateScore(0, 0, '10');
            gameStore.updateScore(1, 0, '15');
            gameStore.endRound();
            const state = get(gameStore);
            expect(state.rounds).toBe(2);
            expect(state.currentRound).toBe(1);
        });

        it('should detect game over when player reaches 100', () => {
            // Give player 1 a total of 100, player 2 will have 50
            for (let i = 0; i < 10; i++) {
                gameStore.updateScore(0, i, '10');
                gameStore.updateScore(1, i, '5');
                gameStore.endRound();
            }
            const state = get(gameStore);
            expect(state.gameOver).toBe(true);
            // Winner is the one with LOWEST score (Joueur 2 with 50)
            expect(state.winnerName).toBe('Joueur 2');
        });
    });

    describe('derived stores', () => {
        it('totals should calculate player totals', () => {
            gameStore.updateScore(0, 0, '10');
            gameStore.updateScore(1, 0, '20');
            const totalsValue = get(totals);
            expect(totalsValue[0].total).toBe(10);
            expect(totalsValue[1].total).toBe(20);
        });

        it('leader should identify player with lowest score', () => {
            gameStore.updateScore(0, 0, '30');
            gameStore.updateScore(1, 0, '20');
            const leaderValue = get(leader);
            expect(leaderValue.name).toBe('Joueur 2');
            expect(leaderValue.total).toBe(20);
        });

        it('lowestScore should return lowest total', () => {
            gameStore.updateScore(0, 0, '30');
            gameStore.updateScore(1, 0, '20');
            const lowestScoreValue = get(lowestScore);
            expect(lowestScoreValue).toBe(20);
        });

        it('hasScores should be false initially', () => {
            expect(get(hasScores)).toBe(false);
        });

        it('hasScores should be true when any score is non-zero', () => {
            gameStore.updateScore(0, 0, '5');
            expect(get(hasScores)).toBe(true);
        });
    });

    describe('reset', () => {
        it('should reset game to initial state', () => {
            // Make some changes
            gameStore.addPlayer();
            gameStore.updatePlayerName(0, 'Alice');
            gameStore.updateScore(0, 0, '10');
            gameStore.updateScore(1, 0, '20');
            gameStore.endRound();

            // Reset
            gameStore.reset();

            const state = get(gameStore);
            expect(state.players).toHaveLength(2);
            expect(state.rounds).toBe(1);
            expect(state.currentRound).toBe(0);
            expect(state.gameOver).toBe(false);
            expect(state.players[0].name).toBe('Joueur 1');
            expect(state.players[0].scores[0]).toBeUndefined();
        });
    });
});
