import kaplay from "kaplay";

const k = kaplay({
    width: 1280,
    height: 720,
    letterbox: true,
    background: [18, 18, 20], // #121214 - Asfalto noturno
});

// ---- DESIGN SYSTEM ----
const DESIGN = {
    // Paleta de Cores
    colors: {
        primary: k.rgb(46, 139, 87),      // Verde #2E8B57 - Saúde
        alert: k.rgb(255, 140, 66),       // Laranja #FF8C42 - Atenção
        critical: k.rgb(230, 57, 70),     // Vermelho #E63946 - Perigo
        neutral: k.rgb(45, 62, 80),       // Cinza #2D3E50 - Backgrounds
        white: k.rgb(255, 255, 255),      // Branco
        black: k.rgb(26, 26, 26),         // Preto #1A1A1A
        menuText: k.rgb(74, 43, 26),      // Menu text
        menuTextHover: k.rgb(255, 243, 224), // Menu text hover
        menuPlate: k.rgb(244, 195, 119),  // Menu plate
        menuPlateHover: k.rgb(234, 146, 78), // Menu plate hover
        menuPlateOutline: k.rgb(133, 71, 32), // Menu plate outline
    },
    // Tamanhos de Fonte (Fredoka)
    font: {
        title: 48,    // Títulos/Cenas
        button: 40,   // Botões Menu
        hud: 28,      // Labels HUD
        small: 16,    // Debug/Pequeno
    },
    // Espaçamento
    spacing: {
        large: 16,    // Padding em containers
        small: 8,     // Padding em items
    },
    // Raios de Borda
    radius: {
        large: 8,     // Elementos principais
        small: 6,     // Elementos menores
    },
};

// Carregamento de Assets
k.loadSprite("cenario", "./assets/bg_cenario_loop.png");
k.loadSprite("tela_inicial", "./assets/bg_menu_inicial.png");
// Cutscenes e UI
k.loadSprite("bg_cutscene_1", "./assets/bg_cutscene_1.png");
k.loadSprite("bg_cutscene_2", "./assets/bg_cutscene_2.png");
k.loadSprite("bg_cutscene_3", "./assets/bg_cutscene_3.png");
k.loadSprite("bg_cutscene_4", "./assets/bg_cutscene_4.png");
k.loadSprite("seta_direita", "./assets/ui_seta_direita.png");
k.loadSprite("seta_esquerda", "./assets/ui_seta_esquerda.png");
// Sprites Personagens e Elementos
k.loadSprite("moto", "./assets/spr_moto_1.png");
k.loadSprite("moto_2", "./assets/spr_moto_2.png");
k.loadSprite("bg_vitoria", "./assets/bg_vitoria.png");
k.loadSprite("bg_derrota", "./assets/bg_derrota.png");
k.loadSprite("buraco", "./assets/spr_buraco.png");
k.loadSprite("correio_1", "./assets/spr_correio_1.png");
k.loadSprite("correio_2", "./assets/spr_correio_2.png");
// Veículos NPCs
k.loadSprite("carro_azul", "./assets/spr_carro_azul.png");
k.loadSprite("carro_verde", "./assets/spr_carro_verde.png");
k.loadSprite("carro_vermelho", "./assets/spr_carro_vermelho.png");
k.loadSprite("carro_laranja", "./assets/spr_carro_laranja.png");
k.loadSprite("carro_marrom", "./assets/spr_carro_marrom.png");
k.loadSprite("onibus_marrom", "./assets/spr_onibus_marrom.png");
k.loadSprite("onibus_vermelho", "./assets/spr_onibus_vermelho.png");
k.loadSprite("onibus_azul", "./assets/spr_onibus_azul.png");
k.loadSprite("onibus_laranja", "./assets/spr_onibus_laranja.png");
k.loadSprite("onibus_verde", "./assets/spr_onibus_verde.png");
// UI e HUD
k.loadSprite("ui_barra", "./assets/ui_barra_estresse.png");
k.loadSprite("ui_caderno", "./assets/ui_caderno.png");
k.loadSprite("ui_feliz", "./assets/ui_bebe_feliz.png");
k.loadSprite("ui_ok", "./assets/ui_bebe_entediada.png");
k.loadSprite("ui_surto", "./assets/ui_bebe_estressada.png");
k.loadSprite("seta_correio", "./assets/spr_seta_correio.png");
// Novos backgrounds de telas (padronizados)
k.loadSprite("bg_menu_pausa", "./assets/bg_menu_pausa.png");
k.loadSprite("bg_instrucoes", "./assets/bg_instrucoes.png");
k.loadSprite("bg_configuracoes", "./assets/bg_configuracoes.png");

// ---- ÁUDIO: Carregamento dos BGMs ----
k.loadSound("bgm_menu",      "./assets/tela-inicial.mp3");
k.loadSound("bgm_gameplay",  "./assets/gameplay.mp3");
k.loadSound("bgm_cutscene",  "./assets/cutscene.ogg");
k.loadSound("jingle_vitoria","./assets/vitoria.mp3");
k.loadSound("jingle_derrota","./assets/derrota.wav");
k.loadSound("sfx_hover", "./assets/rollover-menu.wav");
k.loadSound("sfx_click", "./assets/click-botao.wav");

// Usando no Kaplay a fonte importada no index.html

// ---- ESTADO GLOBAL ----
let isGamePaused = false;
let globalVolume = 1.0;
k.volume(globalVolume);

// ---- GERENCIADOR DE BGM ----
// Mantém referência da música tocando e evita sobreposição
let _currentBGM: any = null;
let _currentBGMKey: string | null = null;

const playBGM = (key: string, loop = true, volume = 0.25) => {
    // Não reinicia se já está tocando a mesma faixa
    if (_currentBGMKey === key && _currentBGM) return;
    // Para a faixa anterior
    if (_currentBGM) {
        try { _currentBGM.stop(); } catch (e) {}
    }
    _currentBGM = k.play(key, { loop, volume });
    _currentBGMKey = key;
};

