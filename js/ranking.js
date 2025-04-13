const socket = new WebSocket("wss://gamehubmanager-ucp2025.azurewebsites.net/ws");

socket.onmessage = function(event) {
    try {
        const data = JSON.parse(event.data);

        if (data.players && Array.isArray(data.players)) {
            const sortedPlayers = data.players.sort((a, b) => b.score - a.score);
            const topPlayers = sortedPlayers.slice(0, 5);

            let html = "";
            topPlayers.forEach((player, index) => {
                html += `Rank ${index + 1}: ${player.name} (${player.score})<br>`;
            });

            document.getElementById("ranking-content").innerHTML = html;
        }
    } catch (err) {
        console.error("Error procesando datos de ranking:", err);
        document.getElementById("ranking-content").innerText = "Error cargando ranking.";
    }
};

socket.onerror = function(error) {
    console.error("WebSocket error:", error);
    document.getElementById("ranking-content").innerText = "Conexión fallida.";
};
