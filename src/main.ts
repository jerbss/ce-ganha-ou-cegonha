import kaplay from "kaplay";

const k = kaplay({
    width: 1280,
    height: 720,
    letterbox: true,
    background: [18, 18, 20], // #121214 - Asfalto noturno
});

// Carregamento de Assets
k.loadSprite("cenario", "./assets/bg_cenario_loop.png");
k.loadSprite("tela_inicial", "./assets/bg_menu_inicial.png");
// Sprites Personagens e Elementos
k.loadSprite("moto", "./assets/spr_moto_1.png");
k.loadSprite("buraco", "./assets/spr_buraco.png");
k.loadSprite("correio_1", "./assets/spr_correio_1.png");
k.loadSprite("correio_2", "./assets/spr_correio_2.png");
// Veículos NPCs
k.loadSprite("carro_azul", "./assets/spr_carro_azul.png");
k.loadSprite("carro_verde", "./assets/spr_carro_verde.png");
k.loadSprite("carro_vermelho", "./assets/spr_carro_vermelho.png");
k.loadSprite("carro_laranja", "./assets/spr_carro_laranja.png");
k.loadSprite("onibus_marrom", "./assets/spr_onibus_marrom.png");
k.loadSprite("onibus_vermelho", "./assets/spr_onibus_vermelho.png");
// UI e HUD
k.loadSprite("ui_barra", "./assets/ui_barra_estresse.png");
k.loadSprite("ui_caderno", "./assets/ui_caderno.png");
k.loadSprite("ui_feliz", "./assets/ui_bebe_feliz.png");
k.loadSprite("ui_ok", "./assets/ui_bebe_entediada.png");
k.loadSprite("ui_surto", "./assets/ui_bebe_estressada.png");

