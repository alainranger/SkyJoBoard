import { describe, it, expect } from 'vitest';
import {
    calculatePlayerTotal,
    calculateAllTotals,
    findLeader,
    areAllScoresEntered,
    hasAnyScores,
    checkGameEnd,
    createPlayer,
    canAddPlayer,
    canRemovePlayer,
    canAddRound,
} from './gameLogic';
import type { Player } from '$lib/types/game';
import { GAME_CONSTANTS } from '$lib/types/game';

describe('gameLogic', () => {
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

    describe('calculateAllTotals', () => {
        it('should calculate totals for all players', () => {
            const players: Player[] = [
                { name: 'Alice', scores: [10, 20] },
                { name: 'Bob', scores: [15, 25] },
            ];
            const result = calculateAllTotals(players);
            expect(result).toEqual([
                { name: 'Alice', total: 30 },
                { name: 'Bob', total: 40 },
            ]);
        });
    });

    describe('findLeader', () => {
        it('should find player with lowest total score', () => {
            const players: Player[] = [
                { name: 'Alice', scores: [30] },
                { name: 'Bob', scores: [20] },
                { name: 'Charlie', scores: [25] },
            ];
            const totals = calculateAllTotals(players);
            const leader = findLeader(totals);
            expect(leader.name).toBe('Bob');
            expect(leader.total).toBe(20);
        });

        it('should return first player when all have same score', () => {
            const players: Player[] = [
                { name: 'Alice', scores: [10] },
                { name: 'Bob', scores: [10] },
            ];
            const totals = calculateAllTotals(players);
            const leader = findLeader(totals);
            expect(leader.name).toBe('Alice');
        });
    });

    describe('areAllScoresEntered', () => {
        it('should return true when all scores are entered for current round', () => {
            const players: Player[] = [
                { name: 'Alice', scores: [10, 20] },
                { name: 'Bob', scores: [15, 25] },
            ];
            expect(areAllScoresEntered(players, 1)).toBe(true);
        });

        it('should return true when scores are 0 (0 is a valid score)', () => {
            const players: Player[] = [
                { name: 'Alice', scores: [10, 0] },
                { name: 'Bob', scores: [15, 0] },
            ];
            expect(areAllScoresEntered(players, 1)).toBe(true);
        });
    });

    describe('hasAnyScores', () => {
        it('should return true when at least one player has non-zero score', () => {
            const players: Player[] = [
                { name: 'Alice', scores: [0] },
                { name: 'Bob', scores: [5] },
            ];
            expect(hasAnyScores(players)).toBe(true);
        });

        it('should return false when all scores are 0', () => {
            const players: Player[] = [
                { name: 'Alice', scores: [0] },
                { name: 'Bob', scores: [0] },
            ];
            expect(hasAnyScores(players)).toBe(false);
        });

        it('should return false for empty players array', () => {
            expect(hasAnyScores([])).toBe(false);
        });
    });

    describe('checkGameEnd', () => {
        it('should detect game over when player reaches winning score', () => {
            const players: Player[] = [
                { name: 'Alice', scores: Array(10).fill(10) }, // Total: 100
                { name: 'Bob', scores: Array(20).fill(10) }, // Total: 200
            ];
            const result = checkGameEnd(players);
            expect(result.isOver).toBe(true);
            expect(result.winner).toBe('Alice');
        });

        it('should return null winner when game is not over', () => {
            const players: Player[] = [
                { name: 'Alice', scores: [50] },
                { name: 'Bob', scores: [60] },
            ];
            const result = checkGameEnd(players);
            expect(result.isOver).toBe(false);
            expect(result.winner).toBeNull();
        });
    });

    describe('createPlayer', () => {
        it('should create player with name and initialized scores to undefined', () => {
            const player = createPlayer('Alice', 3);
            expect(player.name).toBe('Alice');
            expect(player.scores).toEqual([undefined, undefined, undefined]);
        });

        it('should create player with empty scores array when rounds is 0', () => {
            const player = createPlayer('Bob', 0);
            expect(player.scores).toEqual([]);
        });
    });

    describe('canAddPlayer', () => {
        it('should allow adding player when below max', () => {
            expect(canAddPlayer(GAME_CONSTANTS.MAX_PLAYERS - 1)).toBe(true);
        });

        it('should not allow adding player when at max', () => {
            expect(canAddPlayer(GAME_CONSTANTS.MAX_PLAYERS)).toBe(false);
        });
    });

    describe('canRemovePlayer', () => {
        it('should allow removing player when above min', () => {
            expect(canRemovePlayer(GAME_CONSTANTS.MIN_PLAYERS + 1)).toBe(true);
        });

        it('should not allow removing player when at min', () => {
            expect(canRemovePlayer(GAME_CONSTANTS.MIN_PLAYERS)).toBe(false);
        });
    });

    describe('canAddRound', () => {
        it('should allow adding round when below max', () => {
            expect(canAddRound(GAME_CONSTANTS.MAX_ROUNDS - 1)).toBe(true);
        });

        it('should not allow adding round when at max', () => {
            expect(canAddRound(GAME_CONSTANTS.MAX_ROUNDS)).toBe(false);
        });
    });
});