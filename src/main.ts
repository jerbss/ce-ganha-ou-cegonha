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
    let corridorTimer = 0;
    const CORRIDOR_GRACE = 0.9; // seconds

    // Mapa de carros ativos por faixa (optimização O(n) por faixa)
    const activeCarsByLane: Record<number, any[]> = {
        0: [],
        2: [],
        4: []
    };

    const addCarToLane = (lane: number, car: any) => {
        if (!activeCarsByLane[lane]) activeCarsByLane[lane] = [];
        activeCarsByLane[lane].push(car);
    };

    const removeCarFromLane = (lane: number, car: any) => {
        const arr = activeCarsByLane[lane];
        if (!arr) return;
        const idx = arr.indexOf(car);
        if (idx !== -1) arr.splice(idx, 1);
    };

    const removeCarFromAllLanes = (car: any) => {
        for (const key of Object.keys(activeCarsByLane)) {
            removeCarFromLane(Number(key), car);
        }
    };

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
        }

        // Evitar spawn sobreposto: verificar presença de carro perto da posição de spawn na mesma faixa
        const laneArr = activeCarsByLane[pickedLane] || [];
        const spawnSafetyX = archetype.startX;
        const conflict = laneArr.some((c: any) => Math.abs(c.pos.x - spawnSafetyX) < 220);
        if (conflict) return; // pula este spawn para evitar parede de carros

        const createCar = () => {
            const car = k.add([
                k.rect(140, 40, { radius: 4 }),
                k.pos(archetype.startX, LANES[pickedLane]),
                k.anchor("center"),
                k.color(archetype.color),
                k.area(),
                k.z(5),
                "car",
                { realSpeed: archetype.realSpeed, lane: pickedLane, targetLane: null, slowedSince: 0, isChangingLane: false }
            ]);

            // registrar no mapa de faixa
            addCarToLane(pickedLane, car);

            car.onUpdate(() => {
                // Apenas checar carros na mesma faixa (otimização)
                const checkLane = car.isChangingLane && car.targetLane !== null ? car.targetLane : car.lane;
                const sameLaneCars = activeCarsByLane[checkLane] || [];

                // Encontrar carro imediatamente à frente, se existir
                let frontCar: any = null;
                for (const c of sameLaneCars) {
                    if (c === car) continue;
                    if (c.pos.x > car.pos.x) {
                        if (!frontCar || c.pos.x < frontCar.pos.x) frontCar = c;
                    }
                }

                // Lógica de engarrafamento: se há carro à frente muito próximo
                let adjustedRealSpeed = car.realSpeed;
                if (frontCar && frontCar.pos.x - car.pos.x < 200) {
                    // marca o tempo em que foi reduzido
                    car.slowedSince = (car.slowedSince || 0) + k.dt();
                    adjustedRealSpeed = Math.min(car.realSpeed, frontCar.realSpeed - 50);
                } else {
                    car.slowedSince = 0;
                }

                // Tentar mudança de faixa se estiver preso por mais de 1.5s
                if (car.slowedSince > 1.5 && !car.isChangingLane) {
                    const possibleTargets = [] as number[];
                    if (car.lane === 0) possibleTargets.push(2);
                    if (car.lane === 2) possibleTargets.push(0, 4);
                    if (car.lane === 4) possibleTargets.push(2);

                    // escolher faixa livre (sem carro muito próximo na mesma posição horizontal)
                    let chosen: number | null = null;
                    for (const t of possibleTargets) {
                        const arrT = activeCarsByLane[t] || [];
                        const conflictT = arrT.some((c: any) => Math.abs(c.pos.x - car.pos.x) < 160);
                        if (!conflictT) { chosen = t; break; }
                    }

                    if (chosen !== null) {
                        car.isChangingLane = true;
                        car.targetLane = chosen;
                        const oldLane = car.lane;
                        const targetY = LANES[chosen];
                        // tween suave igual ao player
                        k.tween(
                            car.pos.y,
                            targetY,
                            0.14,
                            (val: any) => car.pos.y = val,
                            k.easings.easeOutQuad
                        ).onEnd(() => {
                            // mover o registro de faixa somente ao final da transição
                            removeCarFromLane(oldLane, car);
                            car.lane = chosen;
                            car.targetLane = null;
                            addCarToLane(chosen, car);
                            car.isChangingLane = false;
                            car.slowedSince = 0; // reset
                        });
                    }
                }

                // Velocidade Absoluta: fisica de relatividade
                const screenSpeed = adjustedRealSpeed - currentScrollSpeed;
                car.move(screenSpeed, 0);

                // Impede atravessamento: mantem distancia minima do carro da frente
                if (frontCar) {
                    const minGap = 150;
                    if (frontCar.pos.x - car.pos.x < minGap) {
                        car.pos.x = frontCar.pos.x - minGap;
                    }
                }

                // Limpeza: destrói se sair demais tanto pela esquerda quanto pela direita
                if (car.pos.x < -300 || car.pos.x > k.width() + 300) {
                    car.destroy();
                }
            });

            // Garantir remoção do registro ao destruir
            car.onDestroy(() => {
                removeCarFromAllLanes(car);
            });
        };

        // Se for APRESSADO, telegrafar antes de criar (spawn vindo de trás)
        if (archetype.type === 'APRESSADO') {
            // Se o jogador está muito atrás, não spawnar
            if (player.pos.x < 80) return;

            const indicator = k.add([
                k.rect(16, 16, { radius: 3 }),
                k.pos(20, LANES[pickedLane]),
                k.anchor("center"),
                k.color(220, 40, 40),
                k.z(20),
                "rear_alert"
            ]);

            // piscar por 0.8s usando onUpdate do próprio indicador (sem loop/unloop)
            (indicator as any)._blinkElapsed = 0;
            const blinkDuration = 0.08;
            indicator.onUpdate(() => {
                (indicator as any)._blinkElapsed += k.dt();
                indicator.hidden = Math.floor((indicator as any)._blinkElapsed / blinkDuration) % 2 === 0;
                if ((indicator as any)._blinkElapsed >= 0.8) {
                    indicator.destroy();
                    createCar();
                }
            });
        } else {
            createCar();
        }
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
        // Se o carro bateu NA TRASEIRA do player (veio de trás)
        if (car.pos.x < player.pos.x) {
            // Empurra o player pra frente e aumenta o scroll (impacto por trás)
            player.pos.x += 120;
            currentScrollSpeed = Math.min(ACCEL_SCROLL_SPEED, currentScrollSpeed + 400);
            // Indicador de dano (vermelho rápido)
            player.color = k.rgb(255, 120, 80);
            k.wait(0.4, () => player.color = k.rgb(0, 150, 255));
        } else {
            // Bateu na frente do carro (player bate de frente)
            k.shake(8);
            currentScrollSpeed = 50; // Perda brusca da inércia
            player.pos.x -= 80; // A moto capota pra trás no cenário
            player.color = k.rgb(255, 50, 50);
            k.wait(0.5, () => player.color = k.rgb(0, 150, 255));
        }

        // Em todos os casos, remover o carro que causou o impacto
        if (car && car.destroy) car.destroy();
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

        // Corridor rule: short grace window for overtaking, then heavy penalty
        if (currentLane % 2 !== 0) { 
            corridorTimer += k.dt();
            if (corridorTimer > CORRIDOR_GRACE) {
                targetSpeed = BASE_SCROLL_SPEED * 0.5; // Heavy slow after grace
                targetX = BRAKE_X; // Pulls player back on screen
            }
        } else {
            corridorTimer = 0;
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
