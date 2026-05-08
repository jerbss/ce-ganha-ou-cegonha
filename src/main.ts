import kaplay from "kaplay";

// Inicializa o Kaplay
const k = kaplay({
    width: 1280,   // Resolução interna base (HD)
    height: 720,
    letterbox: true, // Magia: Estica o jogo para preencher a tela inteira mantendo a proporção, colocando pequenas bordas pretas apenas se a tela for muito diferente.
    background: [20, 20, 20], // Fundo escuro
});

// Adiciona um texto na tela para confirmar que deu tudo certo!
k.add([
    k.text("KAPLAY Instalado com Sucesso!", { size: 32 }),
    k.pos(k.center()),
    k.anchor("center"),
    k.color(0, 255, 0), // Texto verde
]);

// Adiciona um "jogador" de teste que pisca
const player = k.add([
    k.rect(50, 50),
    k.pos(k.center().x, k.center().y + 80),
    k.anchor("center"),
    k.color(255, 0, 0),
]);

// Loop de update para testar a renderização por frame
k.onUpdate(() => {
    // Faz o quadrado ficar girando
    player.angle += 120 * k.dt();
});
