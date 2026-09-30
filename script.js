// ======================================================
// KNIGHTFALL: GUARDIAN OF THE DARK REALM
// Vanilla JavaScript Canvas Game
// ======================================================


// ======================================================
// CANVAS
// ======================================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


// ======================================================
// SCREENS
// ======================================================

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");

const gameOverScreen =
    document.getElementById("gameOverScreen");

const victoryScreen =
    document.getElementById("victoryScreen");


// ======================================================
// HUD
// ======================================================

const healthDisplay =
    document.getElementById("health");

const crystalDisplay =
    document.getElementById("crystals");

const scoreDisplay =
    document.getElementById("score");

const worldDisplay =
    document.getElementById("world");


// ======================================================
// GAME VARIABLES
// ======================================================

let gameRunning = false;

let gameOver = false;

let gameWon = false;

let selectedDifficulty = "easy";

let currentWorld = 1;

let score = 0;

let crystals = 0;

let cameraX = 0;

let levelComplete = false;


// ======================================================
// DIFFICULTY SETTINGS
// ======================================================

const difficultySettings = {

    easy: {

        health: 5,

        enemySpeed: 1.2,

        enemyCount: 5,

        bossHealth: 20

    },

    normal: {

        health: 4,

        enemySpeed: 1.8,

        enemyCount: 8,

        bossHealth: 30

    },

    hard: {

        health: 3,

        enemySpeed: 2.5,

        enemyCount: 12,

        bossHealth: 40

    }

};


// ======================================================
// WORLD SETTINGS
// ======================================================

const worlds = [

    {

        name: "Emerald Forest",

        background: "#86efac",

        ground: "#166534",

        platform: "#15803d"

    },

    {

        name: "Crystal Caverns",

        background: "#67e8f9",

        ground: "#164e63",

        platform: "#0891b2"

    },

    {

        name: "Dark Castle",

        background: "#64748b",

        ground: "#1e293b",

        platform: "#334155"

    },

    {

        name: "Dark Lord's Chamber",

        background: "#1e1b4b",

        ground: "#111827",

        platform: "#312e81"

    }

];


// ======================================================
// KEYBOARD
// ======================================================

const keys = {};

document.addEventListener("keydown", function(event) {

    keys[event.key.toLowerCase()] = true;

    if (event.code === "Space") {

        keys["space"] = true;

        event.preventDefault();

    }

    if (event.key.toLowerCase() === "x") {

        keys["x"] = true;

    }

    if (
        event.key.toLowerCase() === "r" &&
        gameOver
    ) {

        location.reload();

    }

});


document.addEventListener("keyup", function(event) {

    keys[event.key.toLowerCase()] = false;

    if (event.code === "Space") {

        keys["space"] = false;

    }

    if (event.key.toLowerCase() === "x") {

        keys["x"] = false;

    }

});


// ======================================================
// PLAYER
// ======================================================

const player = {

    x: 100,

    y: 400,

    width: 40,

    height: 55,

    velocityX: 0,

    velocityY: 0,

    speed: 5,

    jumpPower: 13,

    gravity: 0.6,

    health: 5,

    grounded: false,

    direction: 1,

    shootCooldown: 0

};


// ======================================================
// GAME ARRAYS
// ======================================================

let platforms = [];

let enemies = [];

let bullets = [];

let enemyBullets = [];

let collectibles = [];


// ======================================================
// BOSS
// ======================================================

let boss = null;


// ======================================================
// LEVEL WIDTH
// ======================================================

const LEVEL_WIDTH = 5000;


// ======================================================
// START GAME
// ======================================================

function startGame(difficulty) {

    selectedDifficulty = difficulty;

    const settings =
        difficultySettings[selectedDifficulty];

    player.health = settings.health;

    player.x = 100;

    player.y = 400;

    player.velocityX = 0;

    player.velocityY = 0;

    score = 0;

    crystals = 0;

    currentWorld = 1;

    cameraX = 0;

    gameOver = false;

    gameWon = false;

    levelComplete = false;

    startScreen.classList.add("hidden");

    gameOverScreen.classList.add("hidden");

    victoryScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");

    createLevel();

    updateHUD();

    gameRunning = true;

    requestAnimationFrame(gameLoop);

}


