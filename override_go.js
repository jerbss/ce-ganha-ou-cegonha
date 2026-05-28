const fs = require('fs');
let c = fs.readFileSync('src/main.ts', 'utf-8');

const newGO = `// ---- CENA DE GAME OVER / VITÓRIA ----
k.scene("gameover", ({ win, reason }: { win: boolean, reason: string }) => {
    
    k.add([
        k.sprite(win ? "bg_vitoria" : "bg_derrota"),
        k.pos(0,0),
        k.z(0)
    ]);

    // Texto de Motivo + Reiniciar flutuando
    const restartText = k.add([
        k.text(reason + "\\n\\nPressione ESPAÇO ou R para focar e voltar ao menu", { size: 28, font: "Fredoka", align: "center" }),
        k.pos(k.width() / 2, k.height() - 90),
        k.anchor("center"),
        k.color(255, 255, 255),
        k.opacity(1),
        k.outline(3, k.rgb(0, 0, 0)),
        k.z(2)
    ]);

    restartText.onUpdate(() => {
        restartText.opacity = Math.floor(k.time() * 3) % 2 === 0 ? 1 : 0.4;
    });

    k.onKeyPress(["r", "space"], () => k.go("menu"));
});`;

const parts = c.split('// ---- CENA DE GAME OVER');
if(parts.length > 1) {
    fs.writeFileSync('src/main.ts', parts[0] + newGO);
}
