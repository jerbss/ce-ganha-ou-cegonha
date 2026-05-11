import kaplay from "kaplay";

const k = kaplay({
    width: 1280,
    height: 720,
    letterbox: true,
    background: [18, 18, 20],
});

const WIDTH = k.width();
const HEIGHT = k.height();

const roadTop = HEIGHT * 0.3;
const roadHeight = HEIGHT * 0.4;
const lanePositions = [
    roadTop + roadHeight * 0.35,
    roadTop + roadHeight * 0.65,
];
const corridorY = (lanePositions[0] + lanePositions[1]) / 2;

const PLAYER_X = WIDTH * 0.2;
const BASE_SPEED = 260;
const LANE_SWITCH_SPEED = 700;

const MAX_STRESS = 100;
const BASE_TIME = 180;

const HOLE_DAMAGE = 15;
const BLOCK_DAMAGE = 25;
const CHAT_PENALTY = 5;
const HORN_STRESS = 5;
const HORN_COOLDOWN = 2.5;

const CHAT_TIMEOUT = 2.5;

const randRange = (min: number, max: number) => min + Math.random() * (max - min);
const randChoice = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

// Cenario (asfalto)
k.add([
    k.rect(WIDTH, roadHeight),
    k.pos(0, roadTop),
    k.color(32, 32, 32),
    k.anchor("topleft"),
]);

// Linha de corredor (aparece quando habilitado)
const corridorGuide = k.add([
    k.rect(WIDTH, 6),
    k.pos(0, corridorY - 3),
    k.color(200, 170, 0),
    k.anchor("topleft"),
]);
corridorGuide.hidden = true;

// Player (moto em greybox)
const player = k.add([
    k.rect(44, 26),
    k.pos(PLAYER_X, lanePositions[0]),
    k.anchor("center"),
    k.color(230, 60, 60),
    k.area(),
]);

// HUD
const timerText = k.add([
    k.text("Tempo: 180", { size: 24 }),
    k.pos(20, 16),
    k.color(240, 240, 240),
]);

k.add([
    k.text("Bebe", { size: 16 }),
    k.pos(20, 50),
    k.color(240, 240, 240),
]);

const stressBarBg = k.add([
    k.rect(200, 12),
    k.pos(70, 54),
    k.color(60, 60, 60),
    k.anchor("topleft"),
]);

const stressBarFill = k.add([
    k.rect(200, 12),
    k.pos(70, 54),
    k.color(200, 50, 50),
    k.anchor("topleft"),
]);

// Chat HUD
const chatBox = k.add([
    k.rect(520, 120),
    k.pos(WIDTH / 2, 90),
    k.anchor("center"),
    k.color(20, 20, 20),
]);

const chatText = k.add([
    k.text("", { size: 18, width: 480 }),
    k.pos(WIDTH / 2, 90),
    k.anchor("center"),
    k.color(230, 230, 230),
]);

chatBox.hidden = true;
chatText.hidden = true;

const hornText = k.add([
    k.text("Buzina: pronta", { size: 18 }),
    k.pos(WIDTH - 20, 16),
    k.anchor("topright"),
    k.color(240, 240, 240),
]);

let gameActive = true;
let timeLeft = BASE_TIME;
let stress = 0;

let currentLane = 0;
let targetY = lanePositions[0];

let corridorActive = false;
let allowRestart = false;

let holeSpawnTimer = randRange(1.2, 2.0);
let blockSpawnTimer = randRange(6, 10);
let markSpawnTimer = 0.3;

let chatActive = false;
let chatTimeLeft = 0;
let chatPenaltyApplied = false;
let chatCooldown = randRange(8, 14);

let isRaining = false;
let hornCooldown = 0;

const blocks: any[] = [];

const chatMessages = [
    "Ta chegando?",
    "Desce no portao, por favor",
    "Traz troco pra 50?",
    "Meu lanche precisa chegar quente",
    "O GPS parou aqui, e isso?",
];

const setLane = (laneIndex: number) => {
    if (laneIndex === 2 && !corridorActive) return;
    currentLane = laneIndex;
    if (laneIndex === 2) {
        targetY = corridorY;
    } else {
        targetY = lanePositions[laneIndex];
    }
};