// ======================================================
// DIFFICULTY BUTTONS
// ======================================================

document
    .querySelectorAll(".difficulty")
    .forEach(function(button) {

        button.addEventListener("click", function() {

            startGame(
                button.dataset.difficulty
            );

        });

    });


// ======================================================
// CREATE LEVEL
// ======================================================

function createLevel() {

    platforms = [];

    enemies = [];

    bullets = [];

    enemyBullets = [];

    collectibles = [];

    boss = null;

    levelComplete = false;

    player.x = 100;

    player.y = 400;

    player.velocityX = 0;

    player.velocityY = 0;


    // ----------------------------------------
    // Ground
    // ----------------------------------------

    platforms.push({

        x: 0,

        y: 540,

        width: LEVEL_WIDTH,

        height: 60

    });


    // ----------------------------------------
    // Platforms
    // ----------------------------------------

    const platformPositions = [

        [400, 450, 180, 25],

        [700, 380, 180, 25],

        [1000, 470, 200, 25],

        [1300, 350, 180, 25],

        [1600, 430, 200, 25],

        [1950, 330, 180, 25],

        [2250, 450, 220, 25],

        [2600, 360, 180, 25],

        [2900, 280, 200, 25],

        [3250, 420, 200, 25],

        [3550, 330, 180, 25],

        [3850, 250, 220, 25],

        [4200, 400, 200, 25],

        [4500, 300, 180, 25]

    ];


    platformPositions.forEach(function(pos) {

        platforms.push({

            x: pos[0],

            y: pos[1],

            width: pos[2],

            height: pos[3]

        });

    });


    // ----------------------------------------
    // Enemies
    // ----------------------------------------

    const settings =
        difficultySettings[selectedDifficulty];

    const enemyPositions = [

        600,

        850,

        1150,

        1450,

        1750,

        2100,

        2400,

        2750,

        3100,

        3400,

        3700,

        4000,

        4300,

        4600

    ];


    const amount =
        settings.enemyCount + currentWorld;


    for (
        let i = 0;
        i < amount && i < enemyPositions.length;
        i++
    ) {

        createEnemy(enemyPositions[i]);

    }


    // ----------------------------------------
    // Crystals
    // ----------------------------------------

    const crystalPositions = [

        450,

        750,

        1050,

        1350,

        1650,

        2000,

        2300,

        2650,

        3000,

        3300,

        3600,

        3900,

        4250,

        4550

    ];


    crystalPositions.forEach(function(x) {

        collectibles.push({

            x: x,

            y: 300,

            width: 20,

            height: 20,

            collected: false

        });

    });

}


// ======================================================
// CREATE ENEMY
// ======================================================

function createEnemy(x) {

    const settings =
        difficultySettings[selectedDifficulty];


    enemies.push({

        x: x,

        y: 480,

        width: 40,

        height: 50,

        velocityY: 0,

        speed:
            settings.enemySpeed +
            (currentWorld - 1) * 0.4,

        direction: -1,

        health: 2

    });

}


// ======================================================
// CREATE BOSS
// ======================================================

function createBoss() {

    const settings =
        difficultySettings[selectedDifficulty];


    boss = {

        x: 4300,

        y: 390,

        width: 100,

        height: 120,

        health: settings.bossHealth,

        maxHealth: settings.bossHealth,

        speed: 2,

        direction: -1,

        shootTimer: 0

    };

}


// ======================================================
// COLLISION
// ======================================================

function collision(a, b) {

    return (

        a.x < b.x + b.width &&

        a.x + a.width > b.x &&

        a.y < b.y + b.height &&

        a.y + a.height > b.y

    );

}


// ======================================================
// PLAYER MOVEMENT
// ======================================================

