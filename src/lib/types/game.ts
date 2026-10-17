export interface Player {
    name: string;
    scores: (number | undefined)[];
}

export interface GameState {
    players: Player[];
    rounds: number;
    currentRound: number;
    gameOver: boolean;
    winnerName: string;
}

export interface PlayerStats {
    name: string;
    total: number;
}

export const GAME_CONSTANTS = {
    MIN_PLAYERS: 2,
    MAX_PLAYERS: 8,
    MAX_ROUNDS: 20,
    WINNING_SCORE: 100,
} as const;
