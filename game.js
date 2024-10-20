// Spielfeld- und Kontextinitialisierung
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Tile-Größe für die Karte
const TILE_SIZE = 40;

// Spieler-Objekt
let player = {
    x: canvas.width / 2 - 20,
    y: canvas.height / 2 - 20,
    width: 40,
    height: 40,
    speed: 5,
    color: 'blue',
    kills: 0,
    assists: 0
};

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

// Funktion zum Prüfen von Kollisionen
function checkCollision(newX, newY) {
    const col = Math.floor(newX / TILE_SIZE);
    const row = Math.floor(newY / TILE_SIZE);
    if (map[row] && map[row][col] !== 0) {
        return true;  // Kollision gefunden
    }
    return false;
}

// Bewegung des Spielers mit Kollisionserkennung
document.addEventListener('keydown', function(event) {
    let newX = player.x;
    let newY = player.y;

    switch (event.key) {
        case 'w':  // Nach oben
            newY -= player.speed;
            break;
        case 's':  // Nach unten
            newY += player.speed;
            break;
        case 'a':  // Nach links
            newX -= player.speed;
            break;
        case 'd':  // Nach rechts
            newX += player.speed;
            break;
    }

    // Überprüfe, ob der neue Ort kollidiert
    if (!checkCollision(newX, newY)) {
        player.x = newX;
        player.y = newY;
    }
});

// Zeichne den Spieler auf dem Canvas
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Maschinenpistole (MP)
const MP = {
    image: new Image(),
    magazine: 30,  // 30 Schuss pro Magazin
    maxMagazine: 30,
    fireRate: 100,  // Dauerfeuer, schießt alle 100 Millisekunden
    isFiring: false, // Zustand für Dauerfeuer
    currentFrame: 0, // Aktueller Frame im Spritesheet
};

MP.image.src = 'assets/MP.png';  // Beispiel-Asset-Pfad

function fireMP() {
    if (MP.magazine > 0) {
        MP.isFiring = true;
        MP.magazine--;
        console.log("Schuss aus MP, verbleibende Schuss:", MP.magazine);
        if (MP.magazine === 0) {
            reloadMP();
        }
    }
}

function reloadMP() {
    setTimeout(() => {
        MP.magazine = MP.maxMagazine;
        console.log("MP nachgeladen");
    }, 2000);
}

// Pistole
const Pistol = {
    image: new Image(),
    magazine: 12,  // 12 Schuss pro Magazin
    maxMagazine: 12,
    fireRate: 300,  // Halbautomatisch, schießt alle 300 Millisekunden
};

Pistol.image.src = 'assets/Pistol.png';  // Beispiel-Asset-Pfad

function firePistol() {
    if (Pistol.magazine > 0) {
        Pistol.magazine--;
        console.log("Schuss aus Pistole, verbleibende Schuss:", Pistol.magazine);
        if (Pistol.magazine === 0) {
            reloadPistol();
        }
    }
}

function reloadPistol() {
    setTimeout(() => {
        Pistol.magazine = Pistol.maxMagazine;
        console.log("Pistole nachgeladen");
    }, 1500);
}

// Messer
const Messer = {
    image: new Image(),
    range: 30,  // Nahkampfbereich in Pixeln
    damage: 50, // Hoher Schaden
};

Messer.image.src = 'assets/Messer.png';  // Beispiel-Asset-Pfad

function attackWithMesser(player, enemy) {
    const distance = Math.sqrt((player.x - enemy.x) ** 2 + (player.y - enemy.y) ** 2);
    if (distance <= Messer.range) {
        enemy.health -= Messer.damage;
        console.log("Feind mit Messer getroffen, Schaden:", Messer.damage);
    }
}

// Waffenauswahl
let currentWeapon = Pistol;  // Standardwaffe

document.addEventListener('keydown', function(event) {
    if (event.key === '1') {
        currentWeapon = Pistol;
        console.log("Pistole ausgewählt");
    } else if (event.key === '2') {
        currentWeapon = MP;
        console.log("MP ausgewählt");
    } else if (event.key === '3') {
        currentWeapon = Messer;
        console.log("Messer ausgewählt");
    }
});

// Schießen basierend auf der aktuellen Waffe
document.addEventListener('click', function() {
    if (currentWeapon === MP) {
        fireMP();
    } else if (currentWeapon === Pistol) {
        firePistol();
    } else if (currentWeapon === Messer) {
        // Beispiel Feindobjekt für Nahkampf
        let enemy = {x: 300, y: 300, health: 100};  // Beispielhafte Feindposition und Gesundheit
        attackWithMesser(player, enemy);
        console.log("Feind Gesundheit:", enemy.health);
    }
});

// Firebase Integration

// Firebase Authentication
const auth = firebase.auth();

// Spieler-Registrierung
function signUp(email, password) {
    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            console.log("User signed up:", userCredential.user);
        })
        .catch(error => {
            console.error("Error signing up:", error.message);
        });
}

// Spieler-Login
function signIn(email, password) {
    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            console.log("User signed in:", userCredential.user);
        })
        .catch(error => {
            console.error("Error signing in:", error.message);
        });
}

// Realtime Database
const database = firebase.database();

// Spielerstatistiken in der Datenbank speichern
function updatePlayerStats(playerId, stats) {
    database.ref('players/' + playerId).set(stats);
}

// Beispiel: Speichere Statistiken nach einem Kill
function recordKill(playerId) {
    player.kills++;
    updatePlayerStats(playerId, { kills: player.kills, assists: player.assists });
}

// Spielerstatistiken abrufen
function getPlayerStats(playerId) {
    database.ref('players/' + playerId).once('value')
        .then(snapshot => {
            const stats = snapshot.val();
            console.log("Player stats:", stats);
        });
}

// Beispiel: Nach dem Login Statistiken laden
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("User logged in:", user.uid);
        getPlayerStats(user.uid);
    } else {
        console.log("User not logged in");
    }
});

// Haupt-Spielschleife
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();  // Zeichnet die Karte
    drawPlayer();  // Zeichnet den Spieler
    requestAnimationFrame(gameLoop);
}

gameLoop();