function updatePlayer() {

    player.velocityX = 0;


    if (keys["arrowleft"] || keys["a"]) {

        player.velocityX = -player.speed;

        player.direction = -1;

    }


    if (keys["arrowright"] || keys["d"]) {

        player.velocityX = player.speed;

        player.direction = 1;

    }


    // ----------------------------------------
    // Jump
    // ----------------------------------------

    if (
        keys["space"] &&
        player.grounded
    ) {

        player.velocityY =
            -player.jumpPower;

        player.grounded = false;

        keys["space"] = false;

    }


    // ----------------------------------------
    // Gravity
    // ----------------------------------------

    player.velocityY += player.gravity;


    player.x += player.velocityX;

    player.y += player.velocityY;


    // ----------------------------------------
    // Level boundaries
    // ----------------------------------------

    if (player.x < 0) {

        player.x = 0;

    }

    if (
        player.x >
        LEVEL_WIDTH - player.width
    ) {

        player.x =
            LEVEL_WIDTH - player.width;

    }


    // ----------------------------------------
    // Platform collision
    // ----------------------------------------

    player.grounded = false;


    platforms.forEach(function(platform) {

        if (

            player.x <
            platform.x + platform.width &&

            player.x + player.width >
            platform.x &&

            player.y + player.height >
            platform.y &&

            player.y + player.height <
            platform.y +
            platform.height +
            20 &&

            player.velocityY >= 0

        ) {

            player.y =
                platform.y -
                player.height;

            player.velocityY = 0;

            player.grounded = true;

        }

    });


    // ----------------------------------------
    // Falling
    // ----------------------------------------

    if (player.y > canvas.height + 100) {

        takeDamage();

        player.x = 100;

        player.y = 300;

    }


    // ----------------------------------------
    // Shooting
    // ----------------------------------------

    if (player.shootCooldown > 0) {

        player.shootCooldown--;

    }


    if (
        keys["x"] &&
        player.shootCooldown <= 0
    ) {

        shoot();

        player.shootCooldown = 15;

    }

}


// ======================================================
// SHOOT
// ======================================================

function shoot() {

    bullets.push({

        x:
            player.x +
            player.width / 2,

        y:
            player.y + 20,

        width: 12,

        height: 6,

        speed:
            10 *
            player.direction

    });

}


// ======================================================
// UPDATE BULLETS
// ======================================================

function updateBullets() {

    bullets.forEach(function(bullet) {

        bullet.x += bullet.speed;

    });


    bullets =
        bullets.filter(function(bullet) {

            return (
                bullet.x > 0 &&
                bullet.x < LEVEL_WIDTH
            );

        });


    // ----------------------------------------
    // Bullet vs enemies
    // ----------------------------------------

    bullets.forEach(function(bullet) {

        enemies.forEach(function(enemy) {

            if (collision(bullet, enemy)) {

                enemy.health--;

                bullet.x = -100;

                if (enemy.health <= 0) {

                    enemy.dead = true;

                    score += 25;

                }

            }

        });


        // ------------------------------------
        // Bullet vs boss
        // ------------------------------------

        if (
            boss &&
            collision(bullet, boss)
        ) {

            boss.health--;

            bullet.x = -100;

            score += 5;

        }

    });


    enemies =
        enemies.filter(function(enemy) {

            return !enemy.dead;

        });


    // ----------------------------------------
    // Enemy bullets
    // ----------------------------------------

    enemyBullets.forEach(function(bullet) {

        bullet.x += bullet.speedX;

        bullet.y += bullet.speedY;

    });


    enemyBullets =
        enemyBullets.filter(function(bullet) {

            return (
                bullet.x > 0 &&
                bullet.x < LEVEL_WIDTH &&
                bullet.y > 0 &&
                bullet.y < canvas.height
            );

        });


    enemyBullets.forEach(function(bullet) {

        if (collision(bullet, player)) {

            bullet.x = -100;

            takeDamage();

        }

    });

}


// ======================================================
// UPDATE ENEMIES
// ======================================================

