const TILE_SIZE = 40;  // Jede Kachel ist 40x40 Pixel groß

// Beispiel-Karte: 1 = Wand, 0 = begehbar, 2 = Baum (Hindernis)
const map = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 2, 2, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1]
];

// Wände und Hindernisse auf der Karte zeichnen
function drawMap() {
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            if (map[row][col] === 1) {
                ctx.fillStyle = 'gray';  // Wand
                ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else if (map[row][col] === 2) {
                ctx.fillStyle = 'green';  // Hindernis (z.B. Baum)
                ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}

// Spieler- und Kollisionserkennung im gameLoop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();  // Zeichnet die Karte
    drawPlayer();  // Zeichnet den Spieler
    requestAnimationFrame(gameLoop);
}