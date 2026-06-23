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
k.loadSprite("seta_direita_hover", "./assets/ui_seta_direita_hover.png");
k.loadSprite("seta_esquerda_hover", "./assets/ui_seta_esquerda_hover.png");
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
k.loadSprite("bg_instrucoes_1", "./assets/instrucoes_1.png");
k.loadSprite("bg_instrucoes_2", "./assets/instrucoes_2.png");
k.loadSprite("bg_configuracoes", "./assets/bg_configuracoes.png");
// Tutorial
k.loadSprite("tutorial_1", "./assets/tutorial-1.png");
k.loadSprite("tutorial_2", "./assets/tutorial-2.png");

// ---- ÁUDIO: Carregamento dos BGMs ----
k.loadSound("bgm_menu", "./assets/tela-inicial.mp3");
k.loadSound("bgm_gameplay", "./assets/gameplay.mp3");
k.loadSound("bgm_cutscene", "./assets/cutscene.ogg");
k.loadSound("jingle_vitoria", "./assets/vitoria.mp3");
k.loadSound("jingle_derrota", "./assets/derrota.wav");

// ---- ÁUDIO: Carregamento de SFX ----
k.loadSound("sfx_hover", "./assets/rollover-menu.wav");
k.loadSound("sfx_click", "./assets/click-botao.wav");
k.loadSound("sfx_bebe_raiva", "./assets/sfx_bebe_raiva.mp3");
k.loadSound("sfx_aceleracao_moto", "./assets/sfx_aceleracao_moto.mp3");
k.loadSound("colisao_carro", "./assets/colisao_carro.mp3");
k.loadSound("sfx_cair_no_buraco", "./assets/sfx_cair_no_buraco.mp3");
k.loadSound("sfx_buzina_carro", "./assets/sfx_buzina_carro.mp3");
k.loadSound("sfx_entrega_sucesso", "./assets/entrega-sucesso.mp3");
k.loadSound("sfx_entrega_fracasso", "./assets/entrega-fracasso.mp3");

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
        try { _currentBGM.stop(); } catch (e) { }
    }
    _currentBGM = k.play(key, { loop, volume });
    _currentBGMKey = key;
};

const stopBGM = () => {
    if (_currentBGM) {
        try { _currentBGM.stop(); } catch (e) { }
        _currentBGM = null;
        _currentBGMKey = null;
    }
};

// Pausa a BGM durante a pausa
const muffleBGM = (muffled: boolean) => {
    if (!_currentBGM) return;
    _currentBGM.paused = muffled;
};