function updateEnemies() {

    enemies.forEach(function(enemy) {

        enemy.x +=
            enemy.speed *
            enemy.direction;


        // Turn around periodically

        if (
            enemy.x < 0 ||
            enemy.x > LEVEL_WIDTH
        ) {

            enemy.direction *= -1;

        }


        // Gravity

        enemy.velocityY += 0.5;

        enemy.y += enemy.velocityY;


        // Platform collision

        platforms.forEach(function(platform) {

            if (

                enemy.x <
                platform.x + platform.width &&

                enemy.x + enemy.width >
                platform.x &&

                enemy.y + enemy.height >
                platform.y &&

                enemy.y + enemy.height <
                platform.y + 30 &&

                enemy.velocityY >= 0

            ) {

                enemy.y =
                    platform.y -
                    enemy.height;

                enemy.velocityY = 0;

            }

        });


        // Player collision

        if (collision(enemy, player)) {

            takeDamage();

            enemy.x +=
                enemy.direction * -80;

        }

    });

}


// ======================================================
// UPDATE BOSS
// ======================================================

function updateBoss() {

    if (!boss) {

        return;

    }


    boss.x +=
        boss.speed *
        boss.direction;


    if (
        boss.x < 3900 ||
        boss.x > 4700
    ) {

        boss.direction *= -1;

    }


    boss.shootTimer--;


    if (boss.shootTimer <= 0) {

        bossShoot();

        boss.shootTimer = 90;

    }


    // Boss contact damage

    if (collision(boss, player)) {

        takeDamage();

    }


    // Boss defeated

    if (boss.health <= 0) {

        boss = null;

        score += 1000;

        winGame();

    }

}


// ======================================================
// BOSS SHOOTING
// ======================================================

function bossShoot() {

    if (!boss) {

        return;

    }


    const direction =
        player.x > boss.x ? 1 : -1;


    enemyBullets.push({

        x: boss.x + boss.width / 2,

        y: boss.y + boss.height / 2,

        width: 15,

        height: 15,

        speedX: 5 * direction,

        speedY: 0

    });


    // Extra diagonal projectile

    enemyBullets.push({

        x: boss.x + boss.width / 2,

        y: boss.y + boss.height / 2,

        width: 12,

        height: 12,

        speedX: 4 * direction,

        speedY: -2

    });

}


// ======================================================
// COLLECTIBLES
// ======================================================

function updateCollectibles() {

    collectibles.forEach(function(item) {

        if (
            !item.collected &&
            collision(player, item)
        ) {

            item.collected = true;

            crystals++;

            score += 50;

        }

    });

}


// ======================================================
// DAMAGE
// ======================================================

function takeDamage() {

    if (gameOver || gameWon) {

        return;

    }


    player.health--;


    updateHUD();


    if (player.health <= 0) {

        loseGame();

    }

}


// ======================================================
// LEVEL PROGRESSION
// ======================================================

function checkProgress() {

    // Normal worlds

    if (
        currentWorld < 3 &&
        player.x > LEVEL_WIDTH - 300 &&
        !levelComplete
    ) {

        levelComplete = true;

        currentWorld++;

        createLevel();

        return;

    }


    // Final world

    if (
        currentWorld === 3 &&
        player.x > 4100 &&
        !boss
    ) {

        createBoss();

    }

}


// ======================================================
// CAMERA
// ======================================================

function updateCamera() {

    cameraX =
        player.x -
        canvas.width / 2;


    if (cameraX < 0) {

        cameraX = 0;

    }


    const maxCamera =
        LEVEL_WIDTH -
        canvas.width;


    if (cameraX > maxCamera) {

        cameraX = maxCamera;

    }

}


// ======================================================
// DRAW BACKGROUND
// ======================================================

