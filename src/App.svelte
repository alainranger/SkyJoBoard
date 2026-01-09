<script>
    let players = $state([
        { name: "Joueur 1", scores: [0] },
        { name: "Joueur 2", scores: [0] },
    ]);

    let rounds = $state(1);

    // Calculs dérivés
    let totals = $derived(
        players.map((player) => ({
            name: player.name,
            total: player.scores.reduce((sum, score) => sum + score, 0),
        })),
    );

    let leader = $derived(
        totals.reduce((min, player) =>
            player.total < min.total ? player : min,
        ),
    );

    let winner = $derived.by(() => {
        const maxScore = Math.max(...totals.map((t) => t.total));
        if (maxScore >= 100) {
            const winnerIndex = totals.findIndex(
                (t) => t.total === Math.min(...totals.map((t) => t.total)),
            );
            return totals[winnerIndex];
        }
        return null;
    });

    let gameOverDerived = $derived(winner !== null);

    function addPlayer() {
        if (players.length < 8) {
            players.push({
                name: `Joueur ${players.length + 1}`,
                scores: new Array(rounds).fill(0),
            });
        }
    }

    function removePlayer() {
        if (players.length > 2) {
            players.pop();
        }
    }

    function addRound() {
        if (rounds < 20) {
            rounds++;
            players.forEach((player) => {
                player.scores.push(0);
            });
        }
    }

    function updatePlayerName(playerIndex, name) {
        players[playerIndex].name = name;
    }

    function updateScore(playerIndex, roundIndex, value) {
        const scoreValue = parseInt(value) || 0;
        players[playerIndex].scores[roundIndex] = scoreValue;
    }

    function resetGame() {
        if (
            confirm("Êtes-vous sûr de vouloir commencer une nouvelle partie ?")
        ) {
            players = [
                { name: "Joueur 1", scores: [0] },
                { name: "Joueur 2", scores: [0] },
            ];
            rounds = 1;
        }
    }
</script>