const setGameplayAudioPaused = (paused: boolean, audioTargets?: { engineSound?: any; babyCrySound?: any }) => {
    muffleBGM(paused);

    if (audioTargets?.engineSound) {
        try { audioTargets.engineSound.paused = paused; } catch (e) { }
    }

    if (audioTargets?.babyCrySound) {
        try { audioTargets.babyCrySound.paused = paused; } catch (e) { }
    }
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
export function createStandardButton(text: string, pos: any, action: () => void, zIndex: number = 100, customWidth?: number, customHeight?: number, customFontSize?: number) {
    const btnWidth = customWidth || 320;
    const btnHeight = customHeight || 60;
    const btnRadius = btnHeight / 2;
    const shadowOffset = Math.round(btnHeight * 0.133); // 8px para botão de 60px, 6px para botão de 50px

    // Container principal do botão (sem anchor para evitar bugs de herança em sub-objetos)
    const btn = k.add([
        k.pos(pos),
        k.area({ shape: new k.Rect(k.vec2(-btnWidth / 2, -btnHeight / 2), btnWidth, btnHeight) }),
        k.z(zIndex),
        "standard_btn",
        {
            disabled: false,
            shadowObj: null as any,
            plateObj: null as any,
            labelObj: null as any,
            setDisabled(val: boolean) {
                const self = this as any;
                self.disabled = val;

                if (val) {
                    if (self.plateObj) self.plateObj.color = k.rgb(180, 180, 180);
                    if (self.shadowObj) self.shadowObj.color = k.rgb(120, 120, 120);
                    if (self.labelObj) self.labelObj.color = k.rgb(100, 100, 100);
                } else {
                    if (self.plateObj) self.plateObj.color = k.rgb(74, 229, 226);
                    if (self.shadowObj) self.shadowObj.color = k.rgb(30, 112, 128);
                    if (self.labelObj) self.labelObj.color = k.rgb(0, 0, 0);
                }
            }
        }
    ]);

    // 1. Sombra / Placa de fundo escurecida (efeito 3D flat)
    const shadow = btn.add([
        k.rect(btnWidth, btnHeight, { radius: btnRadius }),
        k.pos(0, shadowOffset), // Deslocado proporcionalmente para baixo
        k.anchor("center"),
        k.color(30, 112, 128), // Azul Marinho / Teal escuro
    ]);

    // 2. Botão Principal
    const plate = btn.add([
        k.rect(btnWidth, btnHeight, { radius: btnRadius }),
        k.pos(0, 0),
        k.anchor("center"),
        k.color(74, 229, 226), // Ciano
    ]);

    // 3. Texto com Outline
    const label = btn.add([
        k.text(text, {
            size: customFontSize || DESIGN.font.button || 32,
            font: "Fredoka",
            align: "center",
        }),
        k.pos(0, 0),
        k.anchor("center"),
        k.color(0, 0, 0),
        k.outline(4, k.rgb(255, 255, 255)), // Contorno branco espesso
    ]);

    (btn as any).shadowObj = shadow;
    (btn as any).plateObj = plate;
    (btn as any).labelObj = label;

    // Efeitos de Hover
    btn.onHover(() => {
        if (btn.disabled) return;
        if (plate.color.r !== 53) { // Toca o som apenas na transição inicial de hover
            k.play("sfx_hover", { volume: 0.5 });
        }
        plate.color = k.rgb(53, 181, 235); // Azul celeste ao passar o mouse
        k.setCursor("pointer");
    });

    btn.onHoverEnd(() => {
        if (btn.disabled) return;
        plate.color = k.rgb(74, 229, 226); // Volta ao ciano
        k.setCursor("default");
    });

    // Ação de Clique
    btn.onClick(() => {
        if (btn.disabled) return;
        k.play("sfx_click", { volume: 0.6 });
        // Efeito de "pressão"
        plate.pos.y = Math.round(btnHeight * 0.067); // 4px para botão de 60px, 3px para botão de 50px
        label.pos.y = Math.round(btnHeight * 0.067);

        k.wait(0.1, () => {
            plate.pos.y = 0;
            label.pos.y = 0;
            action();
        });
    });

    return btn;
}

// ---- COMPONENTE DE TUTORIAL MODAL ----
export function createTutorialOverlay(spriteKey: string, buttonText: string, onClose: () => void): any {
    // Estado para rastrear se o overlay está ativo
    let isActive = true;

    // Overlay semi-transparente de fundo
    const overlay = k.add([
        k.rect(k.width(), k.height()),
        k.pos(0, 0),
        k.color(0, 0, 0),
        k.opacity(0.6),
        k.fixed(),
        k.z(5000),
        "tutorial_overlay_bg"
    ]);

    // Pausa o jogo
    isGamePaused = true;

    // Container para a imagem do tutorial (centralizado)
    const tutorialContainer = k.add([
        k.pos(k.width() / 2, k.height() / 2),
        k.anchor("center"),
        k.fixed(),
        k.z(5001),
        "tutorial_container"
    ]);

    // Imagem do tutorial
    const tutorialImage = tutorialContainer.add([
        k.sprite(spriteKey),
        k.pos(0, 0),
        k.anchor("center"),
        k.scale(1)
    ]);

    // Botão no espaço inferior (branco) da imagem
    // Assumindo que a imagem é quadrada e tem espaço em branco na parte inferior
    const imageHeight = tutorialImage.height || 400; // fallback de 400px
    const buttonYOffset = (imageHeight / 2) - 58; // um pouco mais alto para respirar da borda inferior

    const btn = tutorialContainer.add([
        k.rect(200, 48, { radius: 24 }),
        k.pos(0, buttonYOffset),
        k.anchor("center"),
        k.color(74, 229, 226), // Ciano
        k.area(),
        {
            plateObj: null as any,
            labelObj: null as any,
        }
    ]);

    // Sombra do botão
    const btnShadow = tutorialContainer.add([
        k.rect(200, 48, { radius: 24 }),
        k.pos(4, buttonYOffset + 4),
        k.anchor("center"),
        k.color(30, 112, 128), // Azul marinho
        k.z(-1)
    ]);

    // Texto do botão
    const btnLabel = btn.add([
        k.text(buttonText, {
            size: 24,
            font: "Fredoka",
            align: "center"
        }),
        k.anchor("center"),
        k.pos(0, 0),
        k.color(0, 0, 0),
        k.outline(2, k.rgb(255, 255, 255))
    ]);

    (btn as any).plateObj = btn;
    (btn as any).labelObj = btnLabel;

    const finishTutorial = () => {
        if (!isActive) return;

        isActive = false;
        overlay.destroy();
        tutorialContainer.destroy();
        btnShadow.destroy();
        isGamePaused = false;

        onClose();
    };

    // Hover effects
    btn.onHover(() => {
        if ((btn as any).disabled) return;
        if (btn.color.r !== 53) {
            k.play("sfx_hover", { volume: 0.5 });
        }
        btn.color = k.rgb(53, 181, 235);
        btnShadow.color = k.rgb(20, 90, 110);
        k.setCursor("pointer");
    });

    btn.onHoverEnd(() => {
        if ((btn as any).disabled) return;
        btn.color = k.rgb(74, 229, 226);
        btnShadow.color = k.rgb(30, 112, 128);
        k.setCursor("default");
    });

    // Click handler
    btn.onClick(() => {
        k.play("sfx_click", { volume: 0.6 });
        // Efeito de pressão
        btn.pos.y += 2;
        btnLabel.pos.y += 2;

        k.wait(0.1, () => {
            btn.pos.y -= 2;
            btnLabel.pos.y -= 2;

            finishTutorial();
        });
    });

    return {
        destroy: () => {
            if (isActive) {
                overlay.destroy();
                tutorialContainer.destroy();
                btnShadow.destroy();
                isGamePaused = false;
                isActive = false;
            }
        }
    };
}

k.scene("game", () => {
    // ---- BGM DA GAMEPLAY ----
    playBGM("bgm_gameplay");

    let engineSound: any = null;
    let targetEngineVol = 0.1;

    const pauseGameplayAudio = (paused: boolean) => {
        setGameplayAudioPaused(paused, { engineSound, babyCrySound });
    };

    const playEngineLoop = (seekTime: number) => {
        try {
            engineSound = k.play("sfx_aceleracao_moto", { loop: false, volume: targetEngineVol });
            engineSound.seek(seekTime);
            engineSound.onEnd(() => {
                if (!isGameOver) {
                    playEngineLoop(3.0);
                }
            });
        } catch (e) {
            console.warn("Could not play engine sound immediately due to autoplay policies.");
        }
    };
    playEngineLoop(0);

    // Objeto invisível para parar os loops de áudio ao mudar/reiniciar a cena
    const audioCleanupHelper = k.add(["audio_cleanup"]);
    audioCleanupHelper.onDestroy(() => {
        if (engineSound) {
            try { engineSound.stop(); } catch (e) { }
        }
        if (babyCrySound) {
            try { babyCrySound.stop(); } catch (e) { }
        }
    });

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
    let currentLane = 2; // Começa no meio
    let isChangingLane = false;
    let corridorTimer = 0;
    const CORRIDOR_GRACE = 0.9; // seconds

    // 4. Estado do Jogo (Condições de Vitória/Derrota)
    let isGameOver = false;
    let distanceTraveled = 0; // Metros
    let timeRemaining = 40;   // Segundos (Arcade Express)
    let tempoDecorridoReal = 0; // Tempo de gameplay real decorrido
    const TARGET_DISTANCE = 3000; // Distância total para vencer
    let paciencia = 100;
    let babyCrySound: any = null; // Guarda a referência do som de choro

    // Arcade Express - Mecânica de Entregas
    let entregasFeitas = 0;
    let entregasPerdidas = 0;
    const TOTAL_ENTREGAS = 7;
    let targetsSpawned = 0;
    let lastTargetSpawnDistance = 0;
    const TARGET_SPAWN_INTERVAL = TARGET_DISTANCE / TOTAL_ENTREGAS; // ~428m

    // 5. Configuração do Mundo Físico
    let damageTimer = 0; // Controle de feedback visual de dano por tempo

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
        k.color(255, 255, 255),
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

    // Relógio (Topo Centro)
    const relogioContainer = k.add([
        k.rect(140, 50, { radius: DESIGN.radius.large }),
        k.pos(k.width() / 2, 60), // Y=60 alinha com o centro da barra de paciência (Y=44 + metade de 32)
        k.anchor("center"),
        k.color(DESIGN.colors.neutral),
        k.fixed(),
        k.z(1000)
    ]);

    const relogioTextoHUD = relogioContainer.add([
        k.text("40s", { size: 36, font: "Fredoka" }),
        k.anchor("center"),
        k.color(DESIGN.colors.white),
        k.pos(0, 0)
    ]);

    // Caderno (Topo Direito)
    const cadernoHUD = k.add([
        k.sprite("ui_caderno"),
        k.pos(k.width() - 20, 20),
        k.anchor("topright"),
        k.scale(1.5), // Aumentando o tamanho visual do asset
        k.fixed(),
        k.z(1000)
    ]);

    const entregasTextoHUD = cadernoHUD.add([
        k.text(`${entregasFeitas}/7`, { size: 24, font: "Fredoka" }),
        k.pos(-34, 32), // Ajuste fino para esquerda e com fonte menor
        k.anchor("center"),
        k.color(50, 50, 50)
    ]);

    // ---- BOLINHAS DE ENTREGA (abaixo do caderno) ----
    let deliveryIndex = 0; // Índice sequencial da próxima entrega
    const dotRadius = 6;
    // Caderno: pos(1260, 20), anchor topright, scale 1.5 => 96x96px
    // Borda esquerda = 1260 - 96 = 1164, Borda direita = 1260, Base = 20 + 96 = 116
    const cadernoLeft = k.width() - 20 - 96 + dotRadius; // 1164 + margem do raio
    const cadernoRight = k.width() - 20 - dotRadius;      // 1260 - margem do raio
    const dotSpacing = (cadernoRight - cadernoLeft) / (TOTAL_ENTREGAS - 1);
    const dotsY = 124; // Logo abaixo do caderno (116 + 8px gap)

    const deliveryDots: any[] = [];
    for (let i = 0; i < TOTAL_ENTREGAS; i++) {
        const dot = k.add([
            k.circle(dotRadius),
            k.pos(cadernoLeft + i * dotSpacing, dotsY),
            k.anchor("center"),
            k.color(160, 160, 160), // Cinza neutro (sem resultado ainda)
            k.outline(2, k.rgb(80, 80, 80)),
            k.fixed(),
            k.z(1000)
        ]);
        deliveryDots.push(dot);
    }

    const markDeliveryDot = (index: number, success: boolean) => {
        if (index >= 0 && index < deliveryDots.length) {
            if (success) {
                deliveryDots[index].color = k.rgb(50, 205, 50); // Verde mais vivo (estilo semáforo)
                deliveryDots[index].outline.color = k.rgb(34, 139, 34); // Contorno verde escuro
            } else {
                deliveryDots[index].color = k.rgb(230, 57, 70); // Vermelho
                deliveryDots[index].outline.color = k.rgb(140, 30, 40);
            }
        }
    };

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

        // LÓGICA ARCADE EXPRESS: Checar se spawnamos um alvo
        let isTargetSup = false;
        let isTargetInf = false;

        if (targetsSpawned < TOTAL_ENTREGAS && distanceTraveled >= lastTargetSpawnDistance + TARGET_SPAWN_INTERVAL) {
            lastTargetSpawnDistance += TARGET_SPAWN_INTERVAL;
            targetsSpawned++;
            if (k.chance(0.5)) isTargetSup = true;
            else isTargetInf = true;
        }

        // CORREIO SUPERIOR (Topo da Calçada)
        const spriteSup = toggleSpriteCorreio ? "correio_1" : "correio_2";
        const yPosSup = 236; // Topo da calçada corrigido

        const correioSup = k.add([
            k.sprite(spriteSup),
            k.pos(xPos, yPosSup),
            k.anchor("center"),
            k.z(-10),
            "correio",
            { isTarget: isTargetSup, delivered: false, missed: false }
        ]);

        if (isTargetSup) {
            correioSup.add([
                k.sprite("seta_correio"),
                k.pos(0, -60), // Relativo ao centro da caixa
                k.anchor("center"),
                k.scale(0.5),
                k.outline(4, k.rgb(255, 255, 255)), // Contorno branco
                "seta"
            ]);
        }

        correioSup.onUpdate(() => {
            if (isGamePaused) return;
            correioSup.move(-currentScrollSpeed, 0);

            const seta = correioSup.get("seta")[0];
            if (seta) {
                seta.pos.y = -60 + Math.sin(k.time() * 4) * 8; // Flutuação suave
            }

            if (correioSup.pos.x < -100) {
                if (correioSup.isTarget && !correioSup.delivered && !correioSup.missed) {
                    correioSup.missed = true;
                    entregasPerdidas++;
                    markDeliveryDot(deliveryIndex, false);
                    deliveryIndex++;
                    paciencia -= 20; // Penalidade Grave
                    k.play("sfx_entrega_fracasso", { volume: 0.5 });
                }
                correioSup.destroy();
            }
        });

        // CORREIO INFERIOR (Base da Calçada)
        const spriteInf = toggleSpriteCorreio ? "correio_2" : "correio_1";
        const yPosInf = 680;

        const correioInf = k.add([
            k.sprite(spriteInf),
            k.pos(xPos, yPosInf),
            k.anchor("center"),
            k.z(100),
            "correio",
            { isTarget: isTargetInf, delivered: false, missed: false }
        ]);

        if (isTargetInf) {
            correioInf.add([
                k.sprite("seta_correio"),
                k.pos(0, -60),
                k.anchor("center"),
                k.scale(0.6),
                k.outline(4, k.rgb(255, 255, 255)), // Contorno branco
                "seta"
            ]);
        }

        correioInf.onUpdate(() => {
            if (isGamePaused) return;
            correioInf.move(-currentScrollSpeed, 0);

            const seta = correioInf.get("seta")[0];
            if (seta) {
                seta.pos.y = -60 + Math.sin(k.time() * 4) * 8; // Flutuação suave
            }

            if (correioInf.pos.x < -100) {
                if (correioInf.isTarget && !correioInf.delivered && !correioInf.missed) {
                    correioInf.missed = true;
                    entregasPerdidas++;
                    markDeliveryDot(deliveryIndex, false);
                    deliveryIndex++;
                    paciencia -= 20; // Penalidade Grave
                    k.play("sfx_entrega_fracasso", { volume: 0.5 });
                }
                correioInf.destroy();
            }
        });

        toggleSpriteCorreio = !toggleSpriteCorreio;
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
            k.play("sfx_buzina_carro", { volume: 0.3 });
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
            // Verifica se não está pausado antes de tentar spawnar
            if (!isGamePaused) {
                // Limita a quantidade de instâncias geradas pra não entupir de forma punitiva a tela
                if (k.get("car").length < 6) {
                    spawnCar();
                }
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
            if (!isGamePaused) {
                if (k.get("pothole").length < 5) {
                    spawnPothole();
                }
            }
            loopPotholes();
        });
    };
    loopPotholes();

    // ---- COLISÕES ----
    player.onCollide("pothole", () => {
        if (isGamePaused) return;
        k.play("sfx_cair_no_buraco", { volume: 0.5 });
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
        k.play("colisao_carro", { volume: 0.5 });
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
            if (engineSound) { try { engineSound.stop(); } catch (e) { } }
            if (babyCrySound) { try { babyCrySound.stop(); } catch (e) { } }
            k.go("game");
        }, 2001);

        const btnQuit = createStandardButton("Sair do Jogo", k.vec2(k.width() / 2, 540), () => {
            togglePause();
            if (engineSound) { try { engineSound.stop(); } catch (e) { } }
            if (babyCrySound) { try { babyCrySound.stop(); } catch (e) { } }
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

        let currentInstrPage = 0;
        const instrSprites = ["bg_instrucoes_1", "bg_instrucoes_2"];

        const bgInst = k.add([
            k.sprite(instrSprites[0]),
            k.pos(k.width() / 2, k.height() / 2),
            k.anchor("center"),
            k.scale(k.width() / 3840, k.height() / 2160),
            k.z(2100)
        ]);

        const btnAnterior = createStandardButton("Anterior", k.vec2(k.width() / 2 - 220, k.height() - 80), () => {
            if (currentInstrPage > 0) {
                currentInstrPage--;
                bgInst.use(k.sprite(instrSprites[currentInstrPage]));
                updateBtnStates();
            }
        }, 2101, 200, 54, 30);

        const btnVoltar = createStandardButton("Voltar", k.vec2(k.width() / 2, k.height() - 80), () => {
            bgInst.destroy();
            showMainMenu();
        }, 2101, 200, 54, 30);

        const btnProximo = createStandardButton("Próximo", k.vec2(k.width() / 2 + 220, k.height() - 80), () => {
            if (currentInstrPage < instrSprites.length - 1) {
                currentInstrPage++;
                bgInst.use(k.sprite(instrSprites[currentInstrPage]));
                updateBtnStates();
            }
        }, 2101, 200, 54, 30);

        const updateBtnStates = () => {
            (btnAnterior as any).setDisabled(currentInstrPage === 0);
            (btnProximo as any).setDisabled(currentInstrPage === instrSprites.length - 1);
        };
        updateBtnStates();

        pauseUIObjects.push(bgInst, btnAnterior, btnVoltar, btnProximo);
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

            pauseGameplayAudio(true);
            try { (k as any).pause && (k as any).pause(); } catch (e) { }
        } else {
            isPaused = false;
            isGamePaused = false;
            pauseGameplayAudio(false);

            if (pauseOverlay && pauseOverlay.destroy) pauseOverlay.destroy();
            if (pauseCloseBtn && pauseCloseBtn.destroy) pauseCloseBtn.destroy();
            pauseUIObjects.forEach(obj => obj.destroy && obj.destroy());

            pauseOverlay = pauseCloseBtn = null;
            pauseUIObjects = [];

            try { (k as any).resume && (k as any).resume(); } catch (e) { }
        }
    };

    k.onKeyPress(["escape", "p"], () => togglePause());


    // Lógica de Entrega (Arcade Express)
    k.onKeyPress(["space", "e"], () => {
        if (isGamePaused || isGameOver) return;

        // Apenas as faixas 0 (Cima) e 4 (Baixo) permitem entregas
        if (currentLane !== 0 && currentLane !== 4) return;

        const correios = k.get("correio");
        let entregou = false;

        for (const c of correios) {
            if (c.isTarget && !c.delivered && !c.missed) {
                // Checar se o player está próximo o suficiente no Eixo X (Margem de erro de 150px)
                const distX = Math.abs(c.pos.x - player.pos.x);
                if (distX < 150) {
                    // Checar se o player está na calçada correta
                    // Correio superior tem y = 236. Inferior = 680
                    const isTopMailbox = c.pos.y < 400;

                    if ((isTopMailbox && currentLane === 0) || (!isTopMailbox && currentLane === 4)) {
                        c.delivered = true;
                        entregasFeitas++;
                        entregasTextoHUD.text = `${entregasFeitas}/7`;
                        markDeliveryDot(deliveryIndex, true);
                        deliveryIndex++;

                        timeRemaining += 10;
                        paciencia = Math.min(100, paciencia + 10);

                        k.play("sfx_entrega_sucesso", { volume: 0.6 });

                        // Remover a seta visualmente
                        const seta = c.get("seta")[0];
                        if (seta) seta.destroy();

                        // Feedback visual flutuante (feito manualmente para evitar crash de engine)
                        const feedbackTempo = k.add([
                            k.text("+10s!", { size: 36, font: "Fredoka" }),
                            k.pos(c.pos.x, c.pos.y - 100),
                            k.color(DESIGN.colors.primary),
                            k.anchor("center"),
                            k.opacity(1) // Obrigatório para a opacidade funcionar no onUpdate
                        ]);

                        feedbackTempo.onUpdate(() => {
                            feedbackTempo.pos.y -= 150 * k.dt();
                            feedbackTempo.opacity = Math.max(0, feedbackTempo.opacity - k.dt());
                        });

                        k.wait(1, () => {
                            feedbackTempo.destroy();
                        });

                        entregou = true;
                        break;
                    }
                }
            }
        }

        // Se apertou no vazio ou na faixa errada
        if (!entregou) {
            paciencia -= 5;
            k.play("sfx_entrega_fracasso", { volume: 0.3, detune: -200 });
        }
    });

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

    // ---- SISTEMA DE TUTORIAL ----
    // Verifica se o tutorial já foi mostrado nesta sessão
    const tutorialShown = sessionStorage.getItem("tutorialShown");
    
    if (!tutorialShown) {
        // Delay de 3 segundos para o "respiro" (gameplay rodando antes do tutorial)
        k.wait(3, () => {
            pauseGameplayAudio(true);

            // Mostrar primeiro tutorial
            createTutorialOverlay("tutorial_1", "Próximo", () => {
                // Após fechar o primeiro, mostrar o segundo
                k.wait(0.5, () => {
                    createTutorialOverlay("tutorial_2", "Começar", () => {
                        // Tutorial completo
                        sessionStorage.setItem("tutorialShown", "true");
                        pauseGameplayAudio(false);
                    });
                });
            });
        });
    }

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

        if (engineSound && !isGameOver && !isGamePaused) {
            const vol = 0.1 + ((currentScrollSpeed - 400) / 800) * 0.3;
            targetEngineVol = Math.max(0, Math.min(0.4, vol));
            engineSound.volume = targetEngineVol;
        }

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
            rostoBebeUI.pos = k.vec2(20, 20);
            rostoBebeUI.color = k.rgb(255, 255, 255);
        } else if (paciencia > 30) {
            barraPacienciaUI.color = DESIGN.colors.alert; // Laranja (Atenção)
            rostoBebeUI.use(k.sprite("ui_ok"));
            rostoBebeUI.pos = k.vec2(20, 20);
            rostoBebeUI.color = k.rgb(255, 255, 255);
        } else {
            barraPacienciaUI.color = DESIGN.colors.critical; // Vermelho (Perigo)
            rostoBebeUI.use(k.sprite("ui_surto"));
            // Efeito de raiva: Tremendo e piscando
            rostoBebeUI.pos = k.vec2(20 + k.rand(-3, 3), 20 + k.rand(-3, 3));
            rostoBebeUI.color = Math.floor(k.time() * 10) % 2 === 0 ? k.rgb(255, 100, 100) : k.rgb(255, 255, 255);
        }

        // Tempo e Distância
        timeRemaining -= k.dt();
        tempoDecorridoReal += k.dt();
        distanceTraveled += (currentScrollSpeed / 10) * k.dt(); // 10 px = 1 metro

        // Atualiza a UI do Relógio
        relogioTextoHUD.text = `${Math.ceil(Math.max(0, timeRemaining))}s`;
        if (timeRemaining <= 10) {
            relogioTextoHUD.color = Math.floor(k.time() * 10) % 2 === 0 ? DESIGN.colors.critical : DESIGN.colors.white;
            relogioContainer.color = DESIGN.colors.black; // Para dar mais contraste no vermelho
        } else {
            relogioTextoHUD.color = DESIGN.colors.white;
            relogioContainer.color = DESIGN.colors.neutral;
        }

        // Condições de Vitória e Derrota
        if (!isGameOver) {
            if (paciencia <= 0) {
                isGameOver = true;
                if (babyCrySound) babyCrySound.stop();
                if (engineSound) engineSound.stop();
                k.go("gameover", { win: false, reason: "A paciência esgotou! O bebê chorou muito e você perdeu.", entregasFeitas, entregasPerdidas, tempoDecorridoReal });
            } else if (distanceTraveled >= TARGET_DISTANCE) {
                isGameOver = true;
                if (babyCrySound) babyCrySound.stop();
                if (engineSound) engineSound.stop();
                k.go("gameover", { win: true, reason: `Chegou na mãe da criança!\nVocê fez ${entregasFeitas}/7 entregas extra.`, entregasFeitas, entregasPerdidas, tempoDecorridoReal });
            } else if (timeRemaining <= 0) {
                isGameOver = true;
                if (babyCrySound) babyCrySound.stop();
                if (engineSound) engineSound.stop();
                k.go("gameover", { win: false, reason: "O tempo acabou! Você demorou demais.", entregasFeitas, entregasPerdidas, tempoDecorridoReal });
            }
        }

        // 6. Feedback Visual Centralizado
        if (damageTimer > 0) {
            damageTimer -= k.dt();
            player.hidden = Math.floor(k.time() * 20) % 2 === 0; // Blink of invulnerability/damage
        } else {
            player.hidden = false;
            // Estado Crítico (Barra Vermelha)
            if (paciencia < 30) {
                if (!babyCrySound) {
                    babyCrySound = k.play("sfx_bebe_raiva", { loop: true, volume: 0.3 });
                }
                if (Math.random() < 0.1) k.shake(1);
            } else {
                if (babyCrySound) {
                    babyCrySound.stop();
                    babyCrySound = null;
                }
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
        k.pos(80, k.height() / 2), // Centralizado Verticalmente e com mais margem
        k.anchor("center"),
        k.scale(0.6), // Escala reduzida
        k.area(),
        k.z(10),
        "btn_left"
    ]);

    leftArrow.onHover(() => {
        if (leftArrow.hidden) return;
        leftArrow.use(k.sprite("seta_esquerda_hover"));
        k.setCursor("pointer");
    });

    leftArrow.onHoverEnd(() => {
        if (leftArrow.hidden) return;
        leftArrow.use(k.sprite("seta_esquerda"));
        k.setCursor("default");
    });

    // Seta Direita
    const rightArrow = k.add([
        k.sprite("seta_direita"),
        k.pos(k.width() - 80, k.height() / 2), // Centralizado Verticalmente e com mais margem
        k.anchor("center"),
        k.scale(0.6), // Escala reduzida
        k.area(),
        k.z(10),
        "btn_right"
    ]);

    rightArrow.onHover(() => {
        rightArrow.use(k.sprite("seta_direita_hover"));
        k.setCursor("pointer");
    });

    rightArrow.onHoverEnd(() => {
        rightArrow.use(k.sprite("seta_direita"));
        k.setCursor("default");
    });

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

    // ---- CONTROLES DE TECLADO DA CUTSCENE ----
    // Avançar: Seta Direita, D, Space, Enter
    k.onKeyPress(["right", "d", "space", "enter"], () => {
        k.play("sfx_click", { volume: 0.6 });
        if (currentSlide < 4) {
            currentSlide++;
            updateSlide();
        } else {
            k.go("game");
        }
    });

    // Retroceder: Seta Esquerda, A
    k.onKeyPress(["left", "a"], () => {
        k.play("sfx_click", { volume: 0.6 });
        if (currentSlide > 1) {
            currentSlide--;
            updateSlide();
        } else {
            k.go("menu");
        }
    });

    // Pular cutscene: Escape
    k.onKeyPress("escape", () => {
        k.play("sfx_click", { volume: 0.6 });
        k.go("game");
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
    let currentInstrPage = 0;
    const instrSprites = ["bg_instrucoes_1", "bg_instrucoes_2"];

    const bgInstr = k.add([
        k.sprite(instrSprites[0]),
        k.pos(0, 0),
        k.scale(k.width() / 3840, k.height() / 2160),
        k.z(0)
    ]);

    // Botão Anterior
    const btnAnterior = createStandardButton("Anterior", k.vec2(k.width() / 2 - 220, k.height() - 80), () => {
        if (currentInstrPage > 0) {
            currentInstrPage--;
            bgInstr.use(k.sprite(instrSprites[currentInstrPage]));
            updateBtnStates();
        }
    }, 100, 200, 54, 30);

    // Botão Voltar
    createStandardButton("Voltar", k.vec2(k.width() / 2, k.height() - 80), () => k.go("menu"), 100, 200, 54, 30);

    // Botão Próximo
    const btnProximo = createStandardButton("Próximo", k.vec2(k.width() / 2 + 220, k.height() - 80), () => {
        if (currentInstrPage < instrSprites.length - 1) {
            currentInstrPage++;
            bgInstr.use(k.sprite(instrSprites[currentInstrPage]));
            updateBtnStates();
        }
    }, 100, 200, 54, 30);

    const updateBtnStates = () => {
        (btnAnterior as any).setDisabled(currentInstrPage === 0);
        (btnProximo as any).setDisabled(currentInstrPage === instrSprites.length - 1);
    };
    updateBtnStates();
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
k.scene("gameover", ({ win, entregasFeitas, entregasPerdidas, tempoDecorridoReal }: { win: boolean, reason?: string, entregasFeitas?: number, entregasPerdidas?: number, tempoDecorridoReal?: number }) => {
    // ---- JINGLE DE VITÓRIA OU DERROTA ----
    stopBGM();
    k.play(win ? "jingle_vitoria" : "jingle_derrota", { loop: false, volume: 0.8 });

    k.add([
        k.sprite(win ? "bg_vitoria" : "bg_derrota"),
        k.pos(0, 0),
        k.scale(k.width() / 1280, k.height() / 720),
        k.z(0)
    ]);

    if (!win) {
        // 1. TÍTULO "FIM DA LINHA!" NO TOPO
        k.add([
            k.text("FIM DA LINHA!", { size: 38, font: "Fredoka" }),
            k.pos(k.width() / 2, 45),
            k.anchor("center"),
            k.color(255, 255, 255), // Branco
            k.outline(5, k.rgb(0, 0, 0)), // Outline preto de 5px
            k.z(2)
        ]);

        // 2. ESTATÍSTICAS (Entregas e Pacotes) - Na faixa marrom inferior
        k.add([
            k.text(`Você concluiu ${entregasFeitas || 0} de 7 entregas.`, { size: 20, font: "Fredoka", align: "center" }),
            k.pos(k.width() / 2, k.height() - 150),
            k.anchor("center"),
            k.color(255, 255, 255),
            k.outline(3, k.rgb(0, 0, 0)),
            k.z(2)
        ]);

        k.add([
            k.text(`Pacotes perdidos: ${entregasPerdidas || 0}`, { size: 20, font: "Fredoka", align: "center" }),
            k.pos(k.width() / 2, k.height() - 120),
            k.anchor("center"),
            k.color(255, 255, 255),
            k.outline(3, k.rgb(0, 0, 0)),
            k.z(2)
        ]);

        // 3. BOTÕES (lado a lado) - y: height - 60, largura 260px (mínimo 250px), altura 50px, fonte 28
        createStandardButton("Tentar Novamente", k.vec2(k.width() / 2 - 140, k.height() - 60), () => k.go("game"), 5, 260, 50, 28);
        createStandardButton("Pedir Demissão", k.vec2(k.width() / 2 + 140, k.height() - 60), () => k.go("menu"), 5, 260, 50, 28);

        // Atalho rápido opcional pelo teclado
        k.onKeyPress(["space", "r"], () => k.go("game"));
    } else {
        // 1. TÍTULO "ENTREGA CONCLUÍDA!" NO TOPO
        k.add([
            k.text("ENTREGA CONCLUÍDA!", { size: 38, font: "Fredoka" }),
            k.pos(k.width() / 2, 45),
            k.anchor("center"),
            k.color(255, 215, 80), // Amarelo-ouro
            k.outline(5, k.rgb(80, 40, 10)), // Outline marrom escuro de 5px
            k.z(2)
        ]);

        // 2. ESTATÍSTICAS (Linha única compacta) - y: height - 148
        const tempoGasto = Math.max(0, Math.round(tempoDecorridoReal || 0));
        k.add([
            k.text(`Entregas: ${entregasFeitas || 0} de 7  ·  Tempo: ${tempoGasto}s`, { size: 20, font: "Fredoka", align: "center" }),
            k.pos(k.width() / 2, k.height() - 148),
            k.anchor("center"),
            k.color(255, 255, 255),
            k.outline(3, k.rgb(0, 0, 0)),
            k.z(2)
        ]);

        // 3. ESTRELAS DE AVALIAÇÃO (5 estrelas) - y: height - 118
        let stars = 1;
        const e = entregasFeitas || 0;
        const tempoReal = tempoDecorridoReal || 0;
        if (e >= 1 && e <= 3) stars = 1;
        else if (e >= 4 && e <= 5) stars = 2;
        else if (e === 6) stars = 3;
        else if (e === 7) {
            if (tempoReal < 50) stars = 5;
            else stars = 4;
        }

        const starSize = 28;
        const starSpacing = 32;
        const startX = k.width() / 2 - 2 * starSpacing;
        const starY = k.height() - 118;
        for (let i = 0; i < 5; i++) {
            const isFilled = i < stars;
            k.add([
                k.text(isFilled ? "★" : "☆", { size: starSize, font: "Fredoka" }),
                k.pos(startX + i * starSpacing, starY),
                k.anchor("center"),
                k.color(isFilled ? k.rgb(255, 215, 80) : k.rgb(100, 80, 60)),
                k.z(2)
            ]);
        }

        // 4. FRASE DE FEEDBACK - y: height - 88
        let feedbackText = "";
        if (stars === 1) feedbackText = "Pelo menos a bebê chegou inteira...";
        else if (stars === 2) feedbackText = "Deu pro gasto. Mas o chefe não ficou feliz.";
        else if (stars === 3) feedbackText = "Bom trabalho, carteira!";
        else if (stars === 4) feedbackText = "Impressionante! Nenhum pacote ficou pra trás.";
        else if (stars === 5) feedbackText = "Cegonha profissional! Entrega perfeita!";

        k.add([
            k.text(feedbackText, { size: 16, font: "Fredoka", align: "center" }),
            k.pos(k.width() / 2, k.height() - 88),
            k.anchor("center"),
            k.color(255, 255, 255),
            k.outline(2, k.rgb(0, 0, 0)),
            k.z(2)
        ]);

        // 5. BOTÕES (lado a lado) - y: height - 45, largura 280px, altura 50px, fonte 28, gap de 20px
        createStandardButton("Jogar Novamente", k.vec2(k.width() / 2 - 150, k.height() - 45), () => k.go("cutscene"), 5, 280, 50, 28);
        createStandardButton("Menu Principal", k.vec2(k.width() / 2 + 150, k.height() - 45), () => k.go("menu"), 5, 280, 50, 28);

        // Atalho rápido opcional pelo teclado
        k.onKeyPress(["space", "r"], () => k.go("cutscene"));
    }
});
