# Clivus — Site institucional

Site institucional completo para a **Clivus**, agência de criação de sites. Desenvolvido em HTML5, CSS3 e JavaScript puro (Vanilla JS), sem frameworks.

## 🚀 Como executar

Basta abrir o arquivo `index.html` diretamente no navegador — não há build, servidor ou dependências para instalar.

Para melhor experiência (evitar bloqueios de CORS em navegadores mais restritivos), você também pode servir a pasta localmente:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Depois acesse `http://localhost:8000`.

## 📁 Estrutura do projeto

```
clivus/
│── index.html
│── favicon.ico
│── README.md
│── /css
│     └── style.css
│── /js
│     └── script.js
│── /assets
│     ├── images
│     ├── icons
│     ├── logos        → ícone, lockup e favicons gerados a partir da logo enviada
│     └── mockups
│── /fonts
```

## 🎨 Identidade visual

| Token | Valor |
|---|---|
| Fundo | `#0F1115` |
| Branco | `#F8FAFC` |
| Azul principal | `#3B82F6` |
| Azul claro | `#60A5FA` |
| Cinza | `#6B7280` |
| Fonte de títulos | Space Grotesk |
| Fonte de texto | Inter |

## 🧩 Bibliotecas via CDN

- **GSAP + ScrollTrigger** — animações de entrada (fade + slide) e barra de progresso da timeline.
- **Swiper.js** — carrossel de depoimentos.
- **Lucide Icons** — ícones dos cards de serviços e diferenciais.

Nenhuma dessas bibliotecas é instalada localmente — são carregadas via `<script>` no `index.html`, então é necessário acesso à internet na primeira carga da página.

## ✨ Funcionalidades

- Header fixo com estado de scroll e menu mobile.
- Hero com mockup de notebook flutuante, brilho azul e parallax no mouse.
- Cursor customizado (desktop) com estado de hover em links e cards.
- Seção de serviços com 8 cards e ícones animados.
- Timeline do processo com barra de progresso animada no scroll.
- Portfólio com filtro por categoria, grid de 10 projetos fictícios e modal de detalhes (imagem, descrição, tecnologias e objetivo).
- Comparador "antes e depois" com slider arrastável.
- Seção de diferenciais, estatísticas com contadores animados.
- Carrossel de depoimentos (Swiper).
- FAQ em accordion.
- CTA final e rodapé completo com redes sociais e WhatsApp.
- Totalmente responsivo (mobile first) e com suporte a `prefers-reduced-motion`.

## 🔍 SEO básico implementado

- Meta tags de título, descrição e palavras-chave.
- Open Graph e Twitter Card.
- `link rel="canonical"`.
- Favicons em múltiplos tamanhos + `apple-touch-icon`.
- Estrutura semântica (`header`, `main`, `section`, `footer`, `article`).
- Hierarquia correta de headings (`h1` único na Hero, `h2` por seção).

## ✏️ Personalização rápida

- **WhatsApp e e-mail**: busque por `5511999999999` e `contato@clivus.com.br` em `index.html` e substitua pelos dados reais.
- **Projetos do portfólio**: edite o array `projects` no início da seção 10 de `js/script.js`.
- **Depoimentos**: edite os slides dentro de `.testimonials-swiper` em `index.html`.
- **Cores**: todos os tokens estão centralizados em `:root` no topo de `css/style.css`.

---

Desenvolvido com foco em performance, design e código limpo. © Clivus.
