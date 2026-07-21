// Fontes usam as variáveis já carregadas via next/font no RootLayout — sem <link> duplicado do Google Fonts.
export const ESTILO_CSS = `
  .vendas-root {
    --noite: #111110;
    --noite-2: #1C1C1A;
    --noite-3: #2A2A27;
    --borda: #2E2E2B;
    --creme: #F1EFE8;
    --cinza: #B4B2A9;
    --cinza-2: #888780;
    --amarelo: #FAC775;
    --amarelo-forte: #F5B944;
    --amarelo-texto: #412402;
    --azul: #378ADD;
    --azul-fundo: #0C447C;
    --roxo: #7F77DD;
    --roxo-fundo: #3C3489;
    --verde: #97C459;
    --verde-fundo: #639922;
    --laranja: #F0997B;
    --laranja-fundo: #D85A30;
    --display: var(--font-display-app), cursive;
    --body: var(--font-sans-app), sans-serif;

    background: var(--noite);
    color: var(--creme);
    font-family: var(--body);
    line-height: 1.6;
    overflow-x: hidden;
  }

  .vendas-root * { margin: 0; padding: 0; box-sizing: border-box; }

  .vendas-root svg.ic { fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

  .vendas-root .wrap { max-width: 1080px; margin: 0 auto; padding: 0 20px; }

  .vendas-root h1, .vendas-root h2, .vendas-root h3 { font-family: var(--display); line-height: 1.1; font-weight: 700; }

  .vendas-root .cta {
    display: inline-block;
    background: var(--amarelo);
    color: var(--amarelo-texto);
    font-family: var(--display);
    font-weight: 700;
    font-size: 1.05rem;
    padding: 16px 32px;
    border-radius: 16px;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    box-shadow: 0 4px 0 var(--amarelo-forte);
  }
  .vendas-root .cta:hover { transform: translateY(-2px); box-shadow: 0 6px 0 var(--amarelo-forte); }
  .vendas-root .cta:active { transform: translateY(2px); box-shadow: 0 2px 0 var(--amarelo-forte); }

  /* ===== NAV ===== */
  .vendas-root nav {
    position: sticky; top: 0; z-index: 50;
    background: rgba(17,17,16,0.85);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--borda);
  }
  .vendas-root .nav-inner { display: flex; align-items: center; justify-content: space-between; height: 64px; }
  .vendas-root .logo { font-family: var(--display); font-weight: 800; font-size: 1.4rem; color: var(--creme); letter-spacing: -0.5px; }
  .vendas-root .logo span { color: var(--amarelo); }
  .vendas-root .nav-cta {
    background: var(--amarelo); color: var(--amarelo-texto);
    font-family: var(--display); font-weight: 600; font-size: 0.9rem;
    padding: 9px 20px; border-radius: 12px; text-decoration: none;
    transition: transform 0.15s ease;
  }
  .vendas-root .nav-cta:hover { transform: translateY(-1px); }

  /* ===== HERO ===== */
  .vendas-root .hero { padding: 72px 0 56px; text-align: center; position: relative; }
  .vendas-root .hero-glow {
    position: absolute; top: -100px; left: 50%; transform: translateX(-50%);
    width: 600px; height: 400px; pointer-events: none;
    background: radial-gradient(ellipse, rgba(250,199,117,0.14), transparent 70%);
    filter: blur(20px);
  }
  .vendas-root .eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--noite-2); border: 1px solid var(--borda);
    color: var(--amarelo); font-weight: 700; font-size: 0.85rem;
    padding: 7px 16px; border-radius: 100px; margin-bottom: 24px;
  }
  .vendas-root .eyebrow .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--amarelo); box-shadow: 0 0 8px var(--amarelo); }
  .vendas-root .hero h1 { font-size: clamp(2.2rem, 6vw, 3.8rem); font-weight: 800; margin-bottom: 20px; letter-spacing: -1px; }
  .vendas-root .hero h1 .hl { color: var(--amarelo); position: relative; white-space: nowrap; }
  .vendas-root .hero p.sub { font-size: clamp(1.05rem, 2.5vw, 1.35rem); color: var(--cinza); max-width: 620px; margin: 0 auto 36px; }

  .vendas-root .video-hero {
    max-width: 720px; margin: 44px auto 0;
    aspect-ratio: 16 / 9;
    background: var(--noite-2);
    border: 1px solid var(--borda);
    border-radius: 24px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 14px; position: relative; overflow: hidden;
  }
  .vendas-root .video-hero::before {
    content: ""; position: absolute; inset: 0;
    background: repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(255,255,255,0.012) 12px, rgba(255,255,255,0.012) 24px);
  }
  .vendas-root .play-btn {
    width: 72px; height: 72px; border-radius: 50%;
    background: var(--amarelo); display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 0 10px rgba(250,199,117,0.12); z-index: 1;
  }
  .vendas-root .play-btn svg { margin-left: 4px; }
  .vendas-root .video-hero .vh-label { color: var(--cinza-2); font-weight: 700; font-size: 0.9rem; z-index: 1; }

  /* ===== SECTION BASE ===== */
  .vendas-root section.block { padding: 72px 0; }
  .vendas-root .sec-eyebrow { color: var(--amarelo); font-weight: 800; font-size: 0.85rem; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 12px; }
  .vendas-root .block h2 { font-size: clamp(1.8rem, 4.5vw, 2.8rem); font-weight: 800; margin-bottom: 18px; letter-spacing: -0.5px; }
  .vendas-root .block p.lead { font-size: 1.15rem; color: var(--cinza); max-width: 640px; }

  /* ===== DOR ===== */
  .vendas-root .dor { background: var(--noite-2); border-top: 1px solid var(--borda); border-bottom: 1px solid var(--borda); }
  .vendas-root .dor-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; }
  .vendas-root .chaos {
    background: var(--noite); border: 1px solid var(--borda); border-radius: 20px; padding: 24px;
    display: flex; flex-direction: column; gap: 10px;
  }
  .vendas-root .chaos-item {
    display: flex; align-items: center; gap: 12px;
    background: var(--noite-2); border-radius: 10px; padding: 12px 14px;
    color: var(--cinza-2); font-size: 0.92rem;
  }
  .vendas-root .chaos-item .x { color: var(--laranja); font-weight: 800; flex-shrink: 0; }
  .vendas-root .chaos-item.faded { opacity: 0.55; }
  .vendas-root .chaos-item.faded2 { opacity: 0.3; }

  /* ===== FEATURES ===== */
  .vendas-root .feat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 44px; }
  .vendas-root .feat {
    background: var(--noite-2); border: 1px solid var(--borda); border-radius: 20px; padding: 26px;
    transition: transform 0.2s ease, border-color 0.2s ease;
  }
  .vendas-root .feat:hover { transform: translateY(-4px); }
  .vendas-root .feat-icon {
    width: 48px; height: 48px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center; margin-bottom: 16px;
  }
  .vendas-root .feat-icon svg { width: 24px; height: 24px; }
  .vendas-root .feat h3 { font-size: 1.15rem; font-weight: 700; margin-bottom: 8px; }
  .vendas-root .feat p { color: var(--cinza); font-size: 0.95rem; }
  .vendas-root .i-azul { background: var(--azul-fundo); }
  .vendas-root .i-azul svg { stroke: #B5D4F4; }
  .vendas-root .i-roxo { background: var(--roxo-fundo); }
  .vendas-root .i-roxo svg { stroke: #CECBF6; }
  .vendas-root .i-verde { background: var(--verde-fundo); }
  .vendas-root .i-verde svg { stroke: #D6EBBE; }
  .vendas-root .i-laranja { background: var(--laranja-fundo); }
  .vendas-root .i-laranja svg { stroke: #FAD9CD; }
  .vendas-root .i-amarelo { background: var(--amarelo); }
  .vendas-root .i-amarelo svg { stroke: var(--amarelo-texto); }

  /* ===== MOCKUPS ===== */
  .vendas-root .mockups { background: var(--noite-2); border-top: 1px solid var(--borda); border-bottom: 1px solid var(--borda); }
  .vendas-root .phone-row { display: flex; gap: 24px; justify-content: center; margin-top: 48px; flex-wrap: wrap; }
  .vendas-root .phone {
    width: 240px; flex-shrink: 0;
    background: var(--noite-3); border-radius: 28px; padding: 8px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.4);
  }
  .vendas-root .phone-screen { background: var(--noite); border-radius: 22px; overflow: hidden; min-height: 460px; display: flex; flex-direction: column; }
  .vendas-root .phone-label { text-align: center; margin-top: 16px; font-family: var(--display); font-weight: 600; color: var(--cinza); font-size: 0.95rem; }

  .vendas-root .app-top { padding: 14px 14px 10px; display: flex; align-items: center; justify-content: space-between; }
  .vendas-root .app-logo { font-family: var(--display); font-weight: 700; font-size: 0.95rem; }
  .vendas-root .xp-pill { display: flex; align-items: center; gap: 4px; background: var(--noite-3); padding: 4px 10px; border-radius: 20px; color: var(--amarelo); font-size: 0.7rem; font-weight: 700; }
  .vendas-root .xp-pill svg { width: 11px; height: 11px; fill: none; stroke: var(--amarelo); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .vendas-root .app-card { margin: 0 14px 10px; background: var(--noite-2); border-radius: 10px; padding: 10px 12px; display: flex; justify-content: space-between; align-items: center; }
  .vendas-root .app-card small { color: var(--cinza-2); font-size: 0.62rem; display: block; }
  .vendas-root .app-card b { font-family: var(--display); font-size: 0.95rem; }
  .vendas-root .mod-item { margin: 0 14px 8px; background: var(--noite-2); border-radius: 10px; padding: 10px 12px; display: flex; align-items: center; gap: 10px; }
  .vendas-root .mod-ic { width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0; }
  .vendas-root .mod-body { flex: 1; }
  .vendas-root .mod-body .mrow { display: flex; justify-content: space-between; margin-bottom: 5px; }
  .vendas-root .mod-body .mname { font-size: 0.78rem; font-weight: 700; }
  .vendas-root .mod-body .mcount { font-size: 0.62rem; color: var(--cinza-2); }
  .vendas-root .bar { background: rgba(255,255,255,0.1); border-radius: 6px; height: 5px; overflow: hidden; }
  .vendas-root .bar > span { display: block; height: 100%; border-radius: 6px; }
  .vendas-root .app-nav { margin-top: auto; display: flex; justify-content: space-around; padding: 10px 0; border-top: 1px solid var(--noite-3); }
  .vendas-root .app-nav .navi { display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: 0.6rem; color: var(--cinza-2); }
  .vendas-root .app-nav .navi.on { color: var(--amarelo); }
  .vendas-root .app-nav .navi svg { width: 17px; height: 17px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; display: block; margin-bottom: 1px; }

  .vendas-root .note-search { margin: 0 14px 10px; background: var(--noite-2); border-radius: 8px; padding: 7px 10px; color: var(--cinza-2); font-size: 0.68rem; display: flex; align-items: center; gap: 6px; }
  .vendas-root .chips { display: flex; gap: 5px; padding: 0 14px 10px; flex-wrap: wrap; }
  .vendas-root .chip { font-size: 0.6rem; padding: 4px 10px; border-radius: 20px; font-weight: 700; }
  .vendas-root .chip.on { background: var(--amarelo); color: var(--amarelo-texto); }
  .vendas-root .chip.off { background: var(--noite-2); color: var(--cinza-2); border: 1px solid var(--borda); }
  .vendas-root .note { margin: 0 14px 8px; background: var(--noite-2); border-radius: 10px; padding: 10px 12px; }
  .vendas-root .note .ntitle { font-size: 0.75rem; font-weight: 700; margin-bottom: 4px; }
  .vendas-root .note .ntext { font-size: 0.65rem; color: var(--cinza); line-height: 1.4; }
  .vendas-root .note .nlink { font-size: 0.62rem; margin-top: 6px; display: flex; align-items: center; gap: 4px; }

  .vendas-root .prof-av { width: 56px; height: 56px; border-radius: 50%; background: var(--noite-3); margin: 10px auto 8px; display: flex; align-items: center; justify-content: center; font-family: var(--display); font-weight: 700; color: var(--amarelo); font-size: 1.1rem; }
  .vendas-root .prof-name { text-align: center; font-family: var(--display); font-weight: 600; font-size: 0.9rem; }
  .vendas-root .prof-since { text-align: center; color: var(--cinza-2); font-size: 0.62rem; margin-bottom: 12px; }
  .vendas-root .prof-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 0 14px 12px; }
  .vendas-root .prof-stat { background: var(--noite-2); border-radius: 10px; padding: 12px; text-align: center; }
  .vendas-root .prof-stat svg { width: 18px; height: 18px; fill: none; stroke: var(--amarelo); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .vendas-root .prof-stat b { font-family: var(--display); font-size: 1rem; display: block; margin: 4px 0 2px; }
  .vendas-root .prof-stat small { color: var(--cinza-2); font-size: 0.6rem; }
  .vendas-root .prof-xp-row { display: flex; align-items: center; gap: 8px; padding: 0 14px; margin-bottom: 8px; }
  .vendas-root .prof-xp-row .pic { width: 22px; height: 22px; border-radius: 6px; flex-shrink: 0; }
  .vendas-root .prof-xp-row .pname { font-size: 0.7rem; width: 58px; }
  .vendas-root .prof-xp-row .pval { font-size: 0.62rem; color: var(--cinza-2); width: 34px; text-align: right; }

  /* ===== PREÇO ===== */
  .vendas-root .price-card {
    max-width: 480px; margin: 48px auto 0;
    background: linear-gradient(180deg, var(--noite-2), var(--noite));
    border: 2px solid var(--amarelo); border-radius: 28px;
    padding: 40px 32px; text-align: center; position: relative;
  }
  .vendas-root .price-badge {
    position: absolute; top: -14px; left: 50%; transform: translateX(-50%);
    background: var(--amarelo); color: var(--amarelo-texto);
    font-family: var(--display); font-weight: 700; font-size: 0.8rem;
    padding: 6px 18px; border-radius: 100px; white-space: nowrap;
  }
  .vendas-root .price-value { font-family: var(--display); font-weight: 800; font-size: 3.5rem; color: var(--creme); line-height: 1; margin: 8px 0; }
  .vendas-root .price-value .cents { font-size: 1.5rem; color: var(--cinza); }
  .vendas-root .price-per { color: var(--cinza); font-size: 1rem; margin-bottom: 6px; }
  .vendas-root .price-equiv { color: var(--amarelo); font-weight: 700; font-size: 0.95rem; margin-bottom: 24px; }
  .vendas-root .price-list { text-align: left; margin: 24px 0; display: flex; flex-direction: column; gap: 12px; }
  .vendas-root .price-list li { list-style: none; display: flex; align-items: flex-start; gap: 10px; color: var(--creme); font-size: 0.95rem; }
  .vendas-root .price-list .ck { color: var(--verde); font-weight: 800; flex-shrink: 0; }
  .vendas-root .price-note { color: var(--cinza-2); font-size: 0.82rem; margin-top: 16px; }

  /* ===== FAQ ===== */
  .vendas-root .faq-list { max-width: 720px; margin: 44px auto 0; display: flex; flex-direction: column; gap: 12px; }
  .vendas-root details.faq {
    background: var(--noite-2); border: 1px solid var(--borda); border-radius: 16px;
    padding: 4px 20px; transition: border-color 0.2s ease;
  }
  .vendas-root details.faq[open] { border-color: var(--amarelo); }
  .vendas-root details.faq summary {
    font-family: var(--display); font-weight: 600; font-size: 1.05rem;
    padding: 16px 0; cursor: pointer; list-style: none;
    display: flex; justify-content: space-between; align-items: center; gap: 12px;
  }
  .vendas-root details.faq summary::-webkit-details-marker { display: none; }
  .vendas-root details.faq summary .q-ic { color: var(--amarelo); font-size: 1.4rem; transition: transform 0.2s ease; flex-shrink: 0; }
  .vendas-root details.faq[open] summary .q-ic { transform: rotate(45deg); }
  .vendas-root details.faq p { color: var(--cinza); padding: 0 0 18px; font-size: 0.95rem; }

  /* ===== CTA FINAL ===== */
  .vendas-root .final { text-align: center; padding: 88px 0; position: relative; }
  .vendas-root .final-glow {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
    width: 500px; height: 300px; pointer-events: none;
    background: radial-gradient(ellipse, rgba(250,199,117,0.12), transparent 70%);
  }
  .vendas-root .final h2 { font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; margin-bottom: 16px; }
  .vendas-root .final p { color: var(--cinza); font-size: 1.2rem; margin-bottom: 32px; }

  /* ===== FOOTER ===== */
  .vendas-root footer { border-top: 1px solid var(--borda); padding: 32px 0; text-align: center; color: var(--cinza-2); font-size: 0.85rem; }
  .vendas-root footer .logo { font-size: 1.1rem; margin-bottom: 8px; display: inline-block; }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 860px) {
    .vendas-root .feat-grid { grid-template-columns: 1fr; }
    .vendas-root .dor-grid { grid-template-columns: 1fr; }
  }
`;