<div class="container" class:game-over={gameOverDerived}>
    <div class="header">
        <h1>📋 Feuille de pointage SkyJo</h1>
        <p>Suivez vos parties comme un pro !</p>
    </div>

    <div class="controls">
        <button class="btn btn-primary" onclick={addPlayer}>+ Joueur</button>
        <button class="btn btn-secondary" onclick={removePlayer}
            >- Joueur</button
        >
        <button class="btn btn-success" onclick={addRound}>+ Manche</button>
        <button class="btn btn-danger" onclick={resetGame}
            >Nouvelle Partie</button
        >
    </div>

    {#if winner}
        <div class="winner-announcement">
            🏆 {winner.name} remporte la partie !
        </div>
    {/if}

    <div class="scoresheet">
        <table class="score-table">
            <thead>
                <tr>
                    <th>Manche</th>
                    {#each players as player, playerIndex (player.name + playerIndex)}
                        <th class="player-name">
                            <input
                                type="text"
                                bind:value={player.name}
                                onchange={(e) =>
                                    updatePlayerName(
                                        playerIndex,
                                        e.target.value,
                                    )}
                            />
                        </th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each Array(rounds) as _, roundIndex (roundIndex)}
                    <tr>
                        <td class="round-header">M{roundIndex + 1}</td>
                        {#each players as player, playerIndex (player.name + playerIndex)}
                            <td>
                                <input
                                    type="number"
                                    class="score-input"
                                    value={player.scores[roundIndex] || 0}
                                    onchange={(e) =>
                                        updateScore(
                                            playerIndex,
                                            roundIndex,
                                            e.target.value,
                                        )}
                                    placeholder="0"
                                />
                            </td>
                        {/each}
                    </tr>
                {/each}
                <tr>
                    <td class="total-column"><strong>Total</strong></td>
                    {#each totals as total (total.name)}
                        <td class="total-column">{total.total}</td>
                    {/each}
                </tr>
            </tbody>
        </table>
    </div>

    <div class="stats">
        <div class="stat-item">
            <div class="stat-value">{rounds}</div>
            <div class="stat-label">Manches</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">{players.length}</div>
            <div class="stat-label">Joueurs</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">{leader.name}</div>
            <div class="stat-label">En tête</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">{leader.total}</div>
            <div class="stat-label">Meilleur Score</div>
        </div>
    </div>
</div>

<style>
    :global(*) {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    :global(body) {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        padding: 10px;
        color: #333;
    }

    .container {
        max-width: 900px;
        margin: 0 auto;
        background: white;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    .header {
        background: linear-gradient(135deg, #4caf50, #45a049);
        color: white;
        padding: 20px;
        text-align: center;
    }

    .header h1 {
        font-size: 2.2em;
        margin-bottom: 8px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .controls {
        padding: 15px;
        background: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
    }

    .btn {
        padding: 10px 18px;
        border: none;
        border-radius: 8px;
        font-size: 0.9em;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        touch-action: manipulation;
    }

    .btn-primary {
        background: #007bff;
        color: white;
    }

    .btn-secondary {
        background: #6c757d;
        color: white;
    }

    .btn-danger {
        background: #dc3545;
        color: white;
    }

    .btn-success {
        background: #28a745;
        color: white;
    }

    .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }

    .scoresheet {
        padding: 20px;
        overflow-x: auto;
    }

    .score-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        background: white;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .score-table th {
        background: linear-gradient(135deg, #495057, #6c757d);
        color: white;
        padding: 15px 10px;
        text-align: center;
        font-weight: bold;
        border-right: 1px solid #fff;
    }

    .score-table th:last-child {
        border-right: none;
    }

    .score-table td {
        padding: 12px 10px;
        text-align: center;
        border-bottom: 1px solid #e9ecef;
        border-right: 1px solid #e9ecef;
    }

    .score-table td:last-child {
        border-right: none;
    }

    .score-table tr:nth-child(even) {
        background: #f8f9fa;
    }

    .score-table tr:hover {
        background: #e3f2fd;
    }

    .player-name {
        font-weight: bold;
        background: linear-gradient(135deg, #e3f2fd, #bbdefb);
        color: #1976d2;
        padding: 15px 10px;
        border-right: 1px solid #e9ecef;
        min-width: 120px;
    }

    .player-name input {
        border: none;
        background: transparent;
        font-weight: bold;
        color: #1976d2;
        width: 100%;
        text-align: center;
        font-size: 1em;
    }

    .score-input {
        width: 100%;
        border: none;
        background: transparent;
        text-align: center;
        font-size: 1em;
        padding: 5px;
        border-radius: 5px;
        transition: background 0.3s ease;
    }

    .score-input:focus {
        outline: none;
        background: #fff3cd;
        box-shadow: 0 0 0 2px #ffc107;
    }

    .total-column {
        background: linear-gradient(135deg, #d4edda, #c3e6cb) !important;
        font-weight: bold;
        color: #155724;
        font-size: 1.1em;
    }

    .round-header {
        background: linear-gradient(135deg, #4caf50, #45a049) !important;
        color: white;
        font-size: 0.9em;
        min-width: 60px;
    }

    .winner-announcement {
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white;
        padding: 20px;
        text-align: center;
        font-size: 1.3em;
        font-weight: bold;
        margin: 20px;
        border-radius: 10px;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0% {
            transform: scale(1);
        }

        50% {
            transform: scale(1.05);
        }

        100% {
            transform: scale(1);
        }
    }

    .game-over {
        opacity: 0.8;
    }

    .game-over .score-input {
        pointer-events: none;
    }

    .stats {
        display: flex;
        justify-content: space-around;
        padding: 20px;
        background: #f8f9fa;
        border-top: 1px solid #e9ecef;
        flex-wrap: wrap;
        gap: 10px;
    }

    .stat-item {
        text-align: center;
        padding: 10px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        min-width: 100px;
    }

    .stat-value {
        font-size: 1.5em;
        font-weight: bold;
        color: #007bff;
    }

    .stat-label {
        font-size: 0.9em;
        color: #6c757d;
        margin-top: 5px;
    }

    @media (max-width: 768px) {
        .header h1 {
            font-size: 1.8em;
        }

        .controls {
            flex-direction: column;
            align-items: center;
        }

        .btn {
            width: 100%;
            max-width: 200px;
        }

        .score-table {
            font-size: 0.9em;
        }

        .score-table th,
        .score-table td {
            padding: 8px 5px;
        }
    }
</style>