const stopBGM = () => {
    if (_currentBGM) {
        try { _currentBGM.stop(); } catch (e) {}
        _currentBGM = null;
        _currentBGMKey = null;
    }
};

// Abafa a BGM durante a pausa (simula efeito de "mundo parado")
const muffleBGM = (muffled: boolean) => {
    if (!_currentBGM) return;
    _currentBGM.volume = muffled ? 0.08 : 0.25;
};

export const isFullscreenActive = () => {
    return !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
};

export const toggleFullscreen = (enable: boolean) => {
    if (enable) {
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) {
            docEl.requestFullscreen();
        } else if ((docEl as any).webkitRequestFullscreen) {
            (docEl as any).webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
            (document as any).webkitExitFullscreen();
        }
    }
    // Force resize recalculation in browser
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 100);
};

// ---- COMPONENTES REUTILIZÁVEIS ----
export function createStandardButton(text: string, pos: any, action: () => void, zIndex: number = 100) {
    const btnWidth = 320;
    const btnHeight = 60;
    const btnRadius = 30;

    // Container principal do botão que trata o clique
    const btn = k.add([
        k.pos(pos),
        k.area({ shape: new k.Rect(k.vec2(0, 0), btnWidth, btnHeight) }),
        k.anchor("center"),
        k.z(zIndex),
        "standard_btn"
    ]);

    // 1. Sombra / Placa de fundo escurecida (efeito 3D flat)
    btn.add([
        k.rect(btnWidth, btnHeight, { radius: btnRadius }),
        k.pos(0, 8), // Deslocado 8px para baixo
        k.anchor("center"),
        k.color(30, 112, 128), // Azul Marinho / Teal escuro
    ]);

    // 2. Botão Principal
    const plate = btn.add([
        k.rect(btnWidth, btnHeight, { radius: btnRadius }),
        k.pos(0, 0),
        k.anchor("center"),
        k.color(74, 229, 226), // Ciano (Tonalidade vibrante do gradiente)
    ]);

    // 3. Texto com Outline
    const label = btn.add([
        k.text(text, {
            size: DESIGN.font.button || 32,
            font: "Fredoka",
            align: "center",
        }),
        k.pos(0, 0),
        k.anchor("center"),
        k.color(0, 0, 0),
        k.outline(4, k.rgb(255, 255, 255)), // Contorno branco espesso
    ]);

    // Efeitos de Hover
    btn.onHover(() => {
        if (plate.color.r !== 53) { // Toca o som apenas na transição inicial de hover
            k.play("sfx_hover", { volume: 0.5 });
        }
        plate.color = k.rgb(53, 181, 235); // Azul celeste ao passar o mouse
        k.setCursor("pointer");
    });

    btn.onHoverEnd(() => {
        plate.color = k.rgb(74, 229, 226); // Volta ao ciano
        k.setCursor("default");
    });

    // Ação de Clique
    btn.onClick(() => {
        k.play("sfx_click", { volume: 0.6 });
        // Efeito de "pressão"
        plate.pos.y = 4;
        label.pos.y = 4;
        
        k.wait(0.1, () => {
            plate.pos.y = 0;
            label.pos.y = 0;
            action();
        });
    });

    return btn;
}