// Usando no Kaplay a fonte importada no index.html

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
    const LANES = [360, 420, 480, 540, 600];
    let currentLane = 2; // Come�a no meio
    let isChangingLane = false;
    let corridorTimer = 0;
    const CORRIDOR_GRACE = 0.9; // seconds

    // Estado do Jogo (MVP)
    let stress = 0;
    let timeRemaining = 120;
    let distanceTraveled = 0;
    const TARGET_DISTANCE = 5000;
    let damageTimer = 0; // Controle de feedback visual de dano por tempo
    let isGameOver = false; // Prevê chamadas múltiplas de fim de jogo

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

    // ---- CENÁRIO DESLIZANTE (Camada 0) ----
    const bg1 = k.add([
        k.sprite("cenario"),
        k.pos(0, k.height() / 2),
        k.anchor("left"),
        k.z(-100)
    ]);
    const bg2 = k.add([
        k.sprite("cenario"),
        k.pos(bg1.width || 1280, k.height() / 2),
        k.anchor("left"),
        k.z(-100)
    ]);

    k.onUpdate(() => {
        // bg1.width pode estar indefinido logo no frame zero (se não usasse load antes).
        // 1280 é a largura de fallback
        const bgW = bg1.width || 1280;
        
        // bg2 gruda no final do bg1 (a posição X base dos 2 deve variar entre 0 e -1280 (largura))
        bg1.move(-currentScrollSpeed, 0);
        bg2.move(-currentScrollSpeed, 0);

        if (bg1.pos.x <= -bgW) {
            bg1.pos.x = bg2.pos.x + bgW;
        }
        if (bg2.pos.x <= -bgW) {
            bg2.pos.x = bg1.pos.x + bgW;
        }
    });

    // Deslocamento visual da moto para alinhar a roda na linha tracejada do cenario
    const MOTO_Y_OFFSET = 32;

    // 4. O Protagonista (A Moto)
    const player = k.add([
        k.sprite("moto"),
        k.pos(REST_X, LANES[currentLane] - MOTO_Y_OFFSET),
        k.anchor("center"),
        // Diminuímos grandemente a hitbox no eixo Y (altura 24) para o jogador só bater se encostar de verdade
        k.area({ shape: new k.Rect(k.vec2(0, 5 + MOTO_Y_OFFSET), 80, 24) }),
        k.z(0),
        "player"
    ]);

    let rainActive = true;

    const spawnRainDrop = () => {
        if (!rainActive) return;

        const drop = k.add([
            k.rect(2, 14, { radius: 1 }),
            k.pos(k.rand(0, k.width()), k.rand(-40, 0)),
            k.anchor("center"),
            k.color(90, 150, 255),
            k.opacity(0.65),
            k.z(60),
            "rain"
        ]);

        drop.onUpdate(() => {
            drop.move(-currentScrollSpeed * 0.15, 520 * k.dt());
            drop.pos.x -= 220 * k.dt();
            if (drop.pos.y > k.height() + 30) {
                drop.destroy();
            }
        });
    };

    const loopRain = () => {
        k.wait(k.rand(0.04, 0.12), () => {
            if (k.get("rain").length < 80) {
                const dropsToSpawn = Math.floor(k.rand(2, 5));
                for (let i = 0; i < dropsToSpawn; i++) spawnRainDrop();
            }
            loopRain();
        });
    };
    loopRain();

    // ---- SISTEMA DE TRÁFEGO (NPCs) ----
    const spawnCar = () => {
        const carLanes = [0, 2, 4]; // Apenas faixas PAR
        const pickedLane = carLanes[Math.floor(k.rand(0, carLanes.length))];
        
        const randVal = Math.random();
        let archetype;

        if (randVal < 0.33) {
            // LENTO: Surge na direita. Ônibus ou Veículo Grande.
            const sps = ["onibus_marrom", "onibus_vermelho"];
            const sp = sps[Math.floor(k.rand(0, sps.length))];
            archetype = { type: 'LENTO', realSpeed: 250, sprite: sp, startX: k.width() + 200 };
        } else if (randVal < 0.66) {
            // NORMAL: Surge na direita. Veículo Médio.
            const sps = ["carro_azul", "carro_verde", "carro_laranja"];
            const sp = sps[Math.floor(k.rand(0, sps.length))];
            archetype = { type: 'NORMAL', realSpeed: 500, sprite: sp, startX: k.width() + 200 };
        } else {
            // APRESSADO: Surge de trás rÁpido. Carro Esportivo Vermelho.
            archetype = { type: 'APRESSADO', 
                          realSpeed: 950, 
                          sprite: "carro_vermelho", 
                          startX: -200 };
        }

        // Evitar spawn sobreposto: verificar presença de carro perto da posição de spawn na mesma faixa
        const laneArr = activeCarsByLane[pickedLane] || [];
        const spawnSafetyX = archetype.startX;
        const conflict = laneArr.some((c: any) => Math.abs(c.pos.x - spawnSafetyX) < 220);
        if (conflict) return; // pula este spawn para evitar parede de carros

        const createCar = () => {
            const car = k.add([
                k.sprite(archetype.sprite),
                k.pos(archetype.startX, LANES[pickedLane]),
                k.anchor("center"),
                // Hitbox mais fina (altura 28) para perdoar passagens justas entre as faixas
                k.area({ shape: new k.Rect(k.vec2(0, 8), 120, 28) }),
                k.z(0),
                "car",
                { realSpeed: archetype.realSpeed, lane: pickedLane, targetLane: null as number | null, slowedSince: 0, isChangingLane: false }
            ]);

            // registrar no mapa de faixa
            addCarToLane(pickedLane, car);

            car.onUpdate(() => {
                car.z = Math.floor(car.pos.y);

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

    // ---- BURACOS ----
    const spawnPothole = () => {
        const laneIndex = Math.floor(k.rand(0, LANES.length));
        const laneY = LANES[laneIndex];

        // 2. Falha de Level Design: Evitar spawn de buraco embaixo de carro
        const spawnX = k.width() + 120;
        const laneArr = activeCarsByLane[laneIndex] || [];
        const conflict = laneArr.some((c: any) => Math.abs(c.pos.x - spawnX) < 250);
        if (conflict) return;

        const pothole = k.add([
            k.sprite("buraco"),
            k.pos(k.width() + 120, laneY),
            k.anchor("center"),
            // Buraco tem hitbox menor de altura 16
            k.area({ shape: new k.Rect(k.vec2(0, 0), 40, 16) }),
            k.z(0),
            "pothole"
        ]);

        pothole.onUpdate(() => {
            pothole.z = Math.floor(pothole.pos.y);
            pothole.move(-currentScrollSpeed, 0);
            if (pothole.pos.x < -200) {
                pothole.destroy();
            }
        });
    };

    const loopPotholes = () => {
        k.wait(k.rand(4.0, 5.0), () => {
            if (k.get("pothole").length < 5) {
                spawnPothole();
            }
            loopPotholes();
        });
    };
    loopPotholes();

    // ---- COLISÕES ----
    player.onCollide("pothole", () => {
        k.shake(4);
        stress += 15;
        damageTimer = 0.5; // Dano centralizado
        const originalY = player.pos.y;
        k.tween(
            player.pos.y,
            originalY - 12,
            0.06,
            (val: any) => player.pos.y = val,
            k.easings.easeOutQuad
        ).onEnd(() => {
            k.tween(
                player.pos.y,
                originalY,
                0.08,
                (val: any) => player.pos.y = val,
                k.easings.easeInQuad
            );
        });
    });

    player.onCollide("car", (car: any) => {
        stress += 20;
        damageTimer = 0.5; // Dano centralizado
        // Se o carro bateu NA TRASEIRA do player (veio de trás)
        if (car.pos.x < player.pos.x) {
            // Empurra o player pra frente e aumenta o scroll (impacto por trás)
            player.pos.x += 120;
            currentScrollSpeed = Math.min(ACCEL_SCROLL_SPEED, currentScrollSpeed + 400);
            // 4. Incoerência Física: Não destrói o carro em batida traseira, deixa ele ultrapassar
        } else {
            // Bateu na frente do carro (player bate de frente)
            k.shake(8);
            currentScrollSpeed = 50; // Perda brusca da inércia
            player.pos.x -= 80; // A moto capota pra trás no cenário
            if (car && car.destroy) car.destroy(); // Destrói apenas no impacto frontal
        }
    });

    // 5. Troca de Faixas (Y eixo)
    const moveLane = (dir: number) => {
        if (isChangingLane) return;
        const nextLane = currentLane + dir;
        
        if (nextLane >= 0 && nextLane < LANES.length) {
            isChangingLane = true;
            currentLane = nextLane;
            const laneTweenDuration = rainActive ? 0.144 : 0.12;
            
            k.tween(
                player.pos.y, 
                LANES[currentLane] - MOTO_Y_OFFSET, 
                laneTweenDuration, 
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
        player.z = Math.floor(player.pos.y + MOTO_Y_OFFSET);

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
            // 3. Exploit: Esfriamento gradual em vez de zerar na hora
            corridorTimer = Math.max(0, corridorTimer - k.dt() * 1.5);
        }

        // Inércia mais realista para aceleração e frenagem no mundo real
        player.pos.x = k.lerp(player.pos.x, targetX, 1.8 * k.dt());
        currentScrollSpeed = k.lerp(currentScrollSpeed, targetSpeed, 2.0 * k.dt());

        // ---- REGRAS DE GAME DESIGN (MVP) ----
        // Alta Velocidade sobe o estresse
        if (currentScrollSpeed > 800) {
            stress += 5 * k.dt();
        } else if (currentScrollSpeed < BASE_SCROLL_SPEED + 50) {
            // 1. Mecânica Faltante: Frear/Ir devagar alivia o estresse
            stress -= 4 * k.dt(); 
        }
        stress = Math.min(100, Math.max(0, stress));

        // Tempo e Distância
        timeRemaining -= k.dt();
        distanceTraveled += (currentScrollSpeed / 10) * k.dt(); // 10 px = 1 metro

        // Condições de Vitória e Derrota
        if (!isGameOver) {
            if (stress >= 100) {
                isGameOver = true;
                k.go("gameover", { win: false, reason: "O bebê chorou muito! Você foi denunciado." });
            } else if (distanceTraveled >= TARGET_DISTANCE) {
                isGameOver = true;
                k.go("gameover", { win: true, reason: "Entrega concluída! O bebê sobreviveu." });
            } else if (timeRemaining <= 0) {
                isGameOver = true;
                k.go("gameover", { win: false, reason: "O tempo acabou! Entrega falhou (Geladeira)." });
            }
        }

        // 6. Feedback Visual Centralizado
        if (damageTimer > 0) {
            damageTimer -= k.dt();
            player.hidden = Math.floor(k.time() * 20) % 2 === 0; // Blink of invulnerability/damage
        } else {
            player.hidden = false;
            // Efeito de treme da tela se muito estressada (opcional, pode ficar)
            if (stress > 70 && Math.random() < 0.1) {
                k.shake(1);
            }
        }
    });

    // ---- HUD (MÉDIA FIDELIDADE) ----
    k.add([ k.rect(300, 20), k.pos(20, 30), k.color(50, 50, 50), k.fixed(), k.z(100) ]);
    const stressBar = k.add([ k.rect(0, 20), k.pos(20, 30), k.color(255, 50, 50), k.fixed(), k.z(101) ]);
    k.add([ k.text("ESTRESSE: BEBÊ", { size: 16 }), k.pos(20, 10), k.color(255, 255, 255), k.fixed(), k.z(101) ]);

    const timerText = k.add([ k.text("120.0s", { size: 32 }), k.pos(k.width()/2, 30), k.anchor("center"), k.color(255, 255, 255), k.fixed(), k.z(101) ]);

    k.add([ k.rect(300, 20), k.pos(k.width() - 320, 30), k.color(50, 50, 50), k.fixed(), k.z(100) ]);
    const distBar = k.add([ k.rect(0, 20), k.pos(k.width() - 320, 30), k.color(50, 255, 50), k.fixed(), k.z(101) ]);
    const distText = k.add([ k.text("META: 0 / 5000 m", { size: 16 }), k.pos(k.width() - 320, 10), k.color(255, 255, 255), k.fixed(), k.z(101) ]);

    k.onUpdate(() => {
        stressBar.width = (stress / 100) * 300;
        distBar.width = Math.min((distanceTraveled / TARGET_DISTANCE) * 300, 300);
        timerText.text = `${Math.max(0, timeRemaining).toFixed(1)}s`;
        
        // 5. UI Incompleta: Alerta de Tempo piscando vermelho se menor que 20s
        if (timeRemaining < 20) {
            timerText.color = Math.floor(k.time() * 5) % 2 === 0 ? k.rgb(255, 50, 50) : k.rgb(255, 255, 255);
        } else {
            timerText.color = k.rgb(255, 255, 255);
        }

        distText.text = `META: ${Math.floor(distanceTraveled)} / ${TARGET_DISTANCE} m`;
    });
});

// ---- CENA DE MENU INICIAL ----
k.scene("menu", () => {
    k.add([
        k.sprite("tela_inicial"),
        k.pos(0, 0),
    ]);

    // Ajuste fino do Y para encaixar verticalmente no centro de cada listra bege
    const options = [
        { text: "Novo Jogo", y: 390, action: () => k.go("game") },
        { text: "Configurações", y: 475, action: () => {} },
        { text: "Instruções", y: 560, action: () => {} },
        { text: "Sair", y: 645, action: () => {} }
    ];

    options.forEach(opt => {
        // 1. Sombra projetada (Drop Shadow) para dar profundidade estética
        const shadow = k.add([
            k.text(opt.text, { size: 42, font: "Fredoka" }),
            k.pos(104, opt.y + 5),
            k.anchor("left"),
            k.color(0, 0, 0),
            k.opacity(0.4),
            k.scale(1),
            k.rotate(0),
            k.z(1)
        ]);

        // 2. Texto Principal
        const btn = k.add([
            k.text(opt.text, { size: 42, font: "Fredoka" }),
            k.pos(100, opt.y), 
            k.anchor("left"),
            k.color(255, 255, 255), // Texto branco para estourar no fundo
            k.scale(1), 
            k.rotate(0),
            k.area(),
            k.z(2),
            "menu_btn"
        ]);

        btn.onClick(opt.action);

        // Feedback super suculento (Juicy/GameFeel)
        btn.onHoverUpdate(() => {
            btn.color = k.rgb(255, 220, 50); // Fica um amarelo vivo charmoso
            k.setCursor("pointer");
            
            // Leve crescimento e "wobble" (balanço) cartunesco
            btn.scale = k.vec2(1.08);
            btn.angle = k.wave(-2, 2, k.time() * 5);
            
            // A sombra acompanha o balanço
            shadow.scale = btn.scale;
            shadow.angle = btn.angle;
        });

        btn.onHoverEnd(() => {
            btn.color = k.rgb(255, 255, 255); // Volta pro branco limpo
            k.setCursor("default");
            
            // Reseta pro normal
            btn.scale = k.vec2(1);
            btn.angle = 0;
            
            shadow.scale = btn.scale;
            shadow.angle = 0;
        });
    });
});

k.go("menu");

// ---- CENA DE GAME OVER / VITÓRIA ----
k.scene("gameover", ({ win, reason }: { win: boolean, reason: string }) => {
    // Fundo esmaecido cobrindo a tela
    k.add([
        k.rect(k.width(), k.height()),
        k.pos(0, 0),
        k.color(10, 10, 15),
        k.z(0)
    ]);

    // Painel Central
    k.add([
        k.rect(800, 400, { radius: 10 }),
        k.pos(k.width() / 2, k.height() / 2),
        k.anchor("center"),
        k.color(30, 30, 35),
        k.outline(4, win ? k.rgb(50, 255, 50) : k.rgb(255, 50, 50)),
        k.z(1)
    ]);

    k.add([
        k.text(win ? "SUCESSO!" : "GAME OVER", { size: 64, align: "center" }),
        k.pos(k.width() / 2, k.height() / 2 - 80),
        k.anchor("center"),
        k.color(win ? k.rgb(50, 255, 50) : k.rgb(255, 50, 50)),
        k.z(2)
    ]);

    k.add([
        k.text(reason, { size: 24, align: "center" }),
        k.pos(k.width() / 2, k.height() / 2 + 10),
        k.anchor("center"),
        k.color(220, 220, 220),
        k.z(2)
    ]);

    // Efeito piscante para o botão de restart
    const restartText = k.add([
        k.text("Pressione ESPAÇO ou R para reiniciar", { size: 20 }),
        k.pos(k.width() / 2, k.height() / 2 + 120),
        k.anchor("center"),
        k.color(255, 255, 0),
        k.opacity(1),
        k.z(2)
    ]);

    restartText.onUpdate(() => {
        restartText.opacity = Math.floor(k.time() * 3) % 2 === 0 ? 1 : 0.5;
    });

    k.onKeyPress(["r", "space"], () => k.go("game"));
});
