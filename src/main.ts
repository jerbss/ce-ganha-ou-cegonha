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

    // ---- SISTEMA DE TRÁFEGO (NPCs) ----
    const spawnCar = () => {
        const carLanes = [0, 2, 4]; // Apenas faixas PAR
        const pickedLane = carLanes[Math.floor(k.rand(0, carLanes.length))];
        
        const randVal = Math.random();
        let archetype;

        if (randVal < 0.33) {
            // LENTO: Surge na direita. Cor cinza.
            archetype = { type: 'LENTO', realSpeed: 250, color: k.rgb(150, 150, 150), startX: k.width() + 200 };
        } else if (randVal < 0.66) {
            // NORMAL: Surge na direita. Cor azul escuro.
            archetype = { type: 'NORMAL', realSpeed: 500, color: k.rgb(30, 40, 100), startX: k.width() + 200 };
        } else {
            // APRESSADO: Surge da esquerda. Vermelho ou prata.
            archetype = { type: 'APRESSADO', 
                          realSpeed: 950, 
                          color: Math.random() > 0.5 ? k.rgb(200, 40, 40) : k.rgb(220, 220, 220), 
                          startX: -200 };
            
            // Aborta o spawn mágico se o jogador tiver sido punido e estiver lá atrás na tela (-200 a 50)
            if (player.pos.x < 50) return;
        }

        const car = k.add([
            k.rect(140, 40, { radius: 4 }),
            k.pos(archetype.startX, LANES[pickedLane]),
            k.anchor("center"),
            k.color(archetype.color),
            k.area(),
            k.z(5),
            "car",
            { realSpeed: archetype.realSpeed }
        ]);

        car.onUpdate(() => {
            // Detecção de carro na frente (mesma faixa, próximo)
            const carsAhead = k.get("car").filter((c: any) => {
                const sameY = Math.abs(c.pos.y - car.pos.y) < 5; // Mesma faixa
                const ahead = c.pos.x > car.pos.x && c.pos.x - car.pos.x < 200; // Até 200px à frente
                return sameY && ahead && c !== car;
            });

            // Se houver carro na frente, reduz velocidade para engarrafamento realista
            let adjustedRealSpeed = car.realSpeed;
            if (carsAhead.length > 0) {
                adjustedRealSpeed = Math.min(car.realSpeed, (carsAhead[0] as any).realSpeed - 50); // Acompanha o de frente com margem
            }

            // Velocidade Absoluta: física de relatividade realista
            const screenSpeed = adjustedRealSpeed - currentScrollSpeed;
            car.move(screenSpeed, 0);
            
            // Limpeza: destrói se sair demais tanto pela esquerda quanto pela direita
            if (car.pos.x < -300 || car.pos.x > k.width() + 300) {
                car.destroy();
            }
        });
    };

    const loopSpawn = () => {
        k.wait(k.rand(1.5, 3.0), () => {
            // Limita a quantidade de instâncias geradas pra não entupir de forma punitiva a tela
            if (k.get("car").length < 6) {
                spawnCar();
            }
            loopSpawn(); // Chama recursivamente
        });
    };
    loopSpawn();

    // ---- COLISÕES ----
    player.onCollide("car", (car: any) => {
        k.shake(8); // Impacto forte
        currentScrollSpeed = 50; // Perda brusca e instantânea da inércia
        player.pos.x -= 80; // A moto capota pra trás no cenário
        car.destroy(); // Carro abatido some pra abrir alas

        // Moto pisca em vermelho para mostrar que tomou porrada
        player.color = k.rgb(255, 50, 50);
        k.wait(0.5, () => {
            player.color = k.rgb(0, 150, 255); // Cor sólida restaurada
        });
    });

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
