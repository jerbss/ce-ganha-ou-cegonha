import kaplay from "kaplay";

const k = kaplay({
    width: 1280,
    height: 720,
    letterbox: true,
    background: [18, 18, 20], // #121214 - Asfalto noturno
});

k.scene("game", () => {
    // 1. Constantes da M�quina de Scroll
    const BASE_SCROLL_SPEED = 400;
    const ACCEL_SCROLL_SPEED = 1000;
    const BRAKE_SCROLL_SPEED = 150;
    let currentScrollSpeed = BASE_SCROLL_SPEED;

    // 2. Vari�veis de Movimento (Eixo X)
    const REST_X = 200;
    const ACCEL_X = 500;
    const BRAKE_X = 100;

    // 3. Sistema de Grid (5 Faixas)
    // 0: Pista Cima | 1: Corredor Cima | 2: Pista Meio | 3: Corredor Baixo | 4: Pista Baixo
    const LANES = [250, 310, 370, 430, 490];
    let currentLane = 2; // Come�a no meio
    let isChangingLane = false;

    // Desenhar Fundo para visualiza��o clara do Asfalto
    // Y: 210 a 530 (Altura = 320)
    k.add([k.rect(1280, 320), k.pos(0, 210), k.color(35, 35, 37), k.z(0)]);

    // Linhas Amarelas demarcando os corredores
    let distanceToNextSpawn = 0;
    const SPACING = 250; // Espa�amento perfeito independentemente da vel.

    k.onUpdate(() => {
        distanceToNextSpawn -= currentScrollSpeed * k.dt();
        if (distanceToNextSpawn <= 0) {
            // Corredor de Cima (Em Y: 306)
            k.add([
                k.rect(120, 4),
                k.pos(k.width() + 50, 306),
                k.anchor("center"),
                k.color(255, 200, 0), // Amarelo
                k.z(1),
                "roadline"
            ]);
            // Corredor de Baixo (Em Y: 426)
            k.add([
                k.rect(120, 4),
                k.pos(k.width() + 50, 426),
                k.anchor("center"),
                k.color(255, 200, 0), // Amarelo
                k.z(1),
                "roadline"
            ]);
            distanceToNextSpawn = SPACING;
        }
    });

    // Deslocamento da rua
    k.onUpdate("roadline", (line) => {
        line.move(-currentScrollSpeed, 0);
        if (line.pos.x < -200) line.destroy();
    });

    // 4. O Protagonista (A Moto)
    const player = k.add([
        k.rect(54, 20, { radius: 3 }), // Esguia
        k.pos(REST_X, LANES[currentLane]),
        k.anchor("center"),
        k.color(0, 150, 255),
        k.area(),
        k.z(10), // SEMPRE em cima de tudo
        "player"
    ]);

    // 5. Troca de Faixas (Y eixo)
    const moveLane = (dir: number) => {
        if (isChangingLane) return;
        const nextLane = currentLane + dir;
        
        if (nextLane >= 0 && nextLane < LANES.length) {
            isChangingLane = true;
            currentLane = nextLane;
            
            k.tween(
                player.pos.y, 
                LANES[currentLane], 
                0.12, 
                (val) => player.pos.y = val, 
                k.easings.easeOutQuad
            ).onEnd(() => {
                isChangingLane = false;
            });
        }
    };

    k.onKeyPress(["up", "w"], () => moveLane(-1));
    k.onKeyPress(["down", "s"], () => moveLane(1));

    // 6. Sistema de Motor (Acelerar/Freio) e velocidade implac�vel global
    k.onUpdate(() => {
        let targetX = REST_X;
        let targetSpeed = BASE_SCROLL_SPEED;

        const isAccelerating = k.isKeyDown("right") || k.isKeyDown("d");
        const isBraking = k.isKeyDown("left") || k.isKeyDown("a");

        if (isAccelerating && !isBraking) {
            targetX = ACCEL_X;
            targetSpeed = ACCEL_SCROLL_SPEED;
        } else if (isBraking && !isAccelerating) {
            targetX = BRAKE_X;
            targetSpeed = BRAKE_SCROLL_SPEED;
        }

        // Regra de Velocidade do Corredor: Punição Tática!
        // O corredor serve apenas para esquiva de emergência. Ficar nele
        // penaliza muito o tempo do trajeto e força a moto para trás,
        // perdendo toda a aceleração que o jogador construiu.
        if (currentLane % 2 !== 0) { 
            targetSpeed = BASE_SCROLL_SPEED * 0.5; // Velocidade cai drasticamente
            targetX = BRAKE_X; // A moto é "arrastada" para trás na tela
        }

        // Inércia mais realista para aceleração e frenagem no mundo real
        player.pos.x = k.lerp(player.pos.x, targetX, 1.8 * k.dt());
        currentScrollSpeed = k.lerp(currentScrollSpeed, targetSpeed, 2.0 * k.dt());
    });

    // HUD Debug Simplificado
    k.add([
        k.text("Setas CIMA/BAIXO: Mudar Faixa  |  DIR: Acelerar  |  ESQ: Freio", { size: 18 }),
        k.pos(20, 20),
        k.color(200, 200, 200)
    ]);
    
    const speedometer = k.add([
        k.text("", { size: 24 }),
        k.pos(20, 50),
        k.color(255, 255, 0)
    ]);

    k.onUpdate(() => {
        speedometer.text = `Scroll Vel: ${Math.round(currentScrollSpeed)} px/s`;
    });
});

k.go("game");
