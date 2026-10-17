import type { Player, PlayerStats } from '$lib/types/game';
import { GAME_CONSTANTS } from '$lib/types/game';

/**
 * Calcule le total des points pour un joueur
 * Les scores undefined (non entrés) sont traités comme 0
 */
export function calculatePlayerTotal(player: Player): number {
    return player.scores.reduce((sum: number, score) => sum + (score ?? 0), 0);
}

/**
 * Calcule les totaux de tous les joueurs
 */
export function calculateAllTotals(players: Player[]): PlayerStats[] {
    return players.map((player) => ({
        name: player.name,
        total: calculatePlayerTotal(player),
    }));
}

/**
 * Trouve le joueur en tête (score le plus bas)
 */
export function findLeader(totals: PlayerStats[]): PlayerStats {
    return totals.reduce((min, player) => (player.total < min.total ? player : min));
}

/**
 * Vérifie si tous les scores de la manche courante ont été entrés
 * Note: Un score de 0 ou négatif est valide dans SkyJo
 */
export function areAllScoresEntered(players: Player[], currentRound: number): boolean {
    // Vérifie que tous les joueurs ont un score défini pour cette manche
    return players.every(
        (player) =>
            player.scores[currentRound] !== undefined && player.scores[currentRound] !== null,
    );
}

/**
 * Vérifie si au moins un score a été entré (défini, pas undefined)
 * Note: Utilisé pour l'affichage des stats
 */
export function hasAnyScores(players: Player[]): boolean {
    return players.some((player) =>
        player.scores.some((score) => score !== undefined && score !== null) && !player.scores.every((score) => score === 0),
    );
}

/**
 * Détermine si la partie est terminée et retourne le gagnant
 */
export function checkGameEnd(players: Player[]): { isOver: boolean; winner: string | null } {
    const totals = calculateAllTotals(players);
    const maxScore = Math.max(...totals.map((t) => t.total));

    if (maxScore >= GAME_CONSTANTS.WINNING_SCORE) {
        const winner = findLeader(totals);
        return { isOver: true, winner: winner.name };
    }

    return { isOver: false, winner: null };
}

/**
 * Crée un nouveau joueur avec des scores non initialisés (undefined)
 * Note: undefined signifie "non entré", tandis que 0 est un score valide
 */
export function createPlayer(name: string, rounds: number): Player {
    return {
        name,
        scores: new Array(rounds).fill(undefined),
    };
}

/**
 * Valide si on peut ajouter un joueur
 */
export function canAddPlayer(currentPlayerCount: number): boolean {
    return currentPlayerCount < GAME_CONSTANTS.MAX_PLAYERS;
}

/**
 * Valide si on peut retirer un joueur
 */
export function canRemovePlayer(currentPlayerCount: number): boolean {
    return currentPlayerCount > GAME_CONSTANTS.MIN_PLAYERS;
}

/**
 * Valide si on peut ajouter une manche
 */
export function canAddRound(currentRounds: number): boolean {
    return currentRounds < GAME_CONSTANTS.MAX_ROUNDS;
}

