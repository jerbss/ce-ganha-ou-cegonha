import kaplay from "kaplay";

const k = kaplay({
    width: 1280,
    height: 720,
    letterbox: true,
    background: [20, 20, 20],
});

k.scene("menu", () => {
    // Titulo do jogo
    k.add([
        k.text("Cê Ganha ou Cegonha", { size: 64, font: "monospace" }),
        k.pos(k.width() / 2, k.height() / 3),
        k.anchor("center"),
        k.color(255, 200, 50),
    ]);

    // Subtitulo
    k.add([
        k.text("(Aguardando novo Game Design)", { size: 24, font: "monospace" }),
        k.pos(k.width() / 2, k.height() / 3 + 60),
        k.anchor("center"),
        k.color(150, 150, 150),
    ]);

    // Função auxiliar para criar botões do menu
    function addButton(txt: string, p: any, action: () => void) {
        const btn = k.add([
            k.rect(240, 60, { radius: 8 }),
            k.pos(p),
            k.anchor("center"),
            k.color(255, 255, 255),
            k.area(),
            k.scale(1),
        ]);

        btn.add([
            k.text(txt, { size: 24, font: "monospace" }),
            k.anchor("center"),
            k.color(0, 0, 0),
        ]);

        btn.onHoverUpdate(() => {
            btn.scale = k.vec2(1.1);
            k.setCursor("pointer");
        });

        btn.onHoverEnd(() => {
            btn.scale = k.vec2(1);
            k.setCursor("default");
        });

        btn.onClick(action);

        return btn;
    }

    // Adicionando os botões (apenas placeholders)
    addButton("Iniciar Jogo", k.vec2(k.width() / 2, k.height() / 2 + 60), () => {
        k.debug.log("Novo gameplay em breve!");
    });

    addButton("Opções", k.vec2(k.width() / 2, k.height() / 2 + 140), () => {
        k.debug.log("Tela de opções (desabilitada)");
    });
});

k.go("menu");
