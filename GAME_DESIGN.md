# Game Design Document (GDD): Cê Ganha ou Cegonha

Este documento traduz a lore e o conceito narrativo em sistemas programáveis, regras de gameplay e estrutura inicial (Greyboxing).

## 1. Especificações Técnicas
* **Motor Gráfico (Engine):** KAPLAY (sucessor do Kaboom.js). Focado em prototipagem rápida orientada a código.
* **Linguagem:** TypeScript (para manter a tipagem forte e organização do projeto).
* **Bundle:** Vite (pela velocidade e HMR).
* **Escopo Inicial:** 2D. Desenvolvimento focado no *Code-first* através de primitivos gráficos (blocos e retângulos - *greyboxing*) antes de injetar as artes finais.

## 2. Perspectiva e Movimentação (Game View)
* **Visão:** Perfil com Profundidade (Estilo *Beat 'em Up* / *Streets of Rage*).
* **Como funciona em tela:** A câmera se move em "side-scroller" contínuo para refletir o deslocamento até o alvo. O Entregador (Moto) é visto de lado, mas a "pista" tem profundidade (Eixo Z simulado no Y da tela).
* **Controles Base:** 
  * Cima/Baixo: Alterna as faixas da pista (esquiva).
  * Esquerda/Direita: Freia ou Acelera o deslocamento horizontal (risco/recompensa de colisão).

## 3. Core Loop (Loop Principal de Gameplay)
O jogo é um gerenciamento constante do CAOS. O jogador não combate inimigos; ele gerencia DUAS FRONTEIRAS DE PRESSÃO ativas enquanto conduz a moto.
1. **Desviar dos perigos:** Evitar os buracos da metrópole, remendos asfálticos e poças de água.
2. **Lidar com a Interface (App):** Resolver *popups* que bloqueiam a visão e aumentam a ansiedade.
3. **Equilibrar duas Barras de Vida (O Dilema):**
   * *O Cronômetro do App:* Corre rápido. Obriga o jogador a "acelerar".
   * *O Choro do Bebê:* Sobe a cada batida dura nos buracos e movimentos bruscos. Obriga o jogador a "ir devagar".

## 4. Mecânicas Primárias (Para Programação no KAPLAY)

### A. Sistema de Tensão do Pacote (O Bebê)
Não teremos barra de vida convencional. Teremos um **Nível de Desespero (Choro)**.
* **Impactos secos** (troca de faixa repentina, bater em buracos fundos) aumentam consideravelmente o nível de choro.
* Se a barra explodir (O bebê berra descontrolcontrolavelmente e choca a criança), toma "Game Over" (Falha Ética).
* Acelerar muito deixa controles derrapantes; ir mais devagar estabiliza o nível da criança.

### B. Sistema Opressor (HUD = Inimigo)
O HUD não é só informativo, é uma mecânica de ameaça.
* Eventos aleatórios pipocam na tela num display de "celular". Ex: *"Confirme sua foto"*, *"Aviso de Rota Atrasada"*.
* Esses pop-ups **cobrem a rua** fisicamente na tela. 
* O jogador precisa tirar a mão da direção momentaneamente ou clicar interativamente para fechar o popup se quiser voltar a enxergar perfeitamente os próprios buracos à frente. 

### C. A Física da Tempestade (Transição de Cenário)
A partir do meio do jogo (quando a mãe sai desesperada no background literário), desaba a chuva na pista.
* **Alteração Técnica (Física e Controles):** O atributo de atrito (friction) lateral do componente KAPLAY muda. Quando a pista estiver molhada, as respostas dos eixos encurtam e arrastam (Aquaplanagem). Obriga o jogador a calcular o tempo das esquivas com bastante antecedência, redobrando a chance de bater.
* **O Bate-Boca do Condomínio (Boss Fight Simbólico):** Um evento interativo onde a moto para, e em vez de andar, o jogador precisa "clicar" rápido nas respostas certas da HUD do App e bater na porta / buzina (usando as ações) no tempo correto para esgotar a "paciência" do cliente Engravatado, consumindo timer brutal do App. 

## 5. Próximos Passos (Plano de Greybox)
O programador deve começar focando em isolar a mecânica de trânsito.
1. Gerar o boilerplate Kaplay + Vite.
2. Adicionar o Sprite/Retângulo do Player capaz de navegar em 3 faixas.
3. Fazer o fundo se movimentar, gerando "caixas de buraco" dinamicamente vindo da direita para a esquerda.
4. Implementar colisão básica: bater no buraco aciona um "Shake" na câmera e infla a barra vermelha do Bebê.