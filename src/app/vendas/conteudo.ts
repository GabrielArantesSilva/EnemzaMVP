// HTML bruto (não JSX) pra preservar fidelidade 1:1 ao design entregue pelo dev.
export function criarConteudoHtml(urlCheckout: string | undefined): string {
  const hrefCompra = urlCheckout ?? "#preco";

  return `
<nav>
  <div class="wrap nav-inner">
    <div class="logo">Enem<span>za</span></div>
    <div style="display:flex;align-items:center;gap:18px;">
      <a href="/login" style="color:var(--cinza);font-weight:700;font-size:0.9rem;text-decoration:none;">Já tenho acesso</a>
      <a href="#preco" class="nav-cta">Começar agora</a>
    </div>
  </div>
</nav>

<header class="hero">
  <div class="hero-glow"></div>
  <div class="wrap">
    <div class="eyebrow"><span class="dot"></span> Vagas limitadas pro acesso antecipado</div>
    <h1>Pare de estudar no caos.<br><span class="hl">Organize seu ENEM.</span></h1>
    <p class="sub">Um app que reúne as melhores videoaulas do YouTube, organizadas por matéria e por módulo — do jeito que o ENEM cobra. Você abre e já sabe o que estudar.</p>
    <a href="#preco" class="cta">Quero organizar meus estudos →</a>

    <div class="video-hero">
      <div class="play-btn">
        <svg width="24" height="28" viewBox="0 0 24 28" fill="none"><path d="M22 12.27a2 2 0 0 1 0 3.46L3 26.66A2 2 0 0 1 0 24.93V3.07a2 2 0 0 1 3-1.73l19 10.93z" fill="#412402"/></svg>
      </div>
      <span class="vh-label">Espaço reservado pro vídeo de apresentação</span>
    </div>
  </div>
</header>

<section class="block dor">
  <div class="wrap dor-grid">
    <div>
      <div class="sec-eyebrow">O problema</div>
      <h2>Conteúdo bom não falta. Organização, sim.</h2>
      <p class="lead">Você abre o YouTube pra estudar e some numa avalanche de vídeos. Qual assistir primeiro? Já vi esse assunto? Faltou alguma matéria? No fim, você gasta mais tempo procurando do que estudando.</p>
    </div>
    <div class="chaos">
      <div class="chaos-item"><span class="x">✕</span> 14 abas abertas de matérias diferentes</div>
      <div class="chaos-item faded"><span class="x">✕</span> "Depois eu vejo isso" (nunca vê)</div>
      <div class="chaos-item"><span class="x">✕</span> Sem saber se já cobriu tudo que cai</div>
      <div class="chaos-item faded"><span class="x">✕</span> Anotação perdida em 3 cadernos</div>
      <div class="chaos-item faded2"><span class="x">✕</span> Zero noção de progresso</div>
    </div>
  </div>
</section>

<section class="block" id="como-funciona">
  <div class="wrap">
    <div class="sec-eyebrow">A solução</div>
    <h2>O Enemza põe seus estudos no trilho</h2>
    <p class="lead">Tudo que você precisa pra estudar de forma organizada, num lugar só. Sem caos, sem perder tempo, sem deixar matéria pra trás.</p>

    <div class="feat-grid">
      <div class="feat">
        <div class="feat-icon i-azul"><svg class="ic" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
        <h3>Aulas organizadas</h3>
        <p>As 11 matérias que caem no ENEM, com videoaulas selecionadas e separadas por módulo.</p>
      </div>
      <div class="feat">
        <div class="feat-icon i-roxo"><svg class="ic" viewBox="0 0 24 24"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg></div>
        <h3>Trilha por módulo</h3>
        <p>Uma ordem que faz sentido pra você seguir, do começo ao fim, sem estudar no escuro.</p>
      </div>
      <div class="feat">
        <div class="feat-icon i-verde"><svg class="ic" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div>
        <h3>Provinha de fixação</h3>
        <p>Ao fim de cada módulo, teste se você realmente aprendeu antes de seguir em frente.</p>
      </div>
      <div class="feat">
        <div class="feat-icon i-laranja"><svg class="ic" viewBox="0 0 24 24"><path d="M12 2c1 3.5 4 5 4 9a4 4 0 0 1-8 0c0-1.5.5-2.5 1-3.5C9.5 9 10 11 11 11c.7 0 1-1.5-.5-3.5C13 5 12 3 12 2z"/></svg></div>
        <h3>Progresso e XP</h3>
        <p>Acompanhe o quanto já avançou e ganhe aquela sensação de conquista a cada módulo.</p>
      </div>
      <div class="feat">
        <div class="feat-icon i-amarelo"><svg class="ic" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg></div>
        <h3>Suas anotações</h3>
        <p>Anote o que importa direto no app e revise tudo, organizado por matéria, antes da prova.</p>
      </div>
      <div class="feat">
        <div class="feat-icon i-azul"><svg class="ic" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2.5"/><line x1="10" y1="18" x2="14" y2="18"/></svg></div>
        <h3>Estude de qualquer lugar</h3>
        <p>Funciona no celular como um app. Abra e continue de onde parou, na hora que der.</p>
      </div>
    </div>
  </div>
</section>

<section class="block mockups">
  <div class="wrap" style="text-align:center;">
    <div class="sec-eyebrow">Por dentro do app</div>
    <h2>Feito pra ser simples de usar</h2>
    <p class="lead" style="margin:0 auto;">Uma interface leve e direta. Você entra, escolhe a matéria e começa a estudar.</p>

    <div class="phone-row">
      <div>
        <div class="phone"><div class="phone-screen">
          <div class="app-top"><span class="app-logo">Enemza</span><span class="xp-pill"><svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> 1.240 xp</span></div>
          <div class="app-card"><div><small>Nível atual</small><b>Nível 4</b></div><div style="text-align:right;"><small>Módulos</small><b>4 / 11</b></div></div>
          <div class="mod-item"><div class="mod-ic" style="background:var(--azul-fundo);"></div><div class="mod-body"><div class="mrow"><span class="mname">Matemática</span><span class="mcount">8/12</span></div><div class="bar"><span style="background:var(--azul);width:66%;"></span></div></div></div>
          <div class="mod-item"><div class="mod-ic" style="background:var(--roxo-fundo);"></div><div class="mod-body"><div class="mrow"><span class="mname">Português</span><span class="mcount">10/10</span></div><div class="bar"><span style="background:var(--roxo);width:100%;"></span></div></div></div>
          <div class="mod-item"><div class="mod-ic" style="background:var(--verde-fundo);"></div><div class="mod-body"><div class="mrow"><span class="mname">Biologia</span><span class="mcount">3/9</span></div><div class="bar"><span style="background:var(--verde);width:33%;"></span></div></div></div>
          <div class="mod-item"><div class="mod-ic" style="background:var(--laranja-fundo);"></div><div class="mod-body"><div class="mrow"><span class="mname">História</span><span class="mcount">0/8</span></div><div class="bar"><span style="background:var(--laranja);width:3%;"></span></div></div></div>
          <div class="app-nav"><div class="navi on"><svg viewBox="0 0 24 24"><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>Início</div><div class="navi"><svg viewBox="0 0 24 24"><path d="M4 4h13a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H4z"/><line x1="8" y1="8" x2="14" y2="8"/><line x1="8" y1="12" x2="14" y2="12"/></svg>Anotações</div><div class="navi"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>Perfil</div></div>
        </div></div>
        <div class="phone-label">Tela inicial</div>
      </div>

      <div>
        <div class="phone"><div class="phone-screen">
          <div class="app-top"><span class="app-logo">Anotações</span></div>
          <div class="note-search"><svg viewBox="0 0 24 24" style="width:11px;height:11px;fill:none;stroke:var(--cinza-2);stroke-width:2;stroke-linecap:round;"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16" y2="16"/></svg> Buscar por palavra-chave</div>
          <div class="chips"><span class="chip on">Todas</span><span class="chip off">Matemática</span><span class="chip off">Português</span></div>
          <div class="note"><div class="ntitle">Funções quadráticas</div><div class="ntext">O vértice da parábola dá o ponto de máximo ou mínimo, depende do sinal de a...</div><div class="nlink" style="color:var(--azul);"><svg viewBox="0 0 24 24" style="width:11px;height:11px;fill:none;stroke:var(--azul);stroke-width:2;stroke-linecap:round;"><rect x="2" y="4" width="15" height="16" rx="2"/><path d="M17 9l5-3v12l-5-3"/></svg> Aula: Funções do 2º grau</div></div>
          <div class="note"><div class="ntitle">Resumo do módulo</div><div class="ntext">Revisar probabilidade antes da prova, é meu ponto mais fraco...</div></div>
          <div class="note"><div class="ntitle">Figuras de linguagem</div><div class="ntext">Metonímia sempre confunde com metáfora, revisar exemplos...</div><div class="nlink" style="color:var(--roxo);"><svg viewBox="0 0 24 24" style="width:11px;height:11px;fill:none;stroke:var(--roxo);stroke-width:2;stroke-linecap:round;"><rect x="2" y="4" width="15" height="16" rx="2"/><path d="M17 9l5-3v12l-5-3"/></svg> Aula: Figuras de linguagem</div></div>
          <div class="app-nav"><div class="navi"><svg viewBox="0 0 24 24"><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>Início</div><div class="navi on"><svg viewBox="0 0 24 24"><path d="M4 4h13a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H4z"/><line x1="8" y1="8" x2="14" y2="8"/><line x1="8" y1="12" x2="14" y2="12"/></svg>Anotações</div><div class="navi"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>Perfil</div></div>
        </div></div>
        <div class="phone-label">Anotações</div>
      </div>

      <div>
        <div class="phone"><div class="phone-screen">
          <div class="app-top"><span class="app-logo">Perfil</span></div>
          <div class="prof-av">GS</div>
          <div class="prof-name">Gabriel</div>
          <div class="prof-since">Estudando desde março</div>
          <div class="prof-stats"><div class="prof-stat"><svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg><b>1.240</b><small>xp total</small></div><div class="prof-stat"><svg viewBox="0 0 24 24"><polygon points="12 2 15 9 22 9.5 17 14.5 18.5 21.5 12 17.5 5.5 21.5 7 14.5 2 9.5 9 9 12 2"/></svg><b>Nível 4</b><small>4 módulos</small></div></div>
          <div class="prof-xp-row"><div class="pic" style="background:var(--azul-fundo);"></div><span class="pname">Matemática</span><div class="bar" style="flex:1;"><span style="background:var(--azul);width:80%;"></span></div><span class="pval">320xp</span></div>
          <div class="prof-xp-row"><div class="pic" style="background:var(--roxo-fundo);"></div><span class="pname">Português</span><div class="bar" style="flex:1;"><span style="background:var(--roxo);width:100%;"></span></div><span class="pval">400xp</span></div>
          <div class="prof-xp-row"><div class="pic" style="background:var(--verde-fundo);"></div><span class="pname">Biologia</span><div class="bar" style="flex:1;"><span style="background:var(--verde);width:30%;"></span></div><span class="pval">120xp</span></div>
          <div class="prof-xp-row"><div class="pic" style="background:var(--laranja-fundo);"></div><span class="pname">História</span><div class="bar" style="flex:1;"><span style="background:var(--laranja);width:4%;"></span></div><span class="pval">10xp</span></div>
          <div class="app-nav" style="margin-top:16px;"><div class="navi"><svg viewBox="0 0 24 24"><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>Início</div><div class="navi"><svg viewBox="0 0 24 24"><path d="M4 4h13a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H4z"/><line x1="8" y1="8" x2="14" y2="8"/><line x1="8" y1="12" x2="14" y2="12"/></svg>Anotações</div><div class="navi on"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>Perfil</div></div>
        </div></div>
        <div class="phone-label">Perfil e progresso</div>
      </div>
    </div>
  </div>
</section>

<section class="block" id="preco">
  <div class="wrap" style="text-align:center;">
    <div class="sec-eyebrow">Acesso</div>
    <h2>Um preço, seis meses, zero enrolação</h2>
    <p class="lead" style="margin:0 auto;">Pagamento único. Sem mensalidade, sem cobrança recorrente, sem surpresa na fatura.</p>

    <div class="price-card">
      <div class="price-badge"><svg viewBox="0 0 24 24" style="width:12px;height:12px;fill:none;stroke:var(--amarelo-texto);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;vertical-align:-1px;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Acesso antecipado</div>
      <div class="price-per">Acesso completo por 6 meses</div>
      <div class="price-value">R$50</div>
      <div class="price-equiv">menos de R$8,50 por mês</div>
      <ul class="price-list">
        <li><span class="ck">✓</span> Todas as 11 matérias do ENEM, organizadas por módulo</li>
        <li><span class="ck">✓</span> Videoaulas selecionadas + provinha de fixação por módulo</li>
        <li><span class="ck">✓</span> Sistema de progresso, XP e nível</li>
        <li><span class="ck">✓</span> Área de anotações com busca por matéria</li>
        <li><span class="ck">✓</span> 6 meses de acesso a partir da compra</li>
      </ul>
      <a href="${hrefCompra}" class="cta" style="width:100%;">Garantir meu acesso →</a>
      <p class="price-note">Pagamento único de R$50 · Acesso por 6 meses · Não é assinatura recorrente</p>
    </div>
  </div>
</section>

<section class="block" style="background:var(--noite-2); border-top:1px solid var(--borda); border-bottom:1px solid var(--borda);">
  <div class="wrap" style="text-align:center;">
    <div class="sec-eyebrow">Dúvidas</div>
    <h2>Perguntas frequentes</h2>
    <div class="faq-list" style="text-align:left;">
      <details class="faq"><summary>É cobrança mensal? <span class="q-ic">+</span></summary><p>Não. É um pagamento único de R$50 que libera 6 meses de acesso completo. Não há renovação automática nem cobrança recorrente no seu cartão.</p></details>
      <details class="faq"><summary>De onde vêm as videoaulas? <span class="q-ic">+</span></summary><p>São aulas de canais educativos renomados do YouTube, selecionadas e organizadas por matéria e módulo pra você não perder tempo procurando o que estudar.</p></details>
      <details class="faq"><summary>Preciso baixar algum aplicativo? <span class="q-ic">+</span></summary><p>Não precisa baixar da loja. O Enemza funciona direto no navegador do celular como um app — você pode adicionar à tela inicial e usar como qualquer outro aplicativo.</p></details>
      <details class="faq"><summary>O que acontece quando os 6 meses acabam? <span class="q-ic">+</span></summary><p>O acesso expira ao fim dos 6 meses. Se quiser continuar, basta adquirir o acesso novamente — sem nenhuma cobrança automática antes disso.</p></details>
      <details class="faq"><summary>Serve pra qualquer ano do ENEM? <span class="q-ic">+</span></summary><p>O conteúdo cobre as matérias que caem no ENEM. As aulas são organizadas pelas áreas de conhecimento cobradas na prova.</p></details>
    </div>
  </div>
</section>

<section class="final">
  <div class="final-glow"></div>
  <div class="wrap">
    <h2>Vai por mim: sua nota agradece.</h2>
    <p>Comece a estudar de forma organizada hoje mesmo.</p>
    <a href="${hrefCompra}" class="cta">Garantir meu acesso por R$50 →</a>
  </div>
</section>

<footer>
  <div class="wrap">
    <div class="logo">Enem<span style="color:var(--amarelo);">za</span></div>
    <p>Enemza · Organize seus estudos pro ENEM</p>
  </div>
</footer>
`;
}