function drawBackground() {

    const world =
        worlds[currentWorld - 1];


    ctx.fillStyle =
        world.background;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Sky / atmosphere circles

    ctx.save();

    ctx.globalAlpha = 0.2;

    ctx.fillStyle = "#ffffff";

    for (
        let i = 0;
        i < 8;
        i++
    ) {

        const x =
            (i * 300) -
            (cameraX * 0.2);

        ctx.beginPath();

        ctx.arc(
            x,
            100 + (i % 3) * 70,
            50,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

    ctx.restore();


    // World title

    ctx.fillStyle = "white";

    ctx.font = "bold 22px Arial";

    ctx.fillText(
        world.name,
        20,
        35
    );

}


// ======================================================
// DRAW PLATFORMS
// ======================================================

function drawPlatforms() {

    const world =
        worlds[currentWorld - 1];


    platforms.forEach(function(platform) {

        ctx.fillStyle =
            world.ground;

        ctx.fillRect(

            platform.x - cameraX,

            platform.y,

            platform.width,

            platform.height

        );


        // Platform top

        if (platform.height < 40) {

            ctx.fillStyle =
                world.platform;

            ctx.fillRect(

                platform.x - cameraX,

                platform.y,

                platform.width,

                8

            );

        }

    });

}


// ======================================================
// DRAW PLAYER
// ======================================================

function drawPlayer() {

    const x =
        player.x - cameraX;


    // Cape

    ctx.fillStyle = "#dc2626";

    ctx.fillRect(

        x - 8,

        player.y + 20,

        12,

        30

    );


    // Body armor

    ctx.fillStyle = "#94a3b8";

    ctx.fillRect(

        x + 8,

        player.y + 20,

        25,

        30

    );


    // Helmet

    ctx.fillStyle = "#cbd5e1";

    ctx.fillRect(

        x + 7,

        player.y,

        28,

        25

    );


    // Helmet visor

    ctx.fillStyle = "#1e293b";

    ctx.fillRect(

        x + 15,

        player.y + 8,

        20,

        6

    );


    // Sword

    ctx.strokeStyle = "#e5e7eb";

    ctx.lineWidth = 5;

    ctx.beginPath();

    ctx.moveTo(

        x + 35,

        player.y + 30

    );

    ctx.lineTo(

        x + 55 * player.direction,

        player.y + 10

    );

    ctx.stroke();


    // Gun

    ctx.fillStyle = "#7c3aed";

    ctx.fillRect(

        x + 25,

        player.y + 30,

        25 * player.direction,

        8

    );

}


// ======================================================
// DRAW ENEMIES
// ======================================================

function drawEnemies() {

    enemies.forEach(function(enemy) {

        const x =
            enemy.x - cameraX;


        // Body

        ctx.fillStyle = "#7f1d1d";

        ctx.fillRect(

            x,

            enemy.y + 15,

            enemy.width,

            35

        );


        // Head

        ctx.fillStyle = "#991b1b";

        ctx.beginPath();

        ctx.arc(

            x + 20,

            enemy.y + 12,

            15,

            0,

            Math.PI * 2

        );

        ctx.fill();


        // Eyes

        ctx.fillStyle = "#facc15";

        ctx.fillRect(

            x + 10,

            enemy.y + 9,

            5,

            5

        );

        ctx.fillRect(

            x + 25,

            enemy.y + 9,

            5,

            5

        );

    });

}


// ======================================================
// DRAW COLLECTIBLES
// ======================================================

function drawCollectibles() {

    collectibles.forEach(function(item) {

        if (item.collected) {

            return;

        }


        const x =
            item.x - cameraX;


        ctx.fillStyle = "#a855f7";

        ctx.beginPath();

        ctx.moveTo(
            x + 10,
            item.y
        );

        ctx.lineTo(
            x + 20,
            item.y + 10
        );

        ctx.lineTo(
            x + 10,
            item.y + 20
        );

        ctx.lineTo(
            x,
            item.y + 10
        );

        ctx.closePath();

        ctx.fill();


        ctx.strokeStyle = "#f5d0fe";

        ctx.stroke();

    });

}


// ======================================================
// DRAW BULLETS
// ======================================================

function drawBullets() {

    bullets.forEach(function(bullet) {

        ctx.fillStyle = "#facc15";

        ctx.fillRect(

            bullet.x - cameraX,

            bullet.y,

            bullet.width,

            bullet.height

        );

    });


    enemyBullets.forEach(function(bullet) {

        ctx.fillStyle = "#ef4444";

        ctx.beginPath();

        ctx.arc(

            bullet.x - cameraX,

            bullet.y,

            7,

            0,

            Math.PI * 2

        );

        ctx.fill();

    });

}


// ======================================================
// DRAW BOSS
// ======================================================

function drawBoss() {

    if (!boss) {

        return;

    }


    const x =
        boss.x - cameraX;


    // Boss body

    ctx.fillStyle = "#312e81";

    ctx.fillRect(

        x,

        boss.y,

        boss.width,

        boss.height

    );


    // Helmet

    ctx.fillStyle = "#111827";

    ctx.fillRect(

        x + 15,

        boss.y - 20,

        70,

        30

    );


    // Eyes

    ctx.fillStyle = "#ef4444";

    ctx.fillRect(

        x + 30,

        boss.y - 10,

        10,

        8

    );

    ctx.fillRect(

        x + 60,

        boss.y - 10,

        10,

        8

    );


    // Boss health background

    ctx.fillStyle = "#450a0a";

    ctx.fillRect(

        x,

        boss.y - 45,

        boss.width,

        15

    );


    // Boss health

    ctx.fillStyle = "#ef4444";

    ctx.fillRect(

        x,

        boss.y - 45,

        boss.width *
        (boss.health / boss.maxHealth),

        15

    );


    ctx.fillStyle = "white";

    ctx.font = "bold 14px Arial";

    ctx.fillText(

        "DARK LORD",

        x + 15,

        boss.y + 65

    );

}


// ======================================================
// DRAW EXIT
// ======================================================

function drawExit() {

    if (currentWorld >= 3) {

        return;

    }


    const exitX =
        LEVEL_WIDTH - 200;


    ctx.fillStyle = "#facc15";

    ctx.fillRect(

        exitX - cameraX,

        390,

        80,

        150

    );


    ctx.fillStyle = "#7c2d12";

    ctx.fillRect(

        exitX + 15 - cameraX,

        420,

        50,

        120

    );


    ctx.fillStyle = "white";

    ctx.font = "bold 16px Arial";

    ctx.fillText(

        "EXIT",

        exitX + 18 - cameraX,

        410

    );

}


// ======================================================
// DRAW EVERYTHING
// ======================================================

function drawGame() {

    drawBackground();

    drawPlatforms();

    drawExit();

    drawCollectibles();

    drawEnemies();

    drawBullets();

    drawBoss();

    drawPlayer();

}


// ======================================================
// HUD
// ======================================================

function updateHUD() {

    healthDisplay.textContent =
        player.health;

    crystalDisplay.textContent =
        crystals;

    scoreDisplay.textContent =
        score;

    worldDisplay.textContent =
        currentWorld;
}


// ======================================================
// GAME OVER
// ======================================================

function loseGame() {

    gameOver = true;

    gameRunning = false;

    document.getElementById(
        "finalScore"
    ).textContent = score;


    gameScreen.classList.add("hidden");

    gameOverScreen.classList.remove("hidden");

}


// ======================================================
// VICTORY
// ======================================================

function winGame() {

    gameWon = true;

    gameRunning = false;

    document.getElementById(
        "victoryScore"
    ).textContent = score;


    gameScreen.classList.add("hidden");

    victoryScreen.classList.remove("hidden");

}


// ======================================================
// RESTART BUTTONS
// ======================================================

document
    .getElementById("restartButton")
    .addEventListener("click", function() {

        location.reload();

    });


document
    .getElementById("victoryRestart")
    .addEventListener("click", function() {

        location.reload();

    });


// ======================================================
// MAIN GAME LOOP
// ======================================================

function gameLoop() {

    if (!gameRunning) {

        return;

    }


    updatePlayer();

    updateEnemies();

    updateBullets();

    updateCollectibles();

    updateBoss();

    checkProgress();

    updateCamera();

    updateHUD();

    drawGame();


    requestAnimationFrame(gameLoop);

}


// ======================================================
// INITIAL DRAW
// ======================================================

function initialDraw() {

    ctx.fillStyle = "#111827";

    ctx.fillRect(

        0,

        0,

        canvas.width,

        canvas.height

    );

}


initialDraw();