// Controles
k.onKeyPress("up", () => {
    if (!gameActive) return;
    if (currentLane === 1) {
        setLane(corridorActive ? 2 : 0);
    } else if (currentLane === 2) {
        setLane(0);
    }
});

k.onKeyPress("down", () => {
    if (!gameActive) return;
    if (currentLane === 0) {
        setLane(corridorActive ? 2 : 1);
    } else if (currentLane === 2) {
        setLane(1);
    }
});

k.onKeyPress("space", () => {
    if (!gameActive) return;
    if (!chatActive) return;
    chatActive = false;
    chatPenaltyApplied = false;
    chatBox.hidden = true;
    chatText.hidden = true;
    chatCooldown = randRange(8, 14);
});

k.onKeyPress("h", () => {
    if (!gameActive) return;
    if (hornCooldown > 0) return;
    hornCooldown = HORN_COOLDOWN;
    applyDamage(HORN_STRESS);

    const target = blocks
        .filter((block) => block.laneIndex === currentLane)
        .filter((block) => block.pos.x > player.pos.x && block.pos.x < player.pos.x + 220)
        .sort((a, b) => a.pos.x - b.pos.x)[0];

    if (!target) return;

    const otherLane = currentLane === 0 ? 1 : 0;
    const blocked = blocks.some(
        (block) =>
            block !== target &&
            block.laneIndex === otherLane &&
            Math.abs(block.pos.x - target.pos.x) < 120,
    );

    if (!blocked) {
        target.laneIndex = otherLane;
        target.pos.y = lanePositions[otherLane];
        target.color = k.color(110, 110, 150);
    }
});

k.onKeyPress("r", () => {
    if (!allowRestart) return;
    window.location.reload();
});

// Obstaculos
const spawnHole = () => {
    const laneIndex = randChoice([0, 1]);
    const hole = k.add([
        k.rect(50, 18),
        k.pos(WIDTH + 60, lanePositions[laneIndex]),
        k.anchor("center"),
        k.color(70, 70, 70),
        k.area(),
        "hole",
    ]);

    hole.onUpdate(() => {
        if (!gameActive) return;
        hole.pos.x -= getScrollSpeed() * k.dt();
        if (hole.pos.x < -80) hole.destroy();
    });
};

const spawnBlock = () => {
    const laneIndex = randChoice([0, 1]);
    const speedOffset = randRange(-60, 60);
    const block = k.add([
        k.rect(110, 40),
        k.pos(WIDTH + 80, lanePositions[laneIndex]),
        k.anchor("center"),
        k.color(90, 90, 120),
        k.area(),
        "block",
    ]);

    block.laneIndex = laneIndex;
    block.speedOffset = speedOffset;
    blocks.push(block);

    block.onDestroy(() => {
        const index = blocks.indexOf(block);
        if (index >= 0) blocks.splice(index, 1);
    });

    block.onUpdate(() => {
        if (!gameActive) return;
        block.pos.x -= (getScrollSpeed() + block.speedOffset) * k.dt();
        if (block.pos.x < -120) block.destroy();
    });
};

// Marcas de pista
const spawnLaneMark = () => {
    const mark = k.add([
        k.rect(70, 4),
        k.pos(WIDTH + 60, corridorY),
        k.anchor("center"),
        k.color(80, 80, 80),
    ]);

    mark.onUpdate(() => {
        if (!gameActive) return;
        mark.pos.x -= getScrollSpeed() * k.dt();
        if (mark.pos.x < -100) mark.destroy();
    });
};

const getScrollSpeed = () => {
    let speedMod = 1.0;
    if (k.isKeyDown("right")) speedMod = 1.2;
    if (k.isKeyDown("left")) speedMod = 0.85;
    return BASE_SPEED * speedMod;
};

const applyDamage = (amount: number) => {
    stress = clamp(stress + amount, 0, MAX_STRESS);
    k.shake(6);
    if (stress >= MAX_STRESS) endGame("Bebe em desespero");
};

player.onCollide("hole", (obj) => {
    if (!gameActive) return;
    applyDamage(HOLE_DAMAGE);
    obj.destroy();
});

player.onCollide("block", (obj) => {
    if (!gameActive) return;
    applyDamage(BLOCK_DAMAGE);
    obj.destroy();
});

