import { useState, useEffect, useRef, useCallback } from "react";

/* ============================================================
   INJEÇÃO DE ESTILOS GLOBAIS
   ============================================================ */
const injectStyles = () => {
  if (document.getElementById("sim-styles")) return;
  const s = document.createElement("style");
  s.id = "sim-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Nunito:wght@400;600;700;800&display=swap');
    *,*::before,*::after{box-sizing:border-box;}
    :root{
      --bg:#04040f;--bg2:#080820;--card:rgba(8,8,28,0.97);--border:#1a1a40;
      --cyan:#00e5ff;--pink:#ff0080;--purple:#a855f7;--gold:#ffd700;
      --green:#00e676;--text:#e8eaf6;--muted:#7986cb;
      --err:#ff1744;--warn:#ffc107;--ok:#00e676;--code:#010115;
    }
    body{background:var(--bg);color:var(--text);font-family:'Nunito',sans-serif;overflow-x:hidden;}
    @keyframes glitch{
      0%,90%,100%{text-shadow:none;transform:none}
      91%{text-shadow:-3px 0 var(--pink),3px 0 var(--cyan);transform:skewX(-2deg)}
      93%{text-shadow:3px 0 var(--pink),-3px 0 var(--cyan);transform:skewX(2deg)}
      95%{text-shadow:-2px 0 var(--pink),2px 0 var(--cyan);transform:skewX(-1deg)}
      97%{text-shadow:none;transform:none}
    }
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulseGlow{0%,100%{box-shadow:0 0 6px var(--cyan)}50%{box-shadow:0 0 24px var(--cyan),0 0 48px rgba(0,229,255,0.3)}}
    @keyframes scan{0%{top:-4%}100%{top:104%}}
    @keyframes spinR{to{transform:rotate(360deg)}}
    @keyframes tipBar{from{width:100%}to{width:0%}}
    @keyframes ping{75%,100%{transform:scale(2);opacity:0}}
    @keyframes slideIn{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}
    .glitch-text{animation:glitch 5s infinite;font-family:'Orbitron',sans-serif;}
    .float-anim{animation:float 3.5s ease-in-out infinite;}
    .fade-up{animation:fadeUp 0.55s ease forwards;}
    .pulse-glow{animation:pulseGlow 2.5s ease-in-out infinite;}
    .slide-in{animation:slideIn 0.3s ease forwards;}
    ::-webkit-scrollbar{width:5px;height:5px;}
    ::-webkit-scrollbar-track{background:var(--bg2);}
    ::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px;}
    ::-webkit-scrollbar-thumb:hover{background:var(--cyan);}
    .code-editor{
      font-family:'Share Tech Mono',monospace!important;font-size:13px;line-height:1.65;
      tab-size:2;resize:none;outline:none;border:none;
      background:var(--code);color:#9ecef0;padding:12px;width:100%;height:100%;
    }
    .code-editor:focus{box-shadow:inset 0 0 0 1px rgba(0,229,255,0.4);}
    .nav-btn{
      padding:7px 14px;border-radius:6px;border:1px solid transparent;
      background:transparent;color:var(--muted);cursor:pointer;
      font-family:'Orbitron',sans-serif;font-size:10px;font-weight:700;
      letter-spacing:1px;text-transform:uppercase;transition:all 0.2s;
    }
    .nav-btn:hover,.nav-btn.active{color:var(--cyan);border-color:var(--cyan);background:rgba(0,229,255,0.06);}
    .btn-p{
      padding:8px 18px;background:linear-gradient(135deg,var(--cyan),#0080ff);
      color:#000;border:none;border-radius:6px;cursor:pointer;
      font-family:'Orbitron',sans-serif;font-size:10px;font-weight:700;
      letter-spacing:1px;transition:all 0.2s;white-space:nowrap;
    }
    .btn-p:hover{filter:brightness(1.2);transform:translateY(-1px);}
    .btn-p:active{transform:translateY(0);}
    .btn-s{
      padding:7px 14px;background:transparent;color:var(--cyan);
      border:1px solid var(--cyan);border-radius:6px;cursor:pointer;
      font-family:'Orbitron',sans-serif;font-size:10px;font-weight:700;
      letter-spacing:1px;transition:all 0.2s;white-space:nowrap;
    }
    .btn-s:hover{background:rgba(0,229,255,0.08);}
    .btn-s:disabled{opacity:0.35;cursor:not-allowed;}
    .glass-card{background:var(--card);border:1px solid var(--border);border-radius:12px;backdrop-filter:blur(12px);}
    .tab-btn{
      padding:8px 18px;border:none;background:transparent;color:var(--muted);
      cursor:pointer;font-family:'Nunito',sans-serif;font-weight:700;font-size:13px;
      border-bottom:2px solid transparent;transition:all 0.2s;white-space:nowrap;
    }
    .tab-btn.active{color:var(--cyan);border-bottom-color:var(--cyan);}
    .tab-btn:hover:not(.active){color:var(--text);}
    .badge{padding:3px 10px;border-radius:20px;font-size:10px;font-weight:800;letter-spacing:0.5px;}
    .badge-init{background:rgba(0,230,118,0.12);color:#00e676;border:1px solid #00e676;}
    .badge-basic{background:rgba(0,229,255,0.12);color:#00e5ff;border:1px solid #00e5ff;}
    .badge-inter{background:rgba(255,193,7,0.12);color:#ffc107;border:1px solid #ffc107;}
    .badge-adv{background:rgba(255,23,68,0.12);color:#ff1744;border:1px solid #ff1744;}
    .c-card{
      background:var(--card);border:1px solid var(--border);border-radius:14px;
      padding:22px;cursor:pointer;transition:all 0.3s;position:relative;overflow:hidden;
    }
    .c-card::before{
      content:'';position:absolute;top:0;left:0;right:0;height:3px;
      background:linear-gradient(90deg,var(--a1,#00e5ff),var(--a2,#a855f7));
    }
    .c-card:hover{transform:translateY(-5px);border-color:var(--cyan);box-shadow:0 12px 32px rgba(0,229,255,0.12);}
    .log-entry{border-radius:6px;margin:3px 0;overflow:hidden;font-family:'Share Tech Mono',monospace;font-size:12px;}
    .grid-bg{
      background-image:
        linear-gradient(rgba(0,229,255,0.025) 1px,transparent 1px),
        linear-gradient(90deg,rgba(0,229,255,0.025) 1px,transparent 1px);
      background-size:32px 32px;
    }
    .scanline{position:relative;overflow:hidden;}
    .scanline::after{
      content:'';position:absolute;left:0;right:0;height:2px;
      background:linear-gradient(transparent,rgba(0,229,255,0.04),transparent);
      animation:scan 5s linear infinite;pointer-events:none;
    }
    .tip-bar{height:4px;border-radius:2px;background:linear-gradient(90deg,var(--cyan),var(--purple));animation:tipBar 60s linear forwards;}
    .line-numbers{
      font-family:'Share Tech Mono',monospace;font-size:13px;line-height:1.65;
      color:#2a2a4a;padding:12px 6px;background:rgba(0,0,0,0.25);
      text-align:right;user-select:none;min-width:38px;
      border-right:1px solid var(--border);overflow:hidden;
    }
    .editor-wrap{position:relative;display:flex;height:100%;}
    pre{margin:0;font-family:'Share Tech Mono',monospace;white-space:pre-wrap;}
    .code-block{
      background:var(--code);border:1px solid var(--border);border-radius:8px;
      padding:14px 16px;font-size:12px;color:#9ecef0;overflow-x:auto;line-height:1.75;
    }
    input,select,textarea{font-family:'Nunito',sans-serif;}
  `;
  document.head.appendChild(s);
};

/* ============================================================
   DADOS DOS DESAFIOS
   ============================================================ */
const CHALLENGES = [
  {
    id:"EX-01",title:"Olá, Mundo Ninja!",icon:"🍃",theme:"Naruto",
    difficulty:"Iniciante",diffClass:"badge-init",color:"#ff9f1c",
    a1:"#ff9f1c",a2:"#ff6b00",xp:100,
    description:"Crie uma página de apresentação do seu ninja favorito com título, subtítulo e parágrafos. O primeiro passo de todo grande shinobi começa aqui!",
    objective:"Estrutura HTML básica: h1, h2, p, body, head",
    starter_html:`<!DOCTYPE html>
<!-- =========================================
  EX-01 | Tema: Naruto 🍃
  Objetivo: Criar estrutura HTML básica
  Aluno: aprenda sobre h1, h2, p e body!
  ========================================= -->
<html lang="pt-br">

<head>
  <!-- HEAD: informações sobre a página (não aparece na tela) -->
  <meta charset="UTF-8">
  <title>Meu Ninja Favorito</title>
</head>

<body>
  <!-- BODY: conteúdo VISÍVEL ao usuário começa aqui -->

  <!-- h1: Título principal — use APENAS 1 por página! -->
  <h1>Naruto Uzumaki</h1>

  <!-- h2: Subtítulo — pode usar vários -->
  <h2>Hokage da Aldeia da Folha 🏮</h2>

  <!-- p: Parágrafo de texto -->
  <p>
    Naruto é um ninja que nunca desiste dos seus sonhos.
    Sua técnica mais famosa é o Rasengan!
  </p>

  <!-- ✏️ DESAFIO: Adicione mais h2 e p com outras
       informações do personagem! -->

</body>

</html>`,
    starter_css:`/* =========================================
  CSS do EX-01 — Estilo Básico
  Como funciona: seletor { propriedade: valor; }
  ========================================= */

/* 'body' = elemento raiz visível da página */
body {
  background-color: #1a1a2e;    /* Cor de fundo */
  color: #eeeeee;                /* Cor do texto */
  font-family: Arial, sans-serif;/* Tipo de fonte */
  text-align: center;            /* Alinha ao centro */
  padding: 30px;                 /* Espaçamento interno */
}

/* Estilizando o h1 */
h1 {
  color: #ff9f1c;   /* Laranja — cor do Naruto! */
  font-size: 2.5em; /* 2.5× o tamanho padrão */
  margin-bottom: 4px;
}

/* Estilizando o h2 */
h2 {
  color: #a8dadc;
  font-size: 1.3em;
}

/* Estilizando parágrafos */
p {
  max-width: 400px;
  margin: 18px auto;  /* 'auto' centraliza horizontalmente */
  line-height: 1.7;   /* Espaçamento entre linhas */
  color: #ccc;
}

/* ✏️ DESAFIO: Adicione mais estilos aqui! */`,
    tips:[
      "🍃 **DICA #1 — DOCTYPE**\n\nO <!DOCTYPE html> deve ser SEMPRE a primeira linha do arquivo. Ele informa ao navegador que estamos usando HTML5.\n\nSem ele, o navegador entra em 'modo quirks' e pode renderizar tudo errado!\n\nExemplo correto:\n<!DOCTYPE html>\n<html lang='pt-br'>\n  ...\n</html>",
      "🍃 **DICA #2 — Hierarquia de Títulos**\n\nUse h1 para o título mais importante — apenas 1 por página!\nUse h2, h3, h4, h5, h6 para subtítulos em ordem de importância.\n\nNunca pule níveis!\n❌ h1 → h3 (pulou h2)\n✅ h1 → h2 → h3\n\nIsso é importante para SEO e acessibilidade!",
      "🍃 **DICA #3 — Fechar Tags**\n\nToda tag HTML aberta DEVE ser fechada!\nTag de abertura: <p>\nTag de fechamento: </p> (com barra /)\n\n✅ Correto:\n<p>Meu texto aqui</p>\n<h1>Meu Título</h1>\n\n❌ Errado:\n<p>Meu texto aqui\n<h1>Meu Título",
      "🍃 **DICA #4 — CSS Básico**\n\nNo CSS, você seleciona elementos pelo nome da tag e define propriedades:\n\nseletor {\n  propriedade: valor;\n}\n\nExemplo:\nh1 {\n  color: orange;\n  font-size: 2em;\n  text-align: center;\n}"
    ]
  },
  {
    id:"EX-02",title:"Lista de Feitiços",icon:"🧙",theme:"Harry Potter",
    difficulty:"Básico",diffClass:"badge-basic",color:"#c41e3a",
    a1:"#c41e3a",a2:"#7b68ee",xp:150,
    description:"Crie uma lista de feitiços de Hogwarts! Listas ordenadas, não-ordenadas e links mágicos. A magia da web começa aqui!",
    objective:"Tags de lista: ul, ol, li — e links: a href",
    starter_html:`<!DOCTYPE html>
<!-- =========================================
  EX-02 | Tema: Harry Potter 🧙
  Objetivo: Listas HTML e links
  ul = lista com bolinhas
  ol = lista numerada
  li = cada item da lista
  a  = link para outras páginas
  ========================================= -->
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Livro de Feitiços de Hogwarts</title>
</head>
<body>

  <h1>📚 Livro de Feitiços</h1>

  <!-- ul: Unordered List — lista COM bolinhas -->
  <h2>Feitiços Básicos</h2>
  <ul>
    <li>Lumos — Cria luz na ponta da varinha</li>
    <li>Wingardium Leviosa — Levitação</li>
    <li>Expelliarmus — Desarma o oponente</li>
  </ul>

  <!-- ol: Ordered List — lista NUMERADA -->
  <h2>Por Dificuldade</h2>
  <ol>
    <li>Lumos (Iniciante)</li>
    <li>Reparo (Médio)</li>
    <li>Expecto Patronum (Avançado)</li>
    <li>Avada Kedavra (Proibido! 🚫)</li>
  </ol>

  <!-- a: Link. href = destino. target="_blank" = nova aba -->
  <a href="https://harrypotter.com" target="_blank">
    🔗 Site Oficial de Harry Potter
  </a>

  <!-- ✏️ DESAFIO: Adicione mais feitiços nas listas! -->

</body>
</html>`,
    starter_css:`/* =========================================
  CSS do EX-02 — Listas e Links
  ========================================= */

body {
  background-color: #1a0a2e;  /* Roxo escuro de Hogwarts */
  color: #d4af37;              /* Dourado */
  font-family: Georgia, serif; /* Fonte com serifa (clássica) */
  padding: 30px;
  max-width: 600px;
  margin: 0 auto;              /* 'auto' centraliza a página */
}

h1 {
  color: #c41e3a;              /* Vermelho da Grifinória */
  text-align: center;
  border-bottom: 2px solid #d4af37;
  padding-bottom: 14px;
}

h2 { color: #7b68ee; }

/* Estilizando cada item da lista */
li {
  margin: 8px 0;
  padding: 8px 12px;
  background-color: rgba(212,175,55,0.07); /* Fundo semitransparente */
  border-left: 3px solid #d4af37;
  border-radius: 4px;
  list-style-position: inside;
}

/* Estilo base do link */
a {
  display: block;
  margin-top: 24px;
  padding: 12px;
  color: #7b68ee;
  text-decoration: none;   /* Remove o sublinhado padrão */
  text-align: center;
  border: 1px solid #7b68ee;
  border-radius: 8px;
  transition: all 0.3s;    /* Animação suave nas mudanças */
}

/* Efeito quando o mouse passa por cima */
a:hover {
  background-color: #7b68ee;
  color: #fff;
}`,
    tips:[
      "🧙 **DICA #1 — ul vs ol**\n\n<ul> (Unordered List) = lista com bullet points •\n<ol> (Ordered List) = lista com números 1, 2, 3...\n\nDentro de ambas, use <li> para cada item:\n\n<ul>\n  <li>Primeiro item</li>\n  <li>Segundo item</li>\n</ul>",
      "🧙 **DICA #2 — Links**\n\nA tag <a> cria links. O atributo href define o destino.\n\nExemplos:\n<a href='https://google.com'>Ir ao Google</a>\n<a href='outra-pagina.html'>Página interna</a>\n<a href='#'>Link que não vai a lugar nenhum</a>",
      "🧙 **DICA #3 — target='_blank'**\n\nAbre o link em uma nova aba do navegador.\nIdeal para links externos!\n\n<a href='https://google.com' target='_blank'>\n  Abrir em nova aba\n</a>\n\nDica de segurança: adicione rel='noopener' junto!",
      "🧙 **DICA #4 — Margin vs Padding**\n\nmargin = espaço FORA do elemento\npadding = espaço DENTRO do elemento\n\nImagine uma caixa de presente:\n🎁 padding = o papel bolha dentro da caixa\n📦 margin = a distância entre essa caixa e outras\n\nmargin: 10px auto; → centraliza o elemento!"
    ]
  },
  {
    id:"EX-03",title:"Galeria de Heróis",icon:"🕷️",theme:"Marvel",
    difficulty:"Intermediário",diffClass:"badge-inter",color:"#e63946",
    a1:"#e63946",a2:"#ffd700",xp:200,
    description:"Monte uma galeria de heróis com imagens e o poder do Flexbox! ATENÇÃO: toda imagem PRECISA do atributo alt. Sem ele = erro!",
    objective:"Tag img (com alt!), div, class e Flexbox",
    starter_html:`<!DOCTYPE html>
<!-- =========================================
  EX-03 | Tema: Marvel 🕷️
  Objetivo: Imagens, Divs e Flexbox
  img  = inserir imagem (SEMPRE use alt!)
  div  = container genérico
  class= identificador para o CSS
  ========================================= -->
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Galeria de Heróis Marvel</title>
</head>
<body>

  <h1>🦸 Galeria de Heróis</h1>

  <!-- div.galeria: container que agrupa os cards -->
  <!-- 'class' permite aplicar CSS com '.galeria' -->
  <div class="galeria">

    <!-- Card do Herói 1 -->
    <div class="card">
      <!-- img: imagem. src = URL/caminho. alt = OBRIGATÓRIO! -->
      <img
        src="https://placehold.co/150x150/e63946/white?text=Spider"
        alt="Homem Aranha - Herói Marvel">
      <h3>Homem-Aranha</h3>
      <p>Grandes poderes, grandes responsabilidades.</p>
    </div>

    <!-- Card do Herói 2 -->
    <div class="card">
      <img
        src="https://placehold.co/150x150/1d3557/white?text=Cap"
        alt="Capitão América - Herói Marvel">
      <h3>Capitão América</h3>
      <p>Posso fazer isso o dia todo.</p>
    </div>

    <!-- Card do Herói 3 -->
    <div class="card">
      <img
        src="https://placehold.co/150x150/2d6a4f/white?text=Hulk"
        alt="Hulk - Herói Marvel">
      <h3>Hulk</h3>
      <p>Hulk esmaga!</p>
    </div>

  </div>
  <!-- ✏️ DESAFIO: Adicione mais cards de heróis! -->

</body>
</html>`,
    starter_css:`/* =========================================
  CSS do EX-03 — Flexbox e Cards
  ========================================= */

body {
  background-color: #0d0d1a;
  color: #ffffff;
  font-family: Arial, sans-serif;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #e63946;
  text-transform: uppercase;  /* TUDO MAIÚSCULO */
  letter-spacing: 3px;
}

/* Container com FLEXBOX */
/* display:flex transforma os filhos em "flex items" */
.galeria {
  display: flex;             /* ← Ativa o Flexbox! */
  flex-wrap: wrap;           /* Quebra linha se necessário */
  gap: 20px;                 /* Espaço entre os cards */
  justify-content: center;   /* Centraliza horizontalmente */
  margin-top: 30px;
}

/* Card individual */
.card {
  background-color: #1a1a2e;
  border: 2px solid #e63946;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  width: 180px;
  transition: transform 0.3s; /* Prepara a animação */
}

/* Estado quando o mouse passa sobre o card */
.card:hover {
  transform: scale(1.06);   /* Aumenta 6% */
  border-color: #ff6b6b;
}

/* Imagem dentro do card */
.card img {
  width: 150px;
  height: 150px;
  border-radius: 50%;        /* ← Imagem circular! */
  object-fit: cover;         /* Mantém proporção */
  border: 3px solid #e63946;
}

.card h3 { color: #ff6b6b; margin: 10px 0 5px; }
.card p  { color: #aaa; font-size: 0.85em; }`,
    tips:[
      "🕷️ **DICA #1 — Tag img e alt OBRIGATÓRIO**\n\nA tag <img> é auto-fechada (não precisa de </img>).\nO atributo alt é OBRIGATÓRIO — sem ele é erro!\n\nPor que o alt é tão importante?\n• Aparece se a imagem não carregar\n• Leitores de tela para cegos leem o alt\n• Melhora o SEO do site\n\n✅ Correto:\n<img src='foto.jpg' alt='Uma foto bonita'>",
      "🕷️ **DICA #2 — Classes CSS**\n\nO atributo class='nome' identifica elementos para o CSS.\nNo CSS, use .nome (com ponto) para selecionar:\n\nHTML:\n<div class='card'>...</div>\n\nCSS:\n.card {\n  background: red;\n  border-radius: 12px;\n}\n\nUm mesmo class pode ser usado em vários elementos!",
      "🕷️ **DICA #3 — Flexbox**\n\ndisplay:flex transforma um container em Flexbox.\nOs filhos diretos viram 'flex items' em linha.\n\nPropriedades do container:\n• justify-content:center → centraliza\n• flex-wrap:wrap → quebra linha\n• gap:16px → espaço entre items\n• align-items:center → alinha verticalmente",
      "🕷️ **DICA #4 — Transitions**\n\ntransition anima mudanças de propriedades automaticamente!\n\n/* Define a animação no estado normal */\n.card {\n  transition: transform 0.3s ease;\n}\n\n/* Define o estado final no hover */\n.card:hover {\n  transform: scale(1.06);\n}\n\nO CSS cuida da animação entre os dois estados!"
    ]
  },
  {
    id:"EX-04",title:"Recrutamento Militar",icon:"⚔️",theme:"Attack on Titan",
    difficulty:"Avançado",diffClass:"badge-adv",color:"#2c7da0",
    a1:"#2c7da0",a2:"#48cae4",xp:300,
    description:"Crie um formulário de recrutamento para os Batalhões de Reconhecimento. Formulários são fundamentais para qualquer aplicação web!",
    objective:"form, input, select, textarea, label, button, :focus",
    starter_html:`<!DOCTYPE html>
<!-- =========================================
  EX-04 | Tema: Attack on Titan ⚔️
  Objetivo: Formulários HTML
  form     = container do formulário
  label    = rótulo do campo
  input    = campo de entrada (auto-fechado)
  select   = lista suspensa
  textarea = texto multilinha
  button   = botão
  ========================================= -->
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Recrutamento - Batalhão de Reconhecimento</title>
</head>
<body>

  <h1>⚔️ Recrutamento Militar</h1>
  <h2>Batalhão de Reconhecimento</h2>

  <!-- form: container. action=URL de destino. method=get/post -->
  <form action="#" method="post">

    <!-- label + input: rótulo + campo de texto -->
    <!-- O 'for' do label deve ser IGUAL ao 'id' do input! -->
    <div class="campo">
      <label for="nome">👤 Nome do Soldado:</label>
      <input
        type="text"
        id="nome"
        name="nome"
        placeholder="Ex: Eren Yeager"
        required>
    </div>

    <div class="campo">
      <label for="email">📧 Email:</label>
      <!-- type="email" valida formato automaticamente! -->
      <input
        type="email"
        id="email"
        name="email"
        placeholder="soldado@reconhecimento.com"
        required>
    </div>

    <!-- select: lista suspensa com options -->
    <div class="campo">
      <label for="batalhao">⚔️ Batalhão Desejado:</label>
      <select id="batalhao" name="batalhao">
        <option value="">— Selecione —</option>
        <option value="rec">Batalhão de Reconhecimento</option>
        <option value="guarda">Guarda Real</option>
        <option value="muralha">Guarnição das Muralhas</option>
      </select>
    </div>

    <!-- textarea: área de texto com múltiplas linhas -->
    <div class="campo">
      <label for="bio">💪 Habilidades:</label>
      <textarea
        id="bio"
        name="bio"
        rows="3"
        placeholder="Descreva suas habilidades de combate..."></textarea>
    </div>

    <!-- button type="submit": envia o formulário -->
    <button type="submit">🗡️ Recrutar Soldado!</button>

  </form>

</body>
</html>`,
    starter_css:`/* =========================================
  CSS do EX-04 — Formulários
  ========================================= */

body {
  background-color: #0a0a14;
  color: #e8e8e8;
  font-family: Georgia, serif;
  padding: 30px;
  min-height: 100vh;
}

h1 { color: #2c7da0; text-align: center; margin-bottom: 4px; }
h2 { color: #90c0d8; text-align: center; margin-top: 0; }

/* Container do formulário */
form {
  max-width: 450px;
  margin: 28px auto;
  background: rgba(20,20,40,0.95);
  padding: 30px;
  border-radius: 10px;
  border: 1px solid #2c7da0;
}

/* Container de cada par label+input */
.campo {
  margin: 14px 0;
  display: flex;
  flex-direction: column; /* Empilha label em cima do input */
  gap: 6px;
}

label {
  font-weight: bold;
  color: #90c0d8;
  font-size: 0.9em;
}

/* Estilo unificado para input, select e textarea */
input, select, textarea {
  padding: 10px 14px;
  background: #0d1117;
  color: #e8e8e8;
  border: 1px solid #2c7da0;
  border-radius: 5px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.3s;
}

/* :focus = quando o campo está selecionado/ativo */
input:focus, select:focus, textarea:focus {
  outline: none;              /* Remove o contorno padrão do browser */
  border-color: #48cae4;
  box-shadow: 0 0 8px rgba(72,202,228,0.3);
}

textarea { resize: vertical; } /* Permite redimensionar verticalmente */

button {
  width: 100%;
  margin-top: 20px;
  padding: 14px;
  background: #2c7da0;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: background 0.3s;
}

button:hover { background: #48cae4; color: #000; }`,
    tips:[
      "⚔️ **DICA #1 — label e input conectados**\n\nO atributo 'for' do <label> deve ser IGUAL ao 'id' do <input>.\nIsso conecta os dois — clicar no texto do label foca o campo!\n\n✅ Correto:\n<label for='nome'>Nome:</label>\n<input id='nome' type='text'>\n\n❌ Errado:\n<label>Nome:</label>\n<input type='text'>",
      "⚔️ **DICA #2 — Tipos de input**\n\nCada type tem comportamento e validação diferente!\n\ntype='text'     → texto simples\ntype='email'    → valida formato de email\ntype='number'   → apenas números\ntype='password' → oculta o texto\ntype='checkbox' → caixa de seleção\ntype='date'     → seletor de data\ntype='color'    → seletor de cor 🎨",
      "⚔️ **DICA #3 — Atributo required**\n\nO atributo required torna o campo obrigatório.\nO formulário não envia se o campo estiver vazio!\n\n<input type='text' required>\n\nO browser mostra uma mensagem de erro automaticamente.\nÓtimo para validação sem JavaScript!",
      "⚔️ **DICA #4 — Pseudo-classe :focus**\n\n:focus aplica estilos quando o elemento está em foco.\nMelhora MUITO a experiência do usuário em formulários!\n\ninput:focus {\n  outline: none;\n  border-color: #48cae4;\n  box-shadow: 0 0 8px rgba(72,202,228,0.3);\n}\n\nSempre remova outline:none junto com :focus customizado!"
    ]
  }
];

/* ============================================================
   SISTEMA DE LOGS
   ============================================================ */
function makeLog({ tipo_erro,modulo,exercicio_id,usuario_id,erro,linha,estado_esperado,estado_atual,feedback_text }) {
  const now = new Date();
  const ts = now.toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"});
  const timestamp = now.toISOString();
  let level="WARN",impact="low",category="erro de sintaxe";
  const el=erro.toLowerCase();
  if(el.includes("alt")){category="atributo obrigatório ausente";impact="medium";level="WARN";}
  else if(el.includes("fechad")||el.includes("não fechada")){category="tag não fechada";impact="high";level="ERROR";}
  else if(el.includes("aninhament")){category="aninhamento incorreto";impact="high";level="ERROR";}
  else if(el.includes("propriedade")||el.includes("inválid")){category="propriedade inválida";impact="medium";level="WARN";}
  else if(el.includes("unidade")){category="unidade ausente";impact="low";level="INFO";}
  else if(el.includes("ponto e vírgula")){category="erro de sintaxe";impact="medium";level="WARN";}
  else if(el.includes("doctype")){category="erro de sintaxe";impact="medium";level="WARN";}
  if(tipo_erro==="system_error")level="ERROR";
  const technical=`[${ts}] [${level}] [${modulo}] - Exercício ${exercicio_id} | Usuário ${usuario_id} | ${erro} na linha ${linha}. Estado esperado: ${estado_esperado}. Estado atual: ${estado_atual}. Impacto: ${impact}.`;
  const json=JSON.stringify({timestamp,level,type:tipo_erro,module:modulo,exercise_id:exercicio_id,user_id:usuario_id,error:erro,line:linha,impact,category},null,2);
  return {
    id:`${Date.now()}_${Math.random().toString(36).slice(2)}`,
    timestamp,ts,level,tipo_erro,modulo,exercicio_id,usuario_id,erro,linha,impact,category,
    technical,json,
    summary:`[${level}] ${erro} — linha ${linha}`,
    feedback:feedback_text||"Verifique o código nesta linha e corrija o erro.",
  };
}

function validateHTML(html,cid,uid) {
  const logs=[];
  const lines=html.split("\n");
  const firstCode=lines.findIndex(l=>l.trim()&&!l.trim().startsWith("<!--"));
  if(firstCode>=0&&!lines[firstCode].trim().toLowerCase().startsWith("<!doctype")){
    logs.push(makeLog({tipo_erro:"student_error",modulo:"html_validator",exercicio_id:cid,usuario_id:uid,
      erro:"<!DOCTYPE html> ausente ou não é a primeira linha",linha:firstCode+1,
      estado_esperado:"<!DOCTYPE html> como primeira linha não comentada",
      estado_atual:"Documento sem declaração DOCTYPE",
      feedback_text:"Todo arquivo HTML deve começar com:\n<!DOCTYPE html>\n\nIsso informa ao navegador que estamos usando HTML5.\nSem isso, o navegador pode renderizar de forma incorreta!"}));
  }
  lines.forEach((line,idx)=>{
    if(line.includes("<img")&&!line.includes("alt=")){
      const nearby=lines.slice(Math.max(0,idx-1),Math.min(lines.length,idx+3)).join(" ");
      if(!nearby.includes("alt=")){
        logs.push(makeLog({tipo_erro:"student_error",modulo:"html_validator",exercicio_id:cid,usuario_id:uid,
          erro:"Tag <img> sem atributo 'alt'",linha:idx+1,
          estado_esperado:'<img src="..." alt="Descrição da imagem">',
          estado_atual:"<img> sem atributo alt",
          feedback_text:'O atributo alt é OBRIGATÓRIO em todas as imagens!\n\nPor quê?\n• Aparece se a imagem não carregar\n• É lido por leitores de tela (acessibilidade)\n• Melhora o SEO do site\n\nCorreto:\n<img src="foto.jpg" alt="Uma foto bonita">'}));
      }
    }
  });
  const voidTags=["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"];
  const stack=[];
  const re=/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
  let m;
  while((m=re.exec(html))!==null){
    const full=m[0],tag=m[1].toLowerCase();
    if(voidTags.includes(tag))continue;
    if(full.startsWith("</")){
      if(stack.length&&stack[stack.length-1].tag===tag)stack.pop();
    }else if(!full.endsWith("/>")){
      const lineNum=html.substring(0,m.index).split("\n").length;
      stack.push({tag,line:lineNum});
    }
  }
  stack.slice(-2).forEach(u=>{
    logs.push(makeLog({tipo_erro:"student_error",modulo:"html_validator",exercicio_id:cid,usuario_id:uid,
      erro:`Tag <${u.tag}> não fechada`,linha:u.line,
      estado_esperado:`<${u.tag}>conteúdo</${u.tag}>`,
      estado_atual:`<${u.tag}> aberta sem tag de fechamento`,
      feedback_text:`A tag <${u.tag}> foi aberta mas não foi fechada!\n\nTags HTML (exceto void elements) precisam ser fechadas:\n✅ Correto:\n<${u.tag}>seu conteúdo</${u.tag}>\n\n❌ Errado:\n<${u.tag}>seu conteúdo`}));
  });
  return logs;
}

function validateCSS(css,cid,uid) {
  const logs=[];
  const lines=css.split("\n");
  lines.forEach((line,idx)=>{
    const t=line.trim();
    if(!t||t.startsWith("/*")||t.startsWith("*")||t.endsWith("{")||t==="}"||t.startsWith("@")||t.startsWith("//"))return;
    if(t.includes(":")&&!t.endsWith("{")&&!t.includes("url(")){
      const ci=t.indexOf(":");
      const prop=t.substring(0,ci).trim();
      const rawVal=t.substring(ci+1).trim();
      if(rawVal&&!t.endsWith(";")&&!t.endsWith("{")&&!t.endsWith("}")&&!t.endsWith(",")&&!t.endsWith("(")){
        logs.push(makeLog({tipo_erro:"student_error",modulo:"css_validator",exercicio_id:cid,usuario_id:uid,
          erro:"Ponto e vírgula (;) ausente no final da declaração",linha:idx+1,
          estado_esperado:`${prop}: ${rawVal};`,
          estado_atual:`${prop}: ${rawVal} (sem ;)`,
          feedback_text:`Cada declaração CSS deve terminar com ponto e vírgula (;)!\n\n✅ Correto:\nh1 {\n  color: red;\n  font-size: 16px;\n}\n\n❌ Errado:\nh1 {\n  color: red\n  font-size: 16px\n}`}));
      }
      const numericProps=["width","height","font-size","margin","padding","border-width","top","left","right","bottom","min-width","max-width","gap","border-radius"];
      const valClean=rawVal.replace(";","").trim();
      if(numericProps.some(p=>prop.toLowerCase().includes(p))&&/^\d+$/.test(valClean)&&valClean!=="0"){
        logs.push(makeLog({tipo_erro:"student_error",modulo:"css_validator",exercicio_id:cid,usuario_id:uid,
          erro:`Valor '${valClean}' sem unidade na propriedade '${prop}'`,linha:idx+1,
          estado_esperado:`${prop}: ${valClean}px (ou em, rem, %)`,
          estado_atual:`${prop}: ${valClean} (sem unidade de medida)`,
          feedback_text:`Valores numéricos em CSS precisam de uma unidade (exceto 0)!\n\nUnidades comuns:\n• px  → pixels (tamanho fixo)\n• em  → relativo ao elemento pai\n• rem → relativo ao elemento raiz (html)\n• %   → porcentagem do elemento pai\n\n✅ Correto: font-size: 16px;\n❌ Errado:  font-size: 16;`}));
      }
    }
  });
  return logs;
}

/* ============================================================
   EXPORT DO PROJETO
   ============================================================ */
function exportProject(html,css,title) {
  let final=html;
  const cssBlock=`\n  <!-- ===== CSS gerado no HTMLLab Simulador ===== -->\n  <style>\n${css}\n  </style>`;
  if(final.includes("</head>")){final=final.replace("</head>",`${cssBlock}\n</head>`);}
  else{final=`${cssBlock}\n${final}`;}
  const blob=new Blob([final],{type:"text/html;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;a.download=`${title.replace(/[^a-z0-9]/gi,"_").toLowerCase()||"projeto"}.html`;
  document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);
}

function buildPreview(html,css) {
  if(html.includes("</head>"))return html.replace("</head>",`<style>${css}</style></head>`);
  return `<style>${css}</style>${html}`;
}

/* ============================================================
   COMPONENTE: NavBar
   ============================================================ */
function NavBar({page,setPage}) {
  return (
    <nav style={{background:"rgba(4,4,15,0.97)",borderBottom:"1px solid #1a1a40",padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:200,backdropFilter:"blur(14px)"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>setPage("home")}>
        <span style={{fontSize:20}}>⚡</span>
        <span style={{fontFamily:"Orbitron,sans-serif",fontWeight:900,fontSize:13,color:"#00e5ff",letterSpacing:2}}>HTML<span style={{color:"#ff0080"}}>LAB</span></span>
      </div>
      <div style={{display:"flex",gap:3}}>
        {[["home","🏠 Início"],["learn","📚 Aprender"],["challenges","🎮 Desafios"],["simulator","💻 Simulador"]].map(([p,l])=>(
          <button key={p} className={`nav-btn${page===p?" active":""}`} onClick={()=>setPage(p)}>{l}</button>
        ))}
      </div>
      <div style={{fontSize:11,color:"#2a2a4a",fontFamily:"Orbitron,sans-serif"}}>v1.0</div>
    </nav>
  );
}

function DiffBadge({diff,cls}){return <span className={`badge ${cls}`}>{diff}</span>;}

/* ============================================================
   COMPONENTE: HomePage
   ============================================================ */
function HomePage({setPage}) {
  return (
    <div className="grid-bg scanline" style={{minHeight:"100vh",padding:"0 20px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:"8%",left:"3%",fontSize:90,opacity:0.04,fontFamily:"Orbitron",color:"#00e5ff",userSelect:"none",pointerEvents:"none",lineHeight:1}}>{"</>"}</div>
      <div style={{position:"absolute",bottom:"8%",right:"3%",fontSize:90,opacity:0.04,fontFamily:"Orbitron",color:"#ff0080",userSelect:"none",pointerEvents:"none",lineHeight:1}}>{"{ }"}</div>
      <div style={{maxWidth:840,margin:"0 auto",paddingTop:70,textAlign:"center"}}>
        <div className="float-anim" style={{fontSize:60,marginBottom:14}}>⚡</div>
        <h1 className="glitch-text" style={{fontSize:"clamp(30px,5.5vw,56px)",fontWeight:900,color:"#00e5ff",letterSpacing:5,marginBottom:6}}>HTMLLAB</h1>
        <p style={{fontFamily:"Orbitron,sans-serif",fontSize:12,color:"#ff0080",letterSpacing:3,marginBottom:20,textTransform:"uppercase"}}>Simulador Ninja de Desenvolvimento Web</p>
        <p style={{fontSize:16,color:"#7986cb",maxWidth:520,margin:"0 auto 36px",lineHeight:1.8}}>
          Aprenda HTML e CSS do jeito <strong style={{color:"#00e5ff"}}>épico</strong> — com desafios de <span style={{color:"#ff9f1c"}}>Naruto</span>, <span style={{color:"#c41e3a"}}>Harry Potter</span>, <span style={{color:"#e63946"}}>Marvel</span> e <span style={{color:"#2c7da0"}}>Attack on Titan</span>! 🔥
        </p>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:56}}>
          <button className="btn-p" style={{padding:"13px 28px",fontSize:12}} onClick={()=>setPage("learn")}>📚 Começar Aprendendo</button>
          <button className="btn-s" style={{padding:"12px 28px",fontSize:12}} onClick={()=>setPage("challenges")}>🎮 Ver Desafios</button>
          <button className="btn-s" style={{padding:"12px 28px",fontSize:12}} onClick={()=>setPage("simulator")}>💻 Abrir Simulador</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14,marginBottom:52}}>
          {[["📖","Aprenda","Tags HTML e CSS com exemplos reais e interativos"],["🎮","4 Desafios","Missões temáticas: Naruto, HP, Marvel e AoT"],["💡","Dicas Guiadas","Explicações detalhadas com sistema de cooldown"],["🔍","Validador","Logs detalhados para encontrar e corrigir erros"],["💾","Exportar","Salve em .html e abra direto no VS Code"],["⚡","Preview Live","Veja o resultado em tempo real enquanto digita"]].map(([icon,title,desc])=>(
            <div key={title} className="glass-card" style={{padding:"18px 14px",textAlign:"center"}}>
              <div style={{fontSize:26,marginBottom:8}}>{icon}</div>
              <div style={{fontWeight:800,fontSize:13,color:"#e2e8f0",marginBottom:5}}>{title}</div>
              <div style={{fontSize:11,color:"#3a3a60",lineHeight:1.5}}>{desc}</div>
            </div>
          ))}
        </div>
        <div style={{marginBottom:56}}>
          <p style={{fontFamily:"Orbitron,sans-serif",fontSize:10,color:"#2a2a5a",letterSpacing:3,marginBottom:16}}>MISSÕES DISPONÍVEIS</p>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            {CHALLENGES.map(c=>(
              <div key={c.id} onClick={()=>setPage("challenges")}
                style={{display:"flex",alignItems:"center",gap:8,padding:"10px 16px",background:"rgba(8,8,28,0.8)",border:`1px solid ${c.color}25`,borderRadius:9,cursor:"pointer",transition:"all 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=c.color}
                onMouseLeave={e=>e.currentTarget.style.borderColor=c.color+"25"}>
                <span style={{fontSize:18}}>{c.icon}</span>
                <div style={{textAlign:"left"}}>
                  <div style={{fontSize:11,fontWeight:800,color:c.color,fontFamily:"Orbitron,sans-serif"}}>{c.id}</div>
                  <div style={{fontSize:10,color:"#2a2a5a"}}>{c.theme}</div>
                </div>
                <span style={{fontSize:11,color:"#ffd700",marginLeft:4}}>+{c.xp}XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   COMPONENTE: LearnPage
   ============================================================ */
function LearnPage() {
  const [tab,setTab]=useState("html");
  const [openItem,setOpenItem]=useState(null);
  const HTML_TAGS=[
    {tag:"<!DOCTYPE html>",desc:"Declara HTML5. SEMPRE a 1ª linha!",cat:"estrutura",ex:"<!DOCTYPE html>"},
    {tag:"<html>",desc:"Elemento raiz. Contém tudo.",cat:"estrutura",ex:"<html lang='pt-br'>...</html>"},
    {tag:"<head>",desc:"Metadados (não aparece na tela)",cat:"estrutura",ex:"<head><title>Página</title></head>"},
    {tag:"<body>",desc:"Conteúdo visível ao usuário",cat:"estrutura",ex:"<body>...</body>"},
    {tag:"<h1> a <h6>",desc:"Títulos em hierarquia de importância",cat:"texto",ex:"<h1>Título Principal</h1>"},
    {tag:"<p>",desc:"Parágrafo de texto",cat:"texto",ex:"<p>Meu texto aqui.</p>"},
    {tag:"<a>",desc:"Link (âncora)",cat:"texto",ex:"<a href='https://google.com'>Clique aqui</a>"},
    {tag:"<strong>",desc:"Texto em negrito + semântica de importância",cat:"texto",ex:"<strong>Texto importante!</strong>"},
    {tag:"<em>",desc:"Texto em itálico + ênfase semântica",cat:"texto",ex:"<em>Texto com ênfase</em>"},
    {tag:"<br>",desc:"Quebra de linha (auto-fechada)",cat:"texto",ex:"Linha 1<br>Linha 2"},
    {tag:"<img>",desc:"Imagem — alt é OBRIGATÓRIO!",cat:"midia",ex:'<img src="foto.jpg" alt="Descrição">'},
    {tag:"<video>",desc:"Vídeo embutido",cat:"midia",ex:'<video src="vid.mp4" controls></video>'},
    {tag:"<ul>",desc:"Lista NÃO ordenada (bolinhas)",cat:"listas",ex:"<ul>\n  <li>Item</li>\n</ul>"},
    {tag:"<ol>",desc:"Lista ORDENADA (números)",cat:"listas",ex:"<ol>\n  <li>Primeiro</li>\n</ol>"},
    {tag:"<li>",desc:"Item de lista",cat:"listas",ex:"<li>Meu item</li>"},
    {tag:"<div>",desc:"Container genérico de bloco",cat:"layout",ex:"<div class='box'>...</div>"},
    {tag:"<span>",desc:"Container genérico inline",cat:"layout",ex:"<span style='color:red'>texto</span>"},
    {tag:"<header>",desc:"Cabeçalho semântico",cat:"semantico",ex:"<header><h1>Site</h1></header>"},
    {tag:"<nav>",desc:"Menu de navegação",cat:"semantico",ex:"<nav><a href='#'>Home</a></nav>"},
    {tag:"<main>",desc:"Conteúdo principal da página",cat:"semantico",ex:"<main>...</main>"},
    {tag:"<section>",desc:"Seção de conteúdo relacionado",cat:"semantico",ex:"<section>...</section>"},
    {tag:"<footer>",desc:"Rodapé semântico",cat:"semantico",ex:"<footer>© 2026</footer>"},
    {tag:"<form>",desc:"Container de formulário",cat:"form",ex:"<form action='#' method='post'>...</form>"},
    {tag:"<input>",desc:"Campo de entrada (auto-fechado)",cat:"form",ex:"<input type='text' id='nome' name='nome'>"},
    {tag:"<label>",desc:"Rótulo do campo — for = id do input",cat:"form",ex:"<label for='nome'>Nome:</label>"},
    {tag:"<select>",desc:"Lista suspensa de opções",cat:"form",ex:"<select><option value='a'>Opção A</option></select>"},
    {tag:"<textarea>",desc:"Área de texto multilinha",cat:"form",ex:"<textarea rows='4'></textarea>"},
    {tag:"<button>",desc:"Botão clicável",cat:"form",ex:"<button type='submit'>Enviar</button>"},
    {tag:"<table>",desc:"Tabela de dados",cat:"tabela",ex:"<table><tr><th>Nome</th><td>Ana</td></tr></table>"},
  ];
  const CSS_PROPS=[
    {prop:"color",desc:"Cor do texto",ex:"color: #ff0000;",cat:"texto"},
    {prop:"font-size",desc:"Tamanho da fonte",ex:"font-size: 16px;",cat:"texto"},
    {prop:"font-family",desc:"Tipo de fonte",ex:"font-family: Arial, sans-serif;",cat:"texto"},
    {prop:"font-weight",desc:"Peso da fonte (negrito)",ex:"font-weight: bold;",cat:"texto"},
    {prop:"text-align",desc:"Alinhamento do texto",ex:"text-align: center;",cat:"texto"},
    {prop:"text-decoration",desc:"Decoração do texto",ex:"text-decoration: none;",cat:"texto"},
    {prop:"line-height",desc:"Altura da linha (espaçamento)",ex:"line-height: 1.7;",cat:"texto"},
    {prop:"letter-spacing",desc:"Espaço entre letras",ex:"letter-spacing: 2px;",cat:"texto"},
    {prop:"background-color",desc:"Cor de fundo",ex:"background-color: #1a1a2e;",cat:"fundo"},
    {prop:"background-image",desc:"Imagem de fundo",ex:"background-image: url('bg.jpg');",cat:"fundo"},
    {prop:"opacity",desc:"Transparência (0 = invisível, 1 = opaco)",ex:"opacity: 0.7;",cat:"fundo"},
    {prop:"width",desc:"Largura do elemento",ex:"width: 300px;",cat:"box"},
    {prop:"height",desc:"Altura do elemento",ex:"height: 200px;",cat:"box"},
    {prop:"margin",desc:"Espaço externo (fora do elemento)",ex:"margin: 10px auto;",cat:"box"},
    {prop:"padding",desc:"Espaço interno (dentro do elemento)",ex:"padding: 20px;",cat:"box"},
    {prop:"border",desc:"Borda ao redor do elemento",ex:"border: 2px solid red;",cat:"box"},
    {prop:"border-radius",desc:"Arredondamento das bordas",ex:"border-radius: 10px;",cat:"box"},
    {prop:"box-shadow",desc:"Sombra do elemento",ex:"box-shadow: 2px 4px 12px rgba(0,0,0,0.5);",cat:"box"},
    {prop:"display",desc:"Tipo de exibição",ex:"display: flex;",cat:"layout"},
    {prop:"flex-direction",desc:"Direção do Flexbox",ex:"flex-direction: column;",cat:"layout"},
    {prop:"justify-content",desc:"Alinhamento eixo principal (Flexbox)",ex:"justify-content: center;",cat:"layout"},
    {prop:"align-items",desc:"Alinhamento eixo cruzado (Flexbox)",ex:"align-items: center;",cat:"layout"},
    {prop:"gap",desc:"Espaço entre flex/grid items",ex:"gap: 16px;",cat:"layout"},
    {prop:"position",desc:"Tipo de posicionamento",ex:"position: relative;",cat:"layout"},
    {prop:"cursor",desc:"Aparência do cursor do mouse",ex:"cursor: pointer;",cat:"misc"},
    {prop:"transition",desc:"Animação suave entre estados",ex:"transition: all 0.3s ease;",cat:"misc"},
    {prop:"transform",desc:"Transformação visual",ex:"transform: scale(1.05);",cat:"misc"},
    {prop:"overflow",desc:"Comportamento de conteúdo excedente",ex:"overflow: hidden;",cat:"misc"},
  ];
  const catColor={estrutura:"#00e5ff",texto:"#a855f7",midia:"#ff0080",listas:"#ffd700",layout:"#00e676",semantico:"#ff9f1c",form:"#48cae4",tabela:"#f72585",fundo:"#ff0080",box:"#ffd700",misc:"#7986cb"};
  const TABS=[{id:"html",l:"🏗️ Tags HTML"},{id:"css",l:"🎨 Propriedades CSS"},{id:"selectors",l:"🎯 Seletores"},{id:"images",l:"🖼️ Imagens"},{id:"structure",l:"📐 Estrutura"}];
  return (
    <div style={{maxWidth:980,margin:"0 auto",padding:"30px 20px"}}>
      <div className="fade-up" style={{marginBottom:28}}>
        <h1 style={{fontFamily:"Orbitron,sans-serif",fontSize:22,color:"#00e5ff",marginBottom:6}}>📚 Centro de Aprendizado</h1>
        <p style={{color:"#3a3a60",fontSize:14}}>Domine as fundações antes de começar as missões. Clique em qualquer item para ver exemplos!</p>
      </div>
      <div style={{display:"flex",borderBottom:"1px solid #1a1a40",marginBottom:24,overflowX:"auto",gap:0}}>
        {TABS.map(t=><button key={t.id} className={`tab-btn${tab===t.id?" active":""}`} onClick={()=>{setTab(t.id);setOpenItem(null);}}>{t.l}</button>)}
      </div>
      {tab==="html"&&(
        <div className="fade-up">
          <p style={{color:"#7986cb",marginBottom:18,lineHeight:1.7,fontSize:14}}>HTML usa <strong style={{color:"#00e5ff"}}>tags</strong> (palavras entre {`< >`}) para estruturar conteúdo. Clique em qualquer tag para ver um exemplo!</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:10}}>
            {HTML_TAGS.map(t=>(
              <div key={t.tag} onClick={()=>setOpenItem(openItem===t.tag?null:t.tag)}
                style={{background:"rgba(8,8,28,0.9)",border:`1px solid ${openItem===t.tag?"#00e5ff":"#1a1a40"}`,borderRadius:10,padding:"12px 14px",cursor:"pointer",transition:"all 0.2s"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <code style={{background:`${catColor[t.cat]||"#00e5ff"}18`,color:catColor[t.cat]||"#00e5ff",padding:"3px 8px",borderRadius:4,fontSize:12,fontFamily:"Share Tech Mono",whiteSpace:"nowrap"}}>{t.tag}</code>
                  <span style={{fontSize:11,color:"#3a3a60",flex:1,lineHeight:1.4}}>{t.desc}</span>
                </div>
                {openItem===t.tag&&<div className="slide-in" style={{marginTop:10}}><pre className="code-block" style={{fontSize:11,lineHeight:1.7,padding:"10px 12px"}}>{t.ex}</pre></div>}
              </div>
            ))}
          </div>
        </div>
      )}
      {tab==="css"&&(
        <div className="fade-up">
          <p style={{color:"#7986cb",marginBottom:14,lineHeight:1.7,fontSize:14}}>CSS usa <strong style={{color:"#a855f7"}}>propriedades</strong> para estilizar elementos. Toda declaração termina com <strong style={{color:"#a855f7"}}>ponto e vírgula (;)</strong>!</p>
          <pre className="code-block" style={{marginBottom:16,fontSize:12}}>{"seletor {\n  propriedade: valor;\n  outra-propriedade: outro-valor;\n}"}</pre>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:10}}>
            {CSS_PROPS.map(p=>(
              <div key={p.prop} onClick={()=>setOpenItem(openItem===p.prop?null:p.prop)}
                style={{background:"rgba(8,8,28,0.9)",border:`1px solid ${openItem===p.prop?"#a855f7":"#1a1a40"}`,borderRadius:10,padding:"12px 14px",cursor:"pointer",transition:"all 0.2s"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <code style={{background:"#a855f718",color:"#a855f7",padding:"3px 8px",borderRadius:4,fontSize:12,fontFamily:"Share Tech Mono",whiteSpace:"nowrap"}}>{p.prop}</code>
                  <span style={{fontSize:11,color:"#3a3a60",flex:1,lineHeight:1.4}}>{p.desc}</span>
                </div>
                {openItem===p.prop&&<div className="slide-in" style={{marginTop:10}}><pre className="code-block" style={{fontSize:11,padding:"10px 12px"}}>{p.ex}</pre></div>}
              </div>
            ))}
          </div>
        </div>
      )}
      {tab==="selectors"&&(
        <div className="fade-up">
          <p style={{color:"#7986cb",marginBottom:18,lineHeight:1.7,fontSize:14}}>Seletores definem <strong style={{color:"#ffd700"}}>quais elementos</strong> o CSS vai estilizar. Aprenda a mirar com precisão!</p>
          <div style={{display:"grid",gap:12}}>
            {[
              {sel:"h1",desc:'Seleciona TODOS os elementos <h1> da página',ex:"h1 { color: blue; font-size: 2em; }",note:"Seletor de tipo"},
              {sel:".classe",desc:"Seleciona elementos com class='classe'",ex:".destaque { background: yellow; color: black; }",note:"Seletor de classe — o mais usado!"},
              {sel:"#id",desc:"Seleciona o elemento com id='id' (único!)",ex:"#titulo { font-size: 32px; font-weight: bold; }",note:"Seletor de ID — use com moderação"},
              {sel:"pai filho",desc:"Seleciona 'filho' que está dentro de 'pai'",ex:".card img { border-radius: 50%; }",note:"Seletor descendente"},
              {sel:":hover",desc:"Aplica quando o mouse está sobre o elemento",ex:"button:hover { background: blue; color: white; }",note:"Pseudo-classe de estado"},
              {sel:":focus",desc:"Aplica quando o elemento está em foco",ex:"input:focus { border-color: blue; outline: none; }",note:"Perfeito para formulários!"},
              {sel:"*",desc:"Seleciona TODOS os elementos da página",ex:"* { box-sizing: border-box; margin: 0; }",note:"Seletor universal"},
            ].map(s=>(
              <div key={s.sel} style={{background:"rgba(8,8,28,0.9)",border:"1px solid #1a1a40",borderRadius:10,padding:16,display:"grid",gridTemplateColumns:"130px 1fr",gap:14,alignItems:"start"}}>
                <div style={{textAlign:"center"}}>
                  <code style={{background:"#ffd70018",color:"#ffd700",padding:"5px 10px",borderRadius:6,fontSize:14,fontFamily:"Share Tech Mono",display:"block",marginBottom:6}}>{s.sel}</code>
                  <span style={{fontSize:10,color:"#48cae4"}}>{s.note}</span>
                </div>
                <div>
                  <p style={{fontSize:13,color:"#7986cb",marginBottom:8}}>{s.desc}</p>
                  <pre className="code-block" style={{fontSize:11,padding:"8px 12px"}}>{s.ex}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab==="images"&&(
        <div className="fade-up">
          <p style={{color:"#7986cb",marginBottom:18,lineHeight:1.7,fontSize:14}}>Imagens usam a tag <strong style={{color:"#ff0080"}}>{`<img>`}</strong> — auto-fechada e com <strong style={{color:"#ff0080"}}>alt OBRIGATÓRIO</strong>!</p>
          <div style={{display:"grid",gap:14}}>
            {[
              {t:"🖼️ Sintaxe básica",c:'<img src="foto.jpg" alt="Descrição da foto">',n:"src = caminho/URL | alt = descrição alternativa OBRIGATÓRIA"},
              {t:"🔗 Imagem por URL",c:'<img src="https://site.com/foto.jpg" alt="Logo">',n:"Você pode usar links diretos de imagens da internet"},
              {t:"📏 Controlando tamanho",c:'<!-- No HTML -->\n<img src="foto.jpg" alt="Foto">\n\n/* No CSS */\nimg {\n  width: 300px;\n  height: 200px;\n  object-fit: cover; /* Mantém proporção */\n}',n:"Prefira controlar tamanho pelo CSS — mais flexível!"},
              {t:"⭕ Imagem circular",c:'.avatar {\n  width: 100px;\n  height: 100px;\n  border-radius: 50%;   /* 50% = círculo perfeito! */\n  object-fit: cover;\n  border: 3px solid gold;\n}',n:"border-radius: 50% transforma qualquer elemento em círculo"},
              {t:"🔗 Imagem clicável",c:'<a href="https://google.com">\n  <img src="logo.png" alt="Logo - Clique para ir ao Google">\n</a>',n:"Envolva a <img> com <a> para torná-la clicável!"},
              {t:"⚠️ Erros comuns",c:'<!-- ❌ ERRADO — sem alt -->\n<img src="foto.jpg">\n\n<!-- ❌ ERRADO — alt vazio desnecessariamente -->\n<img src="foto.jpg" alt="">\n\n<!-- ✅ CORRETO -->\n<img src="foto.jpg" alt="Uma bela paisagem ao nascer do sol">',n:"Alt vazio só é ok para imagens decorativas — e mesmo assim precisa estar presente!"},
            ].map(item=>(
              <div key={item.t} style={{background:"rgba(8,8,28,0.9)",border:"1px solid #1a1a40",borderRadius:10,padding:16}}>
                <div style={{fontWeight:800,color:"#ff0080",marginBottom:8,fontSize:14}}>{item.t}</div>
                <pre className="code-block" style={{marginBottom:8,fontSize:12}}>{item.c}</pre>
                <p style={{fontSize:12,color:"#3a3a60",margin:0}}>💡 {item.n}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab==="structure"&&(
        <div className="fade-up">
          <p style={{color:"#7986cb",marginBottom:18,lineHeight:1.7,fontSize:14}}>Todo arquivo HTML tem uma estrutura obrigatória. Pense nela como o <strong style={{color:"#00e5ff"}}>esqueleto</strong> do seu projeto!</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
            <div>
              <p style={{fontFamily:"Orbitron,sans-serif",fontSize:11,color:"#00e5ff",letterSpacing:2,marginBottom:10}}>ESTRUTURA COMPLETA</p>
              <pre className="code-block" style={{fontSize:11,lineHeight:1.85}}>{`<!DOCTYPE html>
<html lang="pt-br">

  <head>
    <!-- Metadados (não aparecem na tela) -->
    <meta charset="UTF-8">
    <meta name="viewport"
      content="width=device-width">
    <title>Título da Aba do Navegador</title>

    <!-- CSS externo (arquivo separado): -->
    <link rel="stylesheet" href="style.css">
  </head>

  <body>
    <!-- Todo conteúdo visível fica aqui! -->

    <header>
      <nav>Menu de Navegação</nav>
    </header>

    <main>
      <h1>Conteúdo Principal</h1>
      <p>Texto da página...</p>
    </main>

    <footer>
      <p>© 2026 Meu Site</p>
    </footer>

    <!-- JS no final do body: -->
    <script src="script.js"></script>
  </body>

</html>`}</pre>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {[
                {tag:"<!DOCTYPE html>",color:"#ffd700",desc:"OBRIGATÓRIO. Declara que é HTML5. Sempre a primeira linha, sem exceções!"},
                {tag:"<html lang='pt-br'>",color:"#00e5ff",desc:"Raiz do documento. O lang define o idioma — importante para acessibilidade e SEO."},
                {tag:"<head>",color:"#a855f7",desc:"Metadados da página. O conteúdo aqui NÃO aparece visualmente, mas é crucial!"},
                {tag:'<meta charset="UTF-8">',color:"#a855f7",desc:"Define a codificação. UTF-8 suporta acentos, caracteres especiais e emojis. 🎉"},
                {tag:"<title>",color:"#a855f7",desc:"Texto que aparece na aba do navegador e nos resultados de busca do Google."},
                {tag:"<link rel='stylesheet'>",color:"#48cae4",desc:"Conecta um arquivo CSS externo à página. Isso separa HTML (estrutura) de CSS (estilo)."},
                {tag:"<body>",color:"#00e676",desc:"TUDO que o usuário vê está aqui. Headers, parágrafos, imagens, forms — tudo!"},
                {tag:"<header>/<main>/<footer>",color:"#ff9f1c",desc:"Tags semânticas: dão significado à estrutura. Melhora SEO, acessibilidade e leitura do código."},
              ].map(item=>(
                <div key={item.tag} style={{background:"rgba(8,8,28,0.9)",border:`1px solid ${item.color}22`,borderRadius:8,padding:"10px 14px"}}>
                  <code style={{color:item.color,fontFamily:"Share Tech Mono",fontSize:11,wordBreak:"break-all"}}>{item.tag}</code>
                  <p style={{fontSize:11,color:"#3a3a60",margin:"5px 0 0",lineHeight:1.5}}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   COMPONENTE: ChallengesPage
   ============================================================ */
function ChallengesPage({onSelect}) {
  return (
    <div style={{maxWidth:980,margin:"0 auto",padding:"30px 20px"}}>
      <div className="fade-up" style={{marginBottom:28}}>
        <h1 style={{fontFamily:"Orbitron,sans-serif",fontSize:22,color:"#00e5ff",marginBottom:6}}>🎮 Missões</h1>
        <p style={{color:"#3a3a60",fontSize:14}}>Escolha uma missão e abra o Simulador. Complete todas para dominar HTML e CSS!</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(430px,1fr))",gap:18}}>
        {CHALLENGES.map((c,i)=>(
          <div key={c.id} className="c-card fade-up" style={{"--a1":c.a1,"--a2":c.a2,animationDelay:`${i*0.1}s`}} onClick={()=>onSelect(c)}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:38,lineHeight:1}}>{c.icon}</span>
                <div>
                  <div style={{fontFamily:"Orbitron,sans-serif",fontSize:10,color:"#2a2a5a",letterSpacing:2,marginBottom:2}}>{c.id}</div>
                  <div style={{fontWeight:800,fontSize:17,color:"#e2e8f0"}}>{c.title}</div>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:14,color:"#ffd700",fontWeight:700}}>+{c.xp} XP</div>
              </div>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
              <DiffBadge diff={c.difficulty} cls={c.diffClass}/>
              <span className="badge" style={{background:`${c.color}15`,color:c.color,border:`1px solid ${c.color}60`}}>{c.theme}</span>
            </div>
            <p style={{color:"#7986cb",fontSize:13,lineHeight:1.65,marginBottom:12}}>{c.description}</p>
            <div style={{fontSize:12,color:"#48cae4",marginBottom:16}}>🎯 {c.objective}</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",gap:6}}>
                {c.tips.map((_,i)=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:`${c.color}50`}}></div>)}
                <span style={{fontSize:10,color:"#2a2a5a",marginLeft:4}}>{c.tips.length} dicas</span>
              </div>
              <button className="btn-p" style={{fontSize:10,padding:"8px 16px"}}>▶ COMEÇAR MISSÃO</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   COMPONENTE: TipModal
   ============================================================ */
function TipModal({tip,tipIdx,total,timeLeft,onClose}) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}}>
      <div className="glass-card" style={{maxWidth:520,width:"100%",padding:"0",position:"relative",border:"1px solid #00e5ff",boxShadow:"0 0 50px rgba(0,229,255,0.18)"}}>
        <div style={{height:4,background:"#1a1a40",borderRadius:"12px 12px 0 0",overflow:"hidden"}}>
          <div className="tip-bar"></div>
        </div>
        <div style={{padding:"20px 24px 24px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontFamily:"Orbitron,sans-serif",fontSize:11,color:"#00e5ff",letterSpacing:2}}>💡 DICA {tipIdx+1}/{total}</div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{background:"rgba(0,229,255,0.1)",border:"1px solid #00e5ff",borderRadius:6,padding:"3px 10px",fontFamily:"Share Tech Mono",fontSize:12,color:"#00e5ff"}}>⏱ {timeLeft}s</div>
              <button onClick={onClose} style={{background:"transparent",border:"none",color:"#3a3a60",cursor:"pointer",fontSize:18,lineHeight:1,padding:4}}>✕</button>
            </div>
          </div>
          <div style={{whiteSpace:"pre-wrap",fontSize:13.5,color:"#c5cae9",lineHeight:1.8,fontFamily:"Nunito,sans-serif"}}>{tip}</div>
          <div style={{marginTop:16,fontSize:11,color:"#2a2a5a",borderTop:"1px solid #1a1a40",paddingTop:12,textAlign:"center"}}>
            Após fechar, aguarde <strong style={{color:"#ffd700"}}>2 minutos</strong> para ver a próxima dica.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   COMPONENTE: LogPanel
   ============================================================ */
function LogPanel({logs,onClear}) {
  const [open,setOpen]=useState({});
  const [view,setView]=useState("summary");
  const LC={ERROR:"#ff1744",WARN:"#ffc107",INFO:"#00e5ff",OK:"#00e676"};
  const toggle=id=>setOpen(p=>({...p,[id]:!p[id]}));
  const errCount=logs.filter(l=>l.level==="ERROR").length;
  const warnCount=logs.filter(l=>l.level==="WARN").length;
  return (
    <div style={{borderTop:"1px solid #1a1a40",background:"#030310",flexShrink:0}}>
      <div style={{padding:"7px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#04040f",borderBottom:"1px solid #1a1a40",flexWrap:"wrap",gap:6}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontFamily:"Orbitron,sans-serif",fontSize:10,color:"#2a2a5a",letterSpacing:2}}>🖥 CONSOLE DE LOGS</span>
          {errCount>0&&<span style={{background:"#ff174418",color:"#ff1744",border:"1px solid #ff174440",padding:"1px 8px",borderRadius:10,fontSize:10}}>{errCount} erro{errCount!==1?"s":""}</span>}
          {warnCount>0&&<span style={{background:"#ffc10718",color:"#ffc107",border:"1px solid #ffc10740",padding:"1px 8px",borderRadius:10,fontSize:10}}>{warnCount} aviso{warnCount!==1?"s":""}</span>}
          {logs.length===0&&<span style={{fontSize:11,color:"#1a1a40"}}>Aguardando validação...</span>}
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          {["summary","technical","json"].map(v=>(
            <button key={v} onClick={()=>setView(v)} style={{background:view===v?"rgba(0,229,255,0.08)":"transparent",border:`1px solid ${view===v?"#00e5ff":"transparent"}`,color:view===v?"#00e5ff":"#2a2a5a",padding:"3px 10px",borderRadius:4,cursor:"pointer",fontSize:10,fontFamily:"Orbitron,sans-serif"}}>{v==="summary"?"Resumo":v==="technical"?"Técnico":"JSON"}</button>
          ))}
          {logs.length>0&&<button onClick={onClear} style={{background:"rgba(255,23,68,0.08)",border:"1px solid #ff174440",color:"#ff1744",padding:"3px 10px",borderRadius:4,cursor:"pointer",fontSize:10,fontFamily:"Orbitron,sans-serif"}}>LIMPAR</button>}
        </div>
      </div>
      <div style={{maxHeight:260,overflowY:"auto",padding:8}}>
        {logs.length===0?(
          <div style={{padding:"16px",textAlign:"center",color:"#1a1a40",fontFamily:"Share Tech Mono",fontSize:12}}>{"> Clique em 🔍 VALIDAR para analisar seu código."}</div>
        ):logs.map(log=>(
          <div key={log.id} className="log-entry" style={{background:`${LC[log.level]||"#7986cb"}06`,border:`1px solid ${LC[log.level]||"#7986cb"}25`}}>
            <div onClick={()=>toggle(log.id)} style={{padding:"7px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
              <span style={{color:LC[log.level]||"#7986cb",fontWeight:700,fontSize:10,minWidth:40}}>[{log.level}]</span>
              <span style={{color:"#48cae4",fontSize:10,whiteSpace:"nowrap"}}>[{log.modulo}]</span>
              <span style={{color:"#7986cb",fontSize:11,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{log.summary.replace(`[${log.level}] `,"")}</span>
              <span style={{color:"#1a1a40",fontSize:10}}>{open[log.id]?"▲":"▼"}</span>
            </div>
            {open[log.id]&&(
              <div style={{padding:"12px 14px",borderTop:"1px solid rgba(255,255,255,0.04)"}}>
                {view==="summary"&&(
                  <div>
                    <div style={{fontSize:12,color:"#7986cb",marginBottom:10}}>
                      📍 Linha: <strong style={{color:"#ffd700"}}>{log.linha}</strong> &nbsp;|&nbsp;
                      Impacto: <strong style={{color:log.impact==="high"?"#ff1744":log.impact==="medium"?"#ffc107":"#00e676"}}>{log.impact}</strong> &nbsp;|&nbsp;
                      Categoria: <strong style={{color:"#a855f7"}}>{log.category}</strong>
                    </div>
                    <div style={{background:"#010115",border:"1px solid #1a1a40",borderRadius:6,padding:"12px 14px"}}>
                      <div style={{fontSize:10,color:"#00e5ff",fontFamily:"Orbitron,sans-serif",letterSpacing:1,marginBottom:8}}>💡 FEEDBACK PEDAGÓGICO</div>
                      <pre style={{fontFamily:"Share Tech Mono",fontSize:12,color:"#9ecef0",margin:0,whiteSpace:"pre-wrap",lineHeight:1.7}}>{log.feedback}</pre>
                    </div>
                  </div>
                )}
                {view==="technical"&&(
                  <pre style={{fontFamily:"Share Tech Mono",fontSize:11,color:"#7986cb",margin:0,whiteSpace:"pre-wrap",lineHeight:1.7}}>{log.technical}</pre>
                )}
                {view==="json"&&(
                  <pre style={{fontFamily:"Share Tech Mono",fontSize:11,color:"#9ecef0",margin:0}}>{log.json}</pre>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   COMPONENTE: SimulatorPage
   ============================================================ */
function SimulatorPage({challenge,onChangeChallenge,username}) {
  const [html,setHtml]=useState(challenge.starter_html);
  const [css,setCss]=useState(challenge.starter_css);
  const [logs,setLogs]=useState([]);
  const [showLogs,setShowLogs]=useState(false);
  const [preview,setPreview]=useState("");
  const [auto,setAuto]=useState(true);
  const [editorTab,setEditorTab]=useState("html");
  const [saved,setSaved]=useState(false);
  const [validated,setValidated]=useState(false);
  const [tip,setTip]=useState({visible:false,idx:0,timeLeft:60,cooldown:false,cooldownLeft:0});
  const tipTimer=useRef(null);
  const coolTimer=useRef(null);

  const run=useCallback(()=>setPreview(buildPreview(html,css)),[html,css]);

  useEffect(()=>{
    if(auto){const t=setTimeout(run,700);return()=>clearTimeout(t);}
  },[html,css,auto,run]);

  useEffect(()=>{run();},[]);

  useEffect(()=>{
    setHtml(challenge.starter_html);
    setCss(challenge.starter_css);
    setLogs([]);setShowLogs(false);setValidated(false);
  },[challenge]);

  const validate=()=>{
    const he=validateHTML(html,challenge.id,username);
    const ce=validateCSS(css,challenge.id,username);
    const all=[...he,...ce];
    if(all.length===0){
      setLogs([{id:"ok_"+Date.now(),level:"OK",modulo:"validator",summary:"[✅] Código válido! Nenhum erro encontrado.",
        feedback:"Parabéns! Seu código passou em todas as verificações! 🎉\nContinue assim, você está dominando o HTML/CSS ninja!",
        technical:`[${new Date().toLocaleString("pt-BR")}] [OK] [validator] - Exercício ${challenge.id} | Usuário ${username} | Validação completa. 0 erros encontrados.`,
        json:'{\n  "status": "ok",\n  "errors": 0,\n  "message": "Código válido"\n}',
        linha:"-",category:"-",impact:"-"}]);
    }else{setLogs(all);}
    setShowLogs(true);setValidated(true);
  };

  const handleSave=()=>{
    exportProject(html,css,challenge.title);
    setSaved(true);setTimeout(()=>setSaved(false),2000);
  };

  const showTip=()=>{
    if(tip.cooldown||tip.visible)return;
    setTip(p=>({...p,visible:true,timeLeft:60}));
    tipTimer.current=setInterval(()=>{
      setTip(p=>{
        if(p.timeLeft<=1){
          clearInterval(tipTimer.current);
          startCooldown((p.idx+1)%challenge.tips.length);
          return{...p,visible:false,timeLeft:0};
        }
        return{...p,timeLeft:p.timeLeft-1};
      });
    },1000);
  };

  const closeTip=()=>{
    clearInterval(tipTimer.current);
    setTip(p=>{
      const next=(p.idx+1)%challenge.tips.length;
      startCooldown(next);
      return{...p,visible:false,timeLeft:0};
    });
  };

  const startCooldown=(nextIdx)=>{
    setTip(p=>({...p,cooldown:true,cooldownLeft:120,idx:nextIdx}));
    coolTimer.current=setInterval(()=>{
      setTip(p=>{
        if(p.cooldownLeft<=1){clearInterval(coolTimer.current);return{...p,cooldown:false,cooldownLeft:0};}
        return{...p,cooldownLeft:p.cooldownLeft-1};
      });
    },1000);
  };

  useEffect(()=>()=>{clearInterval(tipTimer.current);clearInterval(coolTimer.current);},[]);

  const getLines=code=>code.split("\n").map((_,i)=>i+1).join("\n");
  const handleTab=(e,setter,code)=>{
    if(e.key==="Tab"){
      e.preventDefault();
      const s=e.target.selectionStart;
      setter(code.substring(0,s)+"  "+code.substring(e.target.selectionEnd));
      setTimeout(()=>{e.target.selectionStart=e.target.selectionEnd=s+2;},0);
    }
  };

  const errCount=logs.filter(l=>l.level==="ERROR").length;
  const warnCount=logs.filter(l=>l.level==="WARN").length;
  const hasIssues=errCount>0||warnCount>0;

  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 57px)",background:"#030310",overflow:"hidden"}}>
      {tip.visible&&<TipModal tip={challenge.tips[tip.idx]} tipIdx={tip.idx} total={challenge.tips.length} timeLeft={tip.timeLeft} onClose={closeTip}/>}

      {/* Toolbar */}
      <div style={{padding:"7px 14px",background:"#04040f",borderBottom:"1px solid #1a1a40",display:"flex",alignItems:"center",gap:7,flexWrap:"wrap",flexShrink:0}}>
        <select value={challenge.id} onChange={e=>onChangeChallenge(CHALLENGES.find(c=>c.id===e.target.value))}
          style={{background:"#080820",color:"#e2e8f0",border:"1px solid #1a1a40",borderRadius:6,padding:"6px 10px",fontSize:12,fontFamily:"Nunito,sans-serif",cursor:"pointer",maxWidth:220}}>
          {CHALLENGES.map(c=><option key={c.id} value={c.id}>{c.icon} {c.id}: {c.title}</option>)}
        </select>
        <div style={{flex:1}}></div>
        <button className="btn-s" onClick={showTip} disabled={tip.cooldown||tip.visible}
          style={{borderColor:tip.cooldown?"#2a2a5a":tip.visible?"#ffd700":"#00e5ff",color:tip.cooldown?"#2a2a5a":tip.visible?"#ffd700":"#00e5ff",minWidth:90}}>
          {tip.cooldown?`⏳ ${Math.floor(tip.cooldownLeft/60)}:${String(tip.cooldownLeft%60).padStart(2,"0")}`:tip.visible?"👁 Mostrando...":"💡 Dica"}
        </button>
        <button onClick={()=>setAuto(!auto)}
          style={{background:auto?"rgba(0,230,118,0.08)":"transparent",border:`1px solid ${auto?"#00e676":"#1a1a40"}`,color:auto?"#00e676":"#2a2a5a",padding:"6px 12px",borderRadius:6,cursor:"pointer",fontSize:10,fontFamily:"Orbitron,sans-serif",letterSpacing:1}}>
          {auto?"⚡ AUTO":"⏸ MANUAL"}
        </button>
        <button className="btn-s" onClick={run} style={{minWidth:60}}>▶ RUN</button>
        <button onClick={validate}
          style={{padding:"7px 14px",background:validated&&!hasIssues?"rgba(0,230,118,0.08)":validated&&hasIssues?"rgba(255,193,7,0.08)":"transparent",border:`1px solid ${validated&&!hasIssues?"#00e676":validated&&hasIssues?"#ffc107":"#ffc107"}`,color:validated&&!hasIssues?"#00e676":"#ffc107",borderRadius:6,cursor:"pointer",fontSize:10,fontFamily:"Orbitron,sans-serif",letterSpacing:1,minWidth:80}}>
          🔍 VALIDAR
        </button>
        <button onClick={handleSave}
          style={{padding:"7px 14px",background:saved?"rgba(0,230,118,0.12)":"transparent",border:`1px solid ${saved?"#00e676":"#00e676"}`,color:saved?"#00e676":"#00e676",borderRadius:6,cursor:"pointer",fontSize:10,fontFamily:"Orbitron,sans-serif",letterSpacing:1,transition:"all 0.2s",minWidth:80}}>
          {saved?"✅ SALVO!":"💾 SALVAR"}
        </button>
        <button onClick={()=>setShowLogs(!showLogs)}
          style={{padding:"7px 14px",background:hasIssues&&showLogs?"rgba(255,193,7,0.08)":"transparent",border:`1px solid ${hasIssues?"#ffc107":logs.length===1&&logs[0]?.level==="OK"?"#00e676":"#1a1a40"}`,color:hasIssues?"#ffc107":logs.length===1&&logs[0]?.level==="OK"?"#00e676":"#2a2a5a",borderRadius:6,cursor:"pointer",fontSize:10,fontFamily:"Orbitron,sans-serif",letterSpacing:1,position:"relative"}}>
          🖥 LOGS {logs.length>0&&`(${logs.length})`}
          {hasIssues&&<span style={{position:"absolute",top:-3,right:-3,width:8,height:8,background:"#ffc107",borderRadius:"50%",animation:"ping 1s cubic-bezier(0,0,.2,1) infinite"}}></span>}
        </button>
      </div>

      {/* Challenge info bar */}
      <div style={{padding:"5px 14px",background:"rgba(8,8,28,0.9)",borderBottom:"1px solid #1a1a40",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",flexShrink:0}}>
        <span style={{fontSize:16}}>{challenge.icon}</span>
        <span style={{fontFamily:"Orbitron,sans-serif",fontSize:10,color:challenge.color}}>{challenge.id}</span>
        <span style={{fontWeight:800,fontSize:13,color:"#e2e8f0"}}>{challenge.title}</span>
        <DiffBadge diff={challenge.difficulty} cls={challenge.diffClass}/>
        <span style={{fontSize:12,color:"#3a3a60",flex:1}}>🎯 {challenge.objective}</span>
        <span style={{fontSize:12,color:"#ffd700",fontWeight:700}}>+{challenge.xp} XP</span>
        <span style={{fontSize:10,color:"#2a2a5a",fontFamily:"Orbitron,sans-serif"}}>👤 {username}</span>
      </div>

      {/* Main area */}
      <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 1fr",overflow:"hidden",minHeight:0}}>

        {/* Editor side */}
        <div style={{display:"flex",flexDirection:"column",borderRight:"1px solid #1a1a40",overflow:"hidden"}}>
          <div style={{display:"flex",background:"#04040f",borderBottom:"1px solid #1a1a40",flexShrink:0}}>
            {[["html","📄 HTML","#ff9f1c"],["css","🎨 CSS","#00e5ff"]].map(([id,label,color])=>(
              <button key={id} onClick={()=>setEditorTab(id)}
                style={{padding:"8px 20px",background:editorTab===id?"#030310":"transparent",border:"none",borderBottom:`2px solid ${editorTab===id?color:"transparent"}`,color:editorTab===id?color:"#2a2a5a",cursor:"pointer",fontFamily:"Orbitron,sans-serif",fontSize:10,fontWeight:700,transition:"all 0.15s"}}>
                {label}
              </button>
            ))}
            <div style={{flex:1}}></div>
            <span style={{fontSize:10,color:"#1a1a40",padding:"0 12px",lineHeight:"34px",fontFamily:"Share Tech Mono"}}>
              {(editorTab==="html"?html:css).split("\n").length} linhas
            </span>
          </div>
          <div className="editor-wrap" style={{flex:1,overflow:"hidden"}}>
            <div className="line-numbers" style={{overflowY:"hidden",height:"100%",flexShrink:0}}>
              <pre style={{fontFamily:"Share Tech Mono",fontSize:13,lineHeight:1.65,margin:0}}>{getLines(editorTab==="html"?html:css)}</pre>
            </div>
            {editorTab==="html"?(
              <textarea className="code-editor" value={html} spellCheck={false} onChange={e=>setHtml(e.target.value)} onKeyDown={e=>handleTab(e,setHtml,html)}/>
            ):(
              <textarea className="code-editor" value={css} spellCheck={false} onChange={e=>setCss(e.target.value)} onKeyDown={e=>handleTab(e,setCss,css)} style={{color:"#b8ffc4"}}/>
            )}
          </div>
        </div>

        {/* Preview side */}
        <div style={{display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"5px 12px",background:"#04040f",borderBottom:"1px solid #1a1a40",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
            <div style={{display:"flex",gap:5}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:"#ff1744"}}></div>
              <div style={{width:10,height:10,borderRadius:"50%",background:"#ffc107"}}></div>
              <div style={{width:10,height:10,borderRadius:"50%",background:"#00e676"}}></div>
            </div>
            <span style={{fontFamily:"Orbitron,sans-serif",fontSize:10,color:"#2a2a5a",letterSpacing:2}}>PREVIEW</span>
            {auto&&<span style={{fontSize:10,color:"#00e676",marginLeft:"auto"}}>● LIVE</span>}
          </div>
          <iframe srcDoc={preview} sandbox="allow-scripts allow-same-origin" style={{flex:1,border:"none",background:"white"}} title="Preview ao vivo"/>
        </div>
      </div>

      {/* Log panel */}
      {showLogs&&<LogPanel logs={logs} onClear={()=>setLogs([])}/>}
    </div>
  );
}

/* ============================================================
   APP PRINCIPAL
   ============================================================ */
export default function App() {
  useEffect(()=>{ injectStyles(); },[]);
  const [page,setPage]=useState("home");
  const [challenge,setChallenge]=useState(CHALLENGES[0]);
  const [username]=useState(`Aluno${Math.floor(Math.random()*900+100)}`);
  const handleSelect=c=>{setChallenge(c);setPage("simulator");};
  const handleChange=c=>setChallenge(c);
  return (
    <div style={{minHeight:"100vh",background:"var(--bg)"}}>
      <NavBar page={page} setPage={setPage}/>
      {page==="home"&&<HomePage setPage={setPage}/>}
      {page==="learn"&&<LearnPage/>}
      {page==="challenges"&&<ChallengesPage onSelect={handleSelect}/>}
      {page==="simulator"&&<SimulatorPage challenge={challenge} onChangeChallenge={handleChange} username={username}/>}
    </div>
  );
}