k.scene("game", () => {
    // ---- BGM DA GAMEPLAY ----
    playBGM("bgm_gameplay");

    // 1. Constantes da Máquina de Scroll
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
    let paciencia = 100;
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
        if (isGamePaused) return;
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

    // ---- HUD (UI Fixa) ----
    const rostoBebeUI = k.add([
        k.sprite("ui_feliz"),
        k.pos(20, 20),
        k.fixed(),
        k.z(1000)
    ]);
    
    k.add([
        k.rect(340, 32, { radius: DESIGN.radius.large }),
        k.pos(150, 44),
        k.color(DESIGN.colors.neutral),
        k.fixed(),
        k.z(1000)
    ]);
    
    // Preenchimento verde da barra
    const barraPacienciaUI = k.add([
        k.rect(332, 24, { radius: DESIGN.radius.small }),
        k.pos(154, 48),
        k.color(DESIGN.colors.primary), // Verde
        k.fixed(),
        k.z(1001)
    ]);
    
    // Caderno (Topo Direito)
    k.add([
        k.sprite("ui_caderno"),
        k.pos(k.width() - 20, 20),
        k.anchor("topright"),
        k.fixed(),
        k.z(1000)
    ]);

    // ---- SPAWNER DE CAIXAS DE CORREIO (Sincronizado com o Loop do Cenário) ----
    // bg_cenario_loop.png tem 2560px com 40 blocos (64px cada)
    // Padrão: Claro, Escuro, Claro, Escuro, ... Escuro
    // Blocos escuros: a cada 128px (1 claro + 1 escuro)
    
    let toggleSpriteCorreio = true;
    const DIST_ENTRE_CORREIOS = 128; // Um par de blocos (claro + escuro)
    let distAccumCorreio = 0;
    
    const spawnCorreioPair = (startX?: number) => {
        // Se x não for passado, calcula a posição exata baseada na borda direita menos o excesso de percurso
        const xPos = startX !== undefined ? startX : k.width() + 96 - distAccumCorreio;
        
        // CORREIO SUPERIOR (Topo da Calçada)
        const spriteSup = toggleSpriteCorreio ? "correio_1" : "correio_2";
        const yPosSup = 236; // 300 - 64 (Topo da calçada corrigido)
        
        const correioSup = k.add([
            k.sprite(spriteSup),
            k.pos(xPos, yPosSup),
            k.anchor("center"),
            k.z(-10), // Atrás dos pedestres e carros
            "correio"
        ]);
        
        correioSup.onUpdate(() => {
            if (isGamePaused) return;
            correioSup.move(-currentScrollSpeed, 0);
            if (correioSup.pos.x < -100) correioSup.destroy();
        });
        
        // CORREIO INFERIOR (Base da Calçada)
        const spriteInf = toggleSpriteCorreio ? "correio_2" : "correio_1"; // Sprite alternado
        const yPosInf = 680; // Base da calçada
        
        const correioInf = k.add([
            k.sprite(spriteInf),
            k.pos(xPos, yPosInf),
            k.anchor("center"),
            k.z(100), // À frente de tudo na pista
            "correio"
        ]);
        
        correioInf.onUpdate(() => {
            if (isGamePaused) return;
            correioInf.move(-currentScrollSpeed, 0);
            if (correioInf.pos.x < -100) correioInf.destroy();
        });

        toggleSpriteCorreio = !toggleSpriteCorreio;
        
        // Gerar seta com 30% chance
        if (k.chance(0.3)) {
            const isSetaSup = k.chance(0.5);
            const ySeta = isSetaSup ? yPosSup - 55 : yPosInf - 55;
            const zSeta = isSetaSup ? -9 : 101;

            const seta = k.add([
                k.sprite("seta_correio"),
                k.pos(xPos, ySeta), 
                k.anchor("center"),
                k.z(zSeta),
                "seta"
            ]);
            
            seta.onUpdate(() => {
                if (isGamePaused) return;
                seta.move(-currentScrollSpeed, Math.sin(k.time() * 5) * 10);
                if (seta.pos.x < -100) seta.destroy();
            });
        }
    };

    // Preenchendo a tela no primeiro frame (Sincronizado perfeitamente! O centro do bloco escuro começa em 96px e a tela tem 1280px)
    for (let x = 96; x <= k.width() + 128; x += DIST_ENTRE_CORREIOS) {
        spawnCorreioPair(x);
    }

    k.onUpdate(() => {
        if (isGamePaused) return;
        distAccumCorreio += currentScrollSpeed * k.dt();
        while (distAccumCorreio >= DIST_ENTRE_CORREIOS) { 
            distAccumCorreio -= DIST_ENTRE_CORREIOS;
            spawnCorreioPair();
        }
    });

    // Deslocamento visual da moto para alinhar a roda na linha tracejada do cenario
    const MOTO_Y_OFFSET = 32;

    // 4. O Protagonista (A Moto)
    const player = k.add([
        k.sprite("moto"),
        k.pos(REST_X, LANES[currentLane] - MOTO_Y_OFFSET),
        k.anchor("center"),
        // Re-compensamos o deslocamento visual de -32 na hitbox (+32) para manter a logica da colisao intacta no centro da lane
        k.area({ shape: new k.Rect(k.vec2(0, 5 + MOTO_Y_OFFSET), 80, 24) }),
        k.z(0),
        "player"
    ]);

    // Animação da Moto
    let isMoto1 = true;
    k.loop(0.15, () => {
        isMoto1 = !isMoto1;
        player.use(k.sprite(isMoto1 ? "moto" : "moto_2"));
    });



    // ---- SISTEMA DE TRÁFEGO (NPCs) ----
    const spawnCar = () => {
        const carLanes = [0, 2, 4]; // Apenas faixas PAR
        const pickedLane = carLanes[Math.floor(k.rand(0, carLanes.length))];
        
        const randVal = Math.random();
        let archetype;

        const todosOsOnibus = ["onibus_marrom", "onibus_vermelho", "onibus_azul", "onibus_laranja", "onibus_verde"];
        const todosOsCarros = ["carro_azul", "carro_verde", "carro_vermelho", "carro_laranja", "carro_marrom"];

        if (randVal < 0.33) {
            // LENTO: Surge na direita. Ônibus.
            const sp = todosOsOnibus[Math.floor(k.rand(0, todosOsOnibus.length))];
            archetype = { type: 'LENTO', realSpeed: 250, sprite: sp, startX: k.width() + 200 };
        } else if (randVal < 0.66) {
            // NORMAL: Surge na direita. Carro MÃ©dio.
            const sp = todosOsCarros[Math.floor(k.rand(0, todosOsCarros.length))];
            archetype = { type: 'NORMAL', realSpeed: 500, sprite: sp, startX: k.width() + 200 };
        } else {
            // APRESSADO: Surge de trÃ¡s rÃ¡pido. Carro Esportivo.
            const sp = todosOsCarros[Math.floor(k.rand(0, todosOsCarros.length))];
            archetype = { type: 'APRESSADO', realSpeed: 950, sprite: sp, startX: -200 };
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
                if (isGamePaused) return;
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
                k.rect(16, 16, { radius: DESIGN.radius.small }),
                k.pos(20, LANES[pickedLane]),
                k.anchor("center"),
                k.color(DESIGN.colors.critical),
                k.z(20),
                "rear_alert"
            ]);

            // piscar por 0.8s usando onUpdate do próprio indicador (sem loop/unloop)
            (indicator as any)._blinkElapsed = 0;
            const blinkDuration = 0.08;
            indicator.onUpdate(() => {
                if (isGamePaused) return;
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
            if (isGamePaused) return;
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
        if (isGamePaused) return;
        k.shake(4);
        paciencia -= 15;
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
        if (isGamePaused) return;
        paciencia -= 20;
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
            const laneTweenDuration = 0.12;
            
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

    // Pause / Overlay control (toggle com tecla ESC)
    // Pause / Overlay control (toggle com tecla ESC ou P)
    let isPaused = false;
    let pauseOverlay: any = null;
    let pauseCloseBtn: any = null;
    let pauseUIObjects: any[] = [];

    const showMainMenu = () => {
        pauseUIObjects.forEach(obj => obj.destroy && obj.destroy());
        pauseUIObjects = [];

        const btnConfig = createStandardButton("Configurações", k.vec2(k.width() / 2, 300), () => {
            showConfigMenu();
        }, 2001);

        const btnInstr = createStandardButton("Instruções", k.vec2(k.width() / 2, 380), () => {
            showInstructionsMenu();
        }, 2001);

        const btnRestart = createStandardButton("Reiniciar Fase", k.vec2(k.width() / 2, 460), () => {
            togglePause();
            k.go("game");
        }, 2001);

        const btnQuit = createStandardButton("Sair do Jogo", k.vec2(k.width() / 2, 540), () => {
            togglePause();
            k.go("menu");
        }, 2001);

        pauseUIObjects.push(btnConfig, btnInstr, btnRestart, btnQuit);
    };

    const showConfigMenu = () => {
        if (pauseCloseBtn) pauseCloseBtn.hidden = true;
        pauseUIObjects.forEach(obj => obj.destroy && obj.destroy());
        pauseUIObjects = [];

        // 1. Labels
        const lblVolume = k.add([
            k.text("Volume", { size: 32, font: "Fredoka" }),
            k.pos(370, 300),
            k.anchor("left"),
            k.color(DESIGN.colors.menuText),
            k.z(2001)
        ]);

        const lblFullscreen = k.add([
            k.text("Tela Cheia", { size: 32, font: "Fredoka" }),
            k.pos(370, 400),
            k.anchor("left"),
            k.color(DESIGN.colors.menuText),
            k.z(2001)
        ]);

        // 2. Volume Slider
        const sliderLeft = 570;
        const sliderWidth = 300;
        const sliderY = 300;

        const track = k.add([
            k.rect(sliderWidth, 16, { radius: 8 }),
            k.pos(sliderLeft, sliderY),
            k.color(DESIGN.colors.menuPlateOutline),
            k.outline(3, DESIGN.colors.menuPlateOutline),
            k.area(),
            k.anchor("left"),
            k.z(2001)
        ]);

        const fill = k.add([
            k.rect(sliderWidth * globalVolume, 16, { radius: 8 }),
            k.pos(sliderLeft, sliderY),
            k.color(DESIGN.colors.primary),
            k.anchor("left"),
            k.z(2002)
        ]);

        const handle = k.add([
            k.circle(14),
            k.pos(sliderLeft + sliderWidth * globalVolume, sliderY),
            k.color(DESIGN.colors.menuPlate),
            k.outline(3, DESIGN.colors.menuPlateOutline),
            k.area(),
            k.anchor("center"),
            k.z(2003)
        ]);

        const volumeLabel = k.add([
            k.text(Math.round(globalVolume * 100) + "%", {
                size: 24,
                font: "Fredoka",
            }),
            k.pos(sliderLeft + sliderWidth + 20, sliderY),
            k.anchor("left"),
            k.color(DESIGN.colors.menuText),
            k.z(2002)
        ]);

        let isDraggingVolume = false;

        const updateVolumeFromMouse = () => {
            const mouseX = k.mousePos().x;
            let pct = (mouseX - sliderLeft) / sliderWidth;
            pct = Math.max(0, Math.min(1, pct));
            globalVolume = pct;
            k.volume(globalVolume);
            
            fill.width = sliderWidth * globalVolume;
            handle.pos.x = sliderLeft + sliderWidth * globalVolume;
            volumeLabel.text = Math.round(globalVolume * 100) + "%";
        };

        const ev1 = track.onClick(() => {
            updateVolumeFromMouse();
        });

        const ev2 = handle.onHover(() => {
            k.play("sfx_hover", { volume: 0.5 });
            k.setCursor("pointer");
        });
        const ev3 = handle.onHoverEnd(() => {
            k.setCursor("default");
        });

        const ev4 = k.onMouseDown(() => {
            if (track.isHovering() || handle.isHovering()) {
                isDraggingVolume = true;
            }
        });

        const ev5 = k.onMouseRelease(() => {
            isDraggingVolume = false;
        });

        const ev6 = k.onUpdate(() => {
            if (isDraggingVolume) {
                updateVolumeFromMouse();
            }
        });

        // 3. Fullscreen Buttons
        let isFull = isFullscreenActive();
        const btnWidth = 110;
        const btnHeight = 50;
        const btnRadius = 25;

        const btnSim = k.add([
            k.pos(650, 400),
            k.area({ shape: new k.Rect(k.vec2(0, 0), btnWidth, btnHeight) }),
            k.anchor("center"),
            k.z(2001),
            "toggle_btn"
        ]);

        const shadowSim = btnSim.add([
            k.rect(btnWidth, btnHeight, { radius: btnRadius }),
            k.pos(0, 6),
            k.anchor("center"),
            k.color(),
        ]);

        const plateSim = btnSim.add([
            k.rect(btnWidth, btnHeight, { radius: btnRadius }),
            k.pos(0, 0),
            k.anchor("center"),
            k.outline(3, DESIGN.colors.menuPlateOutline),
            k.color(),
        ]);

        const labelSim = btnSim.add([
            k.text("Sim", { size: 24, font: "Fredoka", align: "center" }),
            k.pos(0, 0),
            k.anchor("center"),
            k.outline(2, k.rgb(255, 255, 255)),
            k.color(),
        ]);

        const btnNao = k.add([
            k.pos(780, 400),
            k.area({ shape: new k.Rect(k.vec2(0, 0), btnWidth, btnHeight) }),
            k.anchor("center"),
            k.z(2001),
            "toggle_btn"
        ]);

        const shadowNao = btnNao.add([
            k.rect(btnWidth, btnHeight, { radius: btnRadius }),
            k.pos(0, 6),
            k.anchor("center"),
            k.color(),
        ]);

        const plateNao = btnNao.add([
            k.rect(btnWidth, btnHeight, { radius: btnRadius }),
            k.pos(0, 0),
            k.anchor("center"),
            k.outline(3, DESIGN.colors.menuPlateOutline),
            k.color(),
        ]);

        const labelNao = btnNao.add([
            k.text("Não", { size: 24, font: "Fredoka", align: "center" }),
            k.pos(0, 0),
            k.anchor("center"),
            k.outline(2, k.rgb(255, 255, 255)),
            k.color(),
        ]);

        const refreshButtons = () => {
            const full = isFullscreenActive();
            shadowSim.color = full ? k.rgb(30, 112, 128) : k.rgb(133, 115, 102);
            plateSim.color = full ? k.rgb(74, 229, 226) : k.rgb(194, 180, 169);
            labelSim.color = full ? k.rgb(0, 0, 0) : k.rgb(100, 90, 85);

            shadowNao.color = !full ? k.rgb(30, 112, 128) : k.rgb(133, 115, 102);
            plateNao.color = !full ? k.rgb(74, 229, 226) : k.rgb(194, 180, 169);
            labelNao.color = !full ? k.rgb(0, 0, 0) : k.rgb(100, 90, 85);
        };

        refreshButtons();

        const ev7 = btnSim.onClick(() => {
            k.play("sfx_click", { volume: 0.6 });
            plateSim.pos.y = 3;
            labelSim.pos.y = 3;
            k.wait(0.1, () => {
                plateSim.pos.y = 0;
                labelSim.pos.y = 0;
                toggleFullscreen(true);
                k.wait(0.1, () => {
                    refreshButtons();
                });
            });
        });

        const ev8 = btnNao.onClick(() => {
            k.play("sfx_click", { volume: 0.6 });
            plateNao.pos.y = 3;
            labelNao.pos.y = 3;
            k.wait(0.1, () => {
                plateNao.pos.y = 0;
                labelNao.pos.y = 0;
                toggleFullscreen(false);
                k.wait(0.1, () => {
                    refreshButtons();
                });
            });
        });

        const ev9 = btnSim.onHover(() => {
            if (!isFullscreenActive()) {
                k.play("sfx_hover", { volume: 0.5 });
            }
            k.setCursor("pointer");
            if (!isFullscreenActive()) {
                plateSim.color = k.rgb(214, 200, 189);
            } else {
                plateSim.color = k.rgb(53, 181, 235);
            }
        });
        const ev10 = btnSim.onHoverEnd(() => {
            k.setCursor("default");
            refreshButtons();
        });

        const ev11 = btnNao.onHover(() => {
            if (isFullscreenActive()) {
                k.play("sfx_hover", { volume: 0.5 });
            }
            k.setCursor("pointer");
            if (isFullscreenActive()) {
                plateNao.color = k.rgb(214, 200, 189);
            } else {
                plateNao.color = k.rgb(53, 181, 235);
            }
        });
        const ev12 = btnNao.onHoverEnd(() => {
            k.setCursor("default");
            refreshButtons();
        });

        const ev13 = btnSim.onUpdate(() => {
            const currentFull = isFullscreenActive();
            if (isFull !== currentFull) {
                isFull = currentFull;
                refreshButtons();
            }
        });

        const onFullScreenChange = () => {
            isFull = isFullscreenActive();
            refreshButtons();
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 150);
        };
        document.addEventListener("fullscreenchange", onFullScreenChange);
        document.addEventListener("webkitfullscreenchange", onFullScreenChange);

        const btnVoltar = createStandardButton("Voltar", k.vec2(k.width() / 2, 520), () => {
            ev1.cancel(); ev2.cancel(); ev3.cancel(); ev4.cancel(); ev5.cancel(); ev6.cancel();
            ev7.cancel(); ev8.cancel(); ev9.cancel(); ev10.cancel(); ev11.cancel(); ev12.cancel(); ev13.cancel();
            document.removeEventListener("fullscreenchange", onFullScreenChange);
            document.removeEventListener("webkitfullscreenchange", onFullScreenChange);
            if (pauseCloseBtn) pauseCloseBtn.hidden = false;
            showMainMenu();
        }, 2001);

        pauseUIObjects.push(
            lblVolume, lblFullscreen, track, fill, handle, volumeLabel,
            btnSim, btnNao, btnVoltar
        );
    };

    const showInstructionsMenu = () => {
        pauseUIObjects.forEach(obj => obj.destroy && obj.destroy());
        pauseUIObjects = [];

        const bgInst = k.add([
            k.sprite("bg_instrucoes"),
            k.pos(k.width() / 2, k.height() / 2),
            k.anchor("center"),
            k.scale(k.width() / 3840, k.height() / 2160),
            k.z(2100)
        ]);

        const btnVoltar = createStandardButton("Voltar", k.vec2(k.width() / 2, k.height() - 80), () => {
            bgInst.destroy();
            showMainMenu();
        }, 2101);

        pauseUIObjects.push(bgInst, btnVoltar);
    };

    const togglePause = () => {
        if (!isPaused) {
            isPaused = true;
            isGamePaused = true;
            
            pauseOverlay = k.add([
                k.sprite("bg_menu_pausa"),
                k.pos(k.width() / 2, k.height() / 2),
                k.anchor("center"),
                k.scale(k.width() / 3840, k.height() / 2160),
                k.z(2000),
                "pause_overlay"
            ]);

            pauseCloseBtn = k.add([
                k.pos(960, 110),
                k.anchor("center"),
                k.z(2050),
                k.area({ shape: new k.Rect(k.vec2(0, 0), 48, 48) }),
                "pause_close_btn"
            ]);

            const circle = pauseCloseBtn.add([
                k.circle(24),
                k.anchor("center"),
                k.color(DESIGN.colors.critical),
                k.outline(4, DESIGN.colors.menuPlateOutline),
            ]);

            pauseCloseBtn.add([
                k.text("X", { size: 24, font: "Fredoka" }),
                k.anchor("center"),
                k.color(DESIGN.colors.white),
                k.pos(0, 0)
            ]);

            pauseCloseBtn.onHover(() => {
                if (circle.color.r !== 255 || circle.color.g !== 100) {
                    k.play("sfx_hover", { volume: 0.5 });
                }
                circle.color = k.rgb(255, 100, 100);
                k.setCursor("pointer");
            });

            pauseCloseBtn.onHoverEnd(() => {
                circle.color = DESIGN.colors.critical;
                k.setCursor("default");
            });

            pauseCloseBtn.onClick(() => {
                k.play("sfx_click", { volume: 0.6 });
                togglePause();
            });

            showMainMenu();

            muffleBGM(true);
            try { (k as any).pause && (k as any).pause(); } catch (e) { }
        } else {
            isPaused = false;
            isGamePaused = false;
            muffleBGM(false);
            
            if (pauseOverlay && pauseOverlay.destroy) pauseOverlay.destroy();
            if (pauseCloseBtn && pauseCloseBtn.destroy) pauseCloseBtn.destroy();
            pauseUIObjects.forEach(obj => obj.destroy && obj.destroy());
            
            pauseOverlay = pauseCloseBtn = null;
            pauseUIObjects = [];

            try { (k as any).resume && (k as any).resume(); } catch (e) { }
        }
    };

    k.onKeyPress(["escape", "p"], () => togglePause());

    // Auto-pause on exiting fullscreen while in the game scene
    const onFullScreenChangeGame = () => {
        const full = isFullscreenActive();
        if (!full && !isPaused && !isGameOver) {
            togglePause();
        }
    };
    document.addEventListener("fullscreenchange", onFullScreenChangeGame);
    document.addEventListener("webkitfullscreenchange", onFullScreenChangeGame);

    player.onDestroy(() => {
        document.removeEventListener("fullscreenchange", onFullScreenChangeGame);
        document.removeEventListener("webkitfullscreenchange", onFullScreenChangeGame);
    });

    // 6. Sistema de Motor (Acelerar/Freio) e velocidade implacável global
    k.onUpdate(() => {
        if (isGamePaused) return;
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
        // Alta Velocidade esgota a paciência
        if (currentScrollSpeed > 800) {
            paciencia -= 5 * k.dt();
        } else if (currentScrollSpeed < BASE_SCROLL_SPEED + 50) {
            // Frear/Ir devagar alivia o estresse e a criança recupera a paciência
            paciencia += 4 * k.dt(); 
        }
        paciencia = Math.min(100, Math.max(0, paciencia));

        // Atualização Visual da Interface (Rosto e Barra)
        barraPacienciaUI.width = (paciencia / 100) * 332;
        
        if (paciencia > 60) {
            barraPacienciaUI.color = DESIGN.colors.primary; // Verde (Saudável)
            rostoBebeUI.use(k.sprite("ui_feliz"));
        } else if (paciencia > 30) {
            barraPacienciaUI.color = DESIGN.colors.alert; // Laranja (Atenção)
            rostoBebeUI.use(k.sprite("ui_ok"));
        } else {
            barraPacienciaUI.color = DESIGN.colors.critical; // Vermelho (Perigo)
            rostoBebeUI.use(k.sprite("ui_surto"));
        }

        // Tempo e Distância
        timeRemaining -= k.dt();
        distanceTraveled += (currentScrollSpeed / 10) * k.dt(); // 10 px = 1 metro

        // Condições de Vitória e Derrota
        if (!isGameOver) {
            if (paciencia <= 0) {
                isGameOver = true;
                k.go("gameover", { win: false, reason: "A paciência esgotou! O bebê chorou muito e você perdeu." });
            } else if (distanceTraveled >= TARGET_DISTANCE) {
                isGameOver = true;
                k.go("gameover", { win: true, reason: "Entrega concluída! O bebê sobreviveu em paz." });
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
            // Efeito de treme da tela se a paciência estiver muito baixa (Perigo)
            if (paciencia < 30 && Math.random() < 0.1) {
                k.shake(1);
            }
        }
    });

});

// ---- CENA DE CUTSCENE (Narrativa) ----
k.scene("cutscene", () => {
    // ---- BGM DA CUTSCENE ----
    playBGM("bgm_cutscene");

    let currentSlide = 1;

    // Fundo da Cutscene
    const bg = k.add([
        k.sprite("bg_cutscene_1"),
        k.pos(0, 0),
        k.scale(k.width() / 1280, k.height() / 720),
        k.z(0)
    ]);

    // Seta Esquerda
    const leftArrow = k.add([
        k.sprite("seta_esquerda"),
        k.pos(50, k.height() / 2), // Centralizado Verticalmente
        k.anchor("center"),
        k.area(),
        k.z(10),
        "btn_left"
    ]);

    // Seta Direita
    k.add([
        k.sprite("seta_direita"),
        k.pos(k.width() - 50, k.height() / 2), // Centralizado Verticalmente
        k.anchor("center"),
        k.area(),
        k.z(10),
        "btn_right"
    ]);

    // Ocultar seta esquerda na primeira tela
    leftArrow.hidden = true;

    // Lógica para avançar/retroceder interface
    const updateSlide = () => {
        bg.use(k.sprite("bg_cutscene_" + currentSlide));
        leftArrow.hidden = (currentSlide === 1);
    };

    k.onClick("btn_right", () => {
        k.play("sfx_click", { volume: 0.6 });
        if (currentSlide < 4) {
            currentSlide++;
            updateSlide();
        } else {
            // Fim da cutscene! Bora jogar!
            k.go("game");
        }
    });

    k.onClick("btn_left", () => {
        k.play("sfx_click", { volume: 0.6 });
        if (currentSlide > 1) {
            currentSlide--;
            updateSlide();
        } else {
            // Retorna ao menu
            k.go("menu");
        }
    });

    k.onHover("btn_right", () => {
        k.setCursor("pointer");
        k.play("sfx_hover", { volume: 0.5 });
    });
    k.onHoverEnd("btn_right", () => {
        k.setCursor("default");
    });
    k.onHover("btn_left", () => {
        k.setCursor("pointer");
        k.play("sfx_hover", { volume: 0.5 });
    });
    k.onHoverEnd("btn_left", () => {
        k.setCursor("default");
    });
});

// ---- CENA DE MENU INICIAL ----
k.scene("menu", () => {
    // ---- BGM DO MENU ----
    playBGM("bgm_menu");

    k.add([
        k.sprite("tela_inicial"),
        k.pos(0, 0),
        k.scale(k.width() / 1280, k.height() / 720),
    ]);

    // Ajuste fino do Y para encaixar verticalmente no centro de cada listra bege
    const options = [
        { text: "Novo Jogo", y: 390, action: () => k.go("cutscene") },
        { text: "Configurações", y: 475, action: () => k.go("configuracoes") },
        { text: "Instruções", y: 560, action: () => k.go("instrucoes") }
    ];

    const menuPlateX = 50;
    const menuPlateHeight = 52;
    const menuPlateWidth = 330;
    const menuTextOffsetX = 24;

    options.forEach((opt) => {
        const plate = k.add([
            k.rect(menuPlateWidth, menuPlateHeight, { radius: DESIGN.radius.large }),
            k.pos(menuPlateX, opt.y),
            k.anchor("left"),
            k.color(DESIGN.colors.menuPlate),
            k.outline(4, DESIGN.colors.menuPlateOutline),
            k.area(),
            k.z(1),
            "menu_plate"
        ]);

        const btn = k.add([
            k.text(opt.text, { size: DESIGN.font.button, font: "Fredoka" }),
            k.pos(menuPlateX + menuTextOffsetX, opt.y),
            k.anchor("left"),
            k.color(DESIGN.colors.menuText),
            k.z(2),
            "menu_btn"
        ]);

        plate.onHover(() => {
            if (plate.color.r !== DESIGN.colors.menuPlateHover.r) {
                k.play("sfx_hover", { volume: 0.5 });
            }
            plate.color = DESIGN.colors.menuPlateHover;
            btn.color = DESIGN.colors.menuTextHover;
        });

        plate.onHoverEnd(() => {
            plate.color = DESIGN.colors.menuPlate;
            btn.color = DESIGN.colors.menuText;
        });

        plate.onClick(() => {
            k.play("sfx_click", { volume: 0.6 });
            opt.action();
        });
    });
});

// ---- CENAS DE INSTRUÇÕES E CONFIGURAÇÕES ----
k.scene("instrucoes", () => {
    k.add([
        k.sprite("bg_instrucoes"),
        k.pos(0, 0),
        k.scale(k.width() / 3840, k.height() / 2160),
        k.z(0)
    ]);

    // Botão Voltar
    createStandardButton("Voltar", k.vec2(k.width() / 2, k.height() - 80), () => k.go("menu"));
});

k.scene("configuracoes", () => {
    k.add([
        k.sprite("bg_configuracoes"),
        k.pos(0, 0),
        k.scale(k.width() / 3840, k.height() / 2160),
        k.z(0)
    ]);

    // ---- VOLUME SLIDER ----
    const sliderLeft = 570;
    const sliderWidth = 300;
    const sliderY = 285;

    // Track background
    const track = k.add([
        k.rect(sliderWidth, 16, { radius: 8 }),
        k.pos(sliderLeft, sliderY),
        k.color(DESIGN.colors.menuPlateOutline),
        k.outline(3, DESIGN.colors.menuPlateOutline),
        k.area(),
        k.anchor("left"),
        k.z(1)
    ]);

    // Track fill
    const fill = k.add([
        k.rect(sliderWidth * globalVolume, 16, { radius: 8 }),
        k.pos(sliderLeft, sliderY),
        k.color(DESIGN.colors.primary),
        k.anchor("left"),
        k.z(2)
    ]);

    // Handle
    const handle = k.add([
        k.circle(14),
        k.pos(sliderLeft + sliderWidth * globalVolume, sliderY),
        k.color(DESIGN.colors.menuPlate),
        k.outline(3, DESIGN.colors.menuPlateOutline),
        k.area(),
        k.anchor("center"),
        k.z(3)
    ]);

    // Text representation of volume
    const volumeLabel = k.add([
        k.text(Math.round(globalVolume * 100) + "%", {
            size: 24,
            font: "Fredoka",
        }),
        k.pos(sliderLeft + sliderWidth + 20, sliderY),
        k.anchor("left"),
        k.color(DESIGN.colors.menuText),
        k.z(2)
    ]);

    let isDraggingVolume = false;

    const updateVolumeFromMouse = () => {
        const mouseX = k.mousePos().x;
        let pct = (mouseX - sliderLeft) / sliderWidth;
        pct = Math.max(0, Math.min(1, pct));
        globalVolume = pct;
        k.volume(globalVolume);
        
        // Update visuals
        fill.width = sliderWidth * globalVolume;
        handle.pos.x = sliderLeft + sliderWidth * globalVolume;
        volumeLabel.text = Math.round(globalVolume * 100) + "%";
    };

    track.onClick(() => {
        updateVolumeFromMouse();
    });

    handle.onHover(() => {
        k.play("sfx_hover", { volume: 0.5 });
        k.setCursor("pointer");
    });
    handle.onHoverEnd(() => {
        k.setCursor("default");
    });

    k.onMouseDown(() => {
        if (track.isHovering() || handle.isHovering()) {
            isDraggingVolume = true;
        }
    });

    k.onMouseRelease(() => {
        isDraggingVolume = false;
    });

    k.onUpdate(() => {
        if (isDraggingVolume) {
            updateVolumeFromMouse();
        }
    });

    // ---- FULLSCREEN BUTTONS (SIM / NÃO) ----

    let isFull = isFullscreenActive();
    const btnWidth = 110;
    const btnHeight = 50;
    const btnRadius = 25;

    // Sim Button container
    const btnSim = k.add([
        k.pos(650, 385),
        k.area({ shape: new k.Rect(k.vec2(0, 0), btnWidth, btnHeight) }),
        k.anchor("center"),
        k.z(100),
        "toggle_btn"
    ]);

    // Sim shadow
    const shadowSim = btnSim.add([
        k.rect(btnWidth, btnHeight, { radius: btnRadius }),
        k.pos(0, 6),
        k.anchor("center"),
        k.color(),
    ]);

    // Sim plate
    const plateSim = btnSim.add([
        k.rect(btnWidth, btnHeight, { radius: btnRadius }),
        k.pos(0, 0),
        k.anchor("center"),
        k.outline(3, DESIGN.colors.menuPlateOutline),
        k.color(),
    ]);

    // Sim label
    const labelSim = btnSim.add([
        k.text("Sim", { size: 24, font: "Fredoka", align: "center" }),
        k.pos(0, 0),
        k.anchor("center"),
        k.outline(2, k.rgb(255, 255, 255)),
        k.color(),
    ]);

    // Não Button container
    const btnNao = k.add([
        k.pos(780, 385),
        k.area({ shape: new k.Rect(k.vec2(0, 0), btnWidth, btnHeight) }),
        k.anchor("center"),
        k.z(100),
        "toggle_btn"
    ]);

    // Não shadow
    const shadowNao = btnNao.add([
        k.rect(btnWidth, btnHeight, { radius: btnRadius }),
        k.pos(0, 6),
        k.anchor("center"),
        k.color(),
    ]);

    // Não plate
    const plateNao = btnNao.add([
        k.rect(btnWidth, btnHeight, { radius: btnRadius }),
        k.pos(0, 0),
        k.anchor("center"),
        k.outline(3, DESIGN.colors.menuPlateOutline),
        k.color(),
    ]);

    // Não label
    const labelNao = btnNao.add([
        k.text("Não", { size: 24, font: "Fredoka", align: "center" }),
        k.pos(0, 0),
        k.anchor("center"),
        k.outline(2, k.rgb(255, 255, 255)),
        k.color(),
    ]);

    const refreshButtons = () => {
        const full = isFullscreenActive();
        
        // Sim Button Colors
        shadowSim.color = full ? k.rgb(30, 112, 128) : k.rgb(133, 115, 102);
        plateSim.color = full ? k.rgb(74, 229, 226) : k.rgb(194, 180, 169);
        labelSim.color = full ? k.rgb(0, 0, 0) : k.rgb(100, 90, 85);

        // Não Button Colors
        shadowNao.color = !full ? k.rgb(30, 112, 128) : k.rgb(133, 115, 102);
        plateNao.color = !full ? k.rgb(74, 229, 226) : k.rgb(194, 180, 169);
        labelNao.color = !full ? k.rgb(0, 0, 0) : k.rgb(100, 90, 85);
    };

    refreshButtons();

    btnSim.onClick(() => {
        k.play("sfx_click", { volume: 0.6 });
        plateSim.pos.y = 3;
        labelSim.pos.y = 3;
        k.wait(0.1, () => {
            plateSim.pos.y = 0;
            labelSim.pos.y = 0;
            toggleFullscreen(true);
            k.wait(0.1, () => {
                refreshButtons();
            });
        });
    });

    btnNao.onClick(() => {
        k.play("sfx_click", { volume: 0.6 });
        plateNao.pos.y = 3;
        labelNao.pos.y = 3;
        k.wait(0.1, () => {
            plateNao.pos.y = 0;
            labelNao.pos.y = 0;
            toggleFullscreen(false);
            k.wait(0.1, () => {
                refreshButtons();
            });
        });
    });

    btnSim.onHover(() => {
        if (!isFullscreenActive()) {
            k.play("sfx_hover", { volume: 0.5 });
        }
        k.setCursor("pointer");
        if (!isFullscreenActive()) {
            plateSim.color = k.rgb(214, 200, 189);
        } else {
            plateSim.color = k.rgb(53, 181, 235);
        }
    });
    btnSim.onHoverEnd(() => {
        k.setCursor("default");
        refreshButtons();
    });

    btnNao.onHover(() => {
        if (isFullscreenActive()) {
            k.play("sfx_hover", { volume: 0.5 });
        }
        k.setCursor("pointer");
        if (isFullscreenActive()) {
            plateNao.color = k.rgb(214, 200, 189);
        } else {
            plateNao.color = k.rgb(53, 181, 235);
        }
    });
    btnNao.onHoverEnd(() => {
        k.setCursor("default");
        refreshButtons();
    });

    btnSim.onUpdate(() => {
        const currentFull = isFullscreenActive();
        if (isFull !== currentFull) {
            isFull = currentFull;
            refreshButtons();
        }
    });

    const onFullScreenChange = () => {
        isFull = isFullscreenActive();
        refreshButtons();
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 150);
    };
    document.addEventListener("fullscreenchange", onFullScreenChange);
    document.addEventListener("webkitfullscreenchange", onFullScreenChange);

    track.onDestroy(() => {
        document.removeEventListener("fullscreenchange", onFullScreenChange);
        document.removeEventListener("webkitfullscreenchange", onFullScreenChange);
    });

    // Botão Voltar
    createStandardButton("Voltar", k.vec2(k.width() / 2, k.height() - 80), () => k.go("menu"));
});

// ---- CENA DE START PARA PERMITIR ÁUDIO ----
k.scene("start", () => {
    // Fundo escuro simples
    k.add([
        k.rect(k.width(), k.height()),
        k.pos(0, 0),
        k.color(DESIGN.colors.black)
    ]);

    k.add([
        k.text("Clique na tela para iniciar", { size: DESIGN.font.title, font: "Fredoka", align: "center" }),
        k.pos(k.width() / 2, k.height() / 2),
        k.anchor("center"),
        k.color(DESIGN.colors.white),
    ]);

    k.onClick(() => {
        k.play("sfx_click", { volume: 0.6 });
        k.go("menu");
    });
});

k.go("start");

// ---- CENA DE GAME OVER / VITORIA ----
k.scene("gameover", ({ win, reason }: { win: boolean, reason: string }) => {
    // ---- JINGLE DE VITÓRIA OU DERROTA ----
    stopBGM();
    k.play(win ? "jingle_vitoria" : "jingle_derrota", { loop: false, volume: 0.8 });

    k.add([
        k.sprite(win ? "bg_vitoria" : "bg_derrota"),
        k.pos(0,0),
        k.scale(k.width() / 1280, k.height() / 720),
        k.z(0)
    ]);

    // Texto de Motivo + Reiniciar flutuando
    const restartText = k.add([
        k.text(reason + "\n\nPressione ESPAÇO ou R para focar e voltar ao menu", { size: DESIGN.font.hud, font: "Fredoka", align: "center" }),
        k.pos(k.width() / 2, k.height() - 90),
        k.anchor("center"),
        k.color(DESIGN.colors.white),
        k.opacity(1),
        k.outline(5, DESIGN.colors.black),
        k.z(2)
    ]);

    restartText.onUpdate(() => {
        restartText.opacity = Math.floor(k.time() * 3) % 2 === 0 ? 1 : 0.4;
    });

    k.onKeyPress(["r", "space"], () => k.go("menu"));
});