const endGame = (reason: string) => {
    gameActive = false;
    allowRestart = true;
    k.add([
        k.rect(WIDTH, HEIGHT),
        k.pos(0, 0),
        k.color(0, 0, 0),
        k.anchor("topleft"),
    ]);
    k.add([
        k.text("GAME OVER", { size: 48 }),
        k.pos(WIDTH / 2, HEIGHT / 2 - 20),
        k.anchor("center"),
        k.color(255, 80, 80),
    ]);
    k.add([
        k.text(reason, { size: 20 }),
        k.pos(WIDTH / 2, HEIGHT / 2 + 24),
        k.anchor("center"),
        k.color(220, 220, 220),
    ]);

    const button = k.add([
        k.rect(220, 46),
        k.pos(WIDTH / 2, HEIGHT / 2 + 90),
        k.anchor("center"),
        k.color(40, 40, 40),
    ]);

    k.add([
        k.text("Reiniciar (R)", { size: 18 }),
        k.pos(WIDTH / 2, HEIGHT / 2 + 90),
        k.anchor("center"),
        k.color(230, 230, 230),
    ]);

    k.onMousePress(() => {
        const m = k.mousePos();
        const halfW = 110;
        const halfH = 23;
        if (
            m.x >= button.pos.x - halfW &&
            m.x <= button.pos.x + halfW &&
            m.y >= button.pos.y - halfH &&
            m.y <= button.pos.y + halfH
        ) {
            window.location.reload();
        }
    });
};

// Loop principal
k.onUpdate(() => {
    if (!gameActive) return;

    // Timer geral
    timeLeft -= k.dt();
    if (timeLeft <= 0) {
        endGame("Tempo esgotado");
        return;
    }

    const elapsed = BASE_TIME - timeLeft;
    if (!isRaining && elapsed >= 60) {
        isRaining = true;
    }

    // Move player para a faixa alvo
    const laneSpeed = isRaining ? LANE_SWITCH_SPEED * 0.65 : LANE_SWITCH_SPEED;
    const diff = targetY - player.pos.y;
    const step = laneSpeed * k.dt();
    if (Math.abs(diff) <= step) {
        player.pos.y = targetY;
    } else {
        player.pos.y += Math.sign(diff) * step;
    }

    corridorActive = blocks.length > 0;
    corridorGuide.hidden = !corridorActive;
    if (!corridorActive && currentLane === 2) {
        setLane(player.pos.y < corridorY ? 0 : 1);
    }

    // Spawn de buracos
    holeSpawnTimer -= k.dt();
    if (holeSpawnTimer <= 0) {
        spawnHole();
        const interval = isRaining ? randRange(0.96, 1.6) : randRange(1.2, 2.0);
        holeSpawnTimer = interval;
    }

    // Spawn de bloqueios
    blockSpawnTimer -= k.dt();
    if (blockSpawnTimer <= 0) {
        spawnBlock();
        blockSpawnTimer = randRange(6, 10);
    }

    // Spawn de marcas de pista
    markSpawnTimer -= k.dt();
    if (markSpawnTimer <= 0) {
        spawnLaneMark();
        markSpawnTimer = 0.35;
    }

    // Chat spam
    if (!chatActive) {
        chatCooldown -= k.dt();
        if (chatCooldown <= 0) {
            chatActive = true;
            chatPenaltyApplied = false;
            chatTimeLeft = CHAT_TIMEOUT;
            chatBox.hidden = false;
            chatText.hidden = false;
            chatText.text = randChoice(chatMessages);
        }
    } else {
        chatTimeLeft -= k.dt();
        if (chatTimeLeft <= 0 && !chatPenaltyApplied) {
            chatPenaltyApplied = true;
            applyDamage(CHAT_PENALTY);
        }
    }

    // Atualiza HUD
    timerText.text = `Tempo: ${Math.ceil(timeLeft)}`;
    stressBarFill.scale = k.vec2(stress / MAX_STRESS, 1);

    if (hornCooldown > 0) {
        hornCooldown -= k.dt();
    }
    hornText.text =
        hornCooldown > 0
            ? `Buzina: ${hornCooldown.toFixed(1)}s`
            : "Buzina: pronta";
});
