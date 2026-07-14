import { contentStore, readJson, escapeHtml, safeJson, stripHtml, formatDateFr, absoluteUrl } from "./_cms-utils.mjs";

const base = "https://amberatlas.solar";

function header(active = "") {
  return `<header class="nav-wrap"><div class="container nav"><a class="brand" href="/" aria-label="Amber Atlas"><img alt="Amber Atlas logo" src="/logo.png"><div class="brand-title">Amber Atlas</div></a><div class="nav-right"><nav class="nav-links" aria-label="Navigation principale"><a href="/#top">À propos</a><a href="/#oferta">Offre</a><a href="/#branze">Secteurs</a><a href="/#realizacje">Solutions</a><a class="${active === "conseils" ? "calculator-link" : ""}" href="/conseils/">Conseils</a><a class="${active === "faq" ? "calculator-link" : ""}" href="/faq-photovoltaique-maroc/">FAQ</a><a class="calculator-link" href="/calculator/">Calculateur solaire</a><a href="/#kontakt">Contact</a></nav><div class="lang-switcher"><a class="lang-btn active" href="/" lang="fr">FR</a><a class="lang-btn" href="/ar/" lang="ar">AR</a><a class="lang-btn" href="/en/" lang="en">EN</a><a class="lang-btn" href="/pl/" lang="pl">PL</a></div></div></div></header>`;
}

function footer() {
  return `<footer><div class="container footer-inner"><div class="footer-copy">© Amber Atlas · Copyright 2026</div><div class="footer-links"><a href="/conseils/">Conseils</a><a href="/faq-photovoltaique-maroc/">FAQ</a></div><a class="footer-login" href="/admin/">Connexion</a></div></footer>`;
}

function page({
  title,
  description,
  canonical,
  body,
  schema,
  active = "",
  ogType = "website",
  ogImage = `${base}/logo.png`,
  articlePublishedTime = "",
  articleModifiedTime = "",
  extraScripts = ""
}) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><link rel="canonical" href="${escapeHtml(canonical)}"><meta property="og:type" content="${escapeHtml(ogType)}"><meta property="og:site_name" content="Amber Atlas"><meta property="og:locale" content="fr_MA"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${escapeHtml(canonical)}"><meta property="og:image" content="${escapeHtml(ogImage)}"><meta property="og:image:secure_url" content="${escapeHtml(ogImage)}">${articlePublishedTime ? `<meta property="article:published_time" content="${escapeHtml(articlePublishedTime)}">` : ""}${articleModifiedTime ? `<meta property="article:modified_time" content="${escapeHtml(articleModifiedTime)}">` : ""}<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(description)}"><meta name="twitter:image" content="${escapeHtml(ogImage)}"><meta name="theme-color" content="#0d1726"><link rel="icon" type="image/png" href="/logo.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="/assets/css/amber-atlas-premium.css"><link rel="stylesheet" href="/assets/css/content-hub.css">${schema ? `<script type="application/ld+json">${safeJson(schema)}</script>` : ""}</head><body class="lang-fr content-hub-page">${header(active)}${body}${footer()}${extraScripts}</body></html>`;
}

function icon(name) {
  const icons = {
    facebook: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.2 8.25V6.7c0-.72.48-.88.82-.88h2.08V2.14L14.23 2C10.9 2 9.76 3.98 9.76 6.42v1.83H7v4.1h2.76V22h4.44v-9.65h2.95l.47-4.1H14.2Z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.25 2h9.5A5.25 5.25 0 0 1 22 7.25v9.5A5.25 5.25 0 0 1 16.75 22h-9.5A5.25 5.25 0 0 1 2 16.75v-9.5A5.25 5.25 0 0 1 7.25 2Zm0 2A3.25 3.25 0 0 0 4 7.25v9.5A3.25 3.25 0 0 0 7.25 20h9.5A3.25 3.25 0 0 0 20 16.75v-9.5A3.25 3.25 0 0 0 16.75 4h-9.5Zm10.1 1.45a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>`,
    tiktok: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.7 2c.18 1.56 1.06 2.82 2.38 3.68A6.13 6.13 0 0 0 21 6.6v3.87a9.7 9.7 0 0 1-5.3-1.55v7.02A6.07 6.07 0 1 1 10.46 9.9v3.92a2.3 2.3 0 1 0 1.3 2.08V2h3.94Z"/></svg>`,
    share: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 16a3 3 0 0 0-2.4 1.2l-6.74-3.37c.09-.27.14-.55.14-.83s-.05-.56-.14-.83L15.6 8.8A3 3 0 1 0 15 7a3 3 0 0 0 .14.9L8.4 11.27a3 3 0 1 0 0 3.46l6.74 3.37A3 3 0 1 0 18 16Z"/></svg>`,
    copy: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7V4.75A2.75 2.75 0 0 1 10.75 2h7.5A2.75 2.75 0 0 1 21 4.75v7.5A2.75 2.75 0 0 1 18.25 15H16v2.25A2.75 2.75 0 0 1 13.25 20h-7.5A2.75 2.75 0 0 1 3 17.25v-7.5A2.75 2.75 0 0 1 5.75 7H8Zm2 0h3.25A2.75 2.75 0 0 1 16 9.75V13h2.25c.41 0 .75-.34.75-.75v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0-.75.75V7Zm-4.25 2a.75.75 0 0 0-.75.75v7.5c0 .41.34.75.75.75h7.5c.41 0 .75-.34.75-.75v-7.5a.75.75 0 0 0-.75-.75h-7.5Z"/></svg>`
  };
  return icons[name] || "";
}

function sharePanel(canonical) {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonical)}`;

  return `<aside class="article-share" aria-labelledby="share-title">
    <div class="article-share-heading">
      <div>
        <div class="kicker">Réseaux sociaux</div>
        <h2 id="share-title">Partager cet article</h2>
        <p>Transmettez ce guide à une personne qui prépare un projet photovoltaïque au Maroc.</p>
      </div>
    </div>
    <div class="article-share-buttons">
      <a class="share-button share-facebook" href="${facebookUrl}" target="_blank" rel="noopener noreferrer" aria-label="Partager sur Facebook">
        ${icon("facebook")}<span>Facebook</span>
      </a>
      <button class="share-button share-instagram" type="button" data-share-action="instagram" aria-label="Partager via Instagram">
        ${icon("instagram")}<span>Instagram</span>
      </button>
      <button class="share-button share-tiktok" type="button" data-share-action="tiktok" aria-label="Partager via TikTok">
        ${icon("tiktok")}<span>TikTok</span>
      </button>
      <button class="share-button share-native" type="button" data-share-action="native" aria-label="Ouvrir le menu de partage">
        ${icon("share")}<span>Partager</span>
      </button>
      <button class="share-button share-copy" type="button" data-share-action="copy" aria-label="Copier le lien">
        ${icon("copy")}<span>Copier le lien</span>
      </button>
    </div>
    <div class="share-toast" data-share-toast role="status" aria-live="polite"></div>
  </aside>`;
}

function shareScript() {
  return `<script>
  (() => {
    const toast = document.querySelector("[data-share-toast]");
    if (!toast) return;

    const title = document.querySelector("h1")?.textContent?.trim() || document.title;
    const description = document.querySelector('meta[name="description"]')?.content || "";
    const url = window.location.href;

    let toastTimer;
    const showToast = (message) => {
      toast.textContent = message;
      toast.classList.add("is-visible");
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
    };

    const fallbackCopy = () => {
      const input = document.createElement("textarea");
      input.value = url;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    };

    const copyLink = async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(url);
        } else {
          fallbackCopy();
        }
        return true;
      } catch {
        try {
          fallbackCopy();
          return true;
        } catch {
          return false;
        }
      }
    };

    const nativeShare = async (source) => {
      if (navigator.share) {
        try {
          await navigator.share({ title, text: description, url });
          showToast("Merci pour le partage.");
          return;
        } catch (error) {
          if (error && error.name === "AbortError") return;
        }
      }

      const copied = await copyLink();
      const destinations = {
        instagram: "https://www.instagram.com/",
        tiktok: "https://www.tiktok.com/"
      };

      if (destinations[source]) {
        window.open(destinations[source], "_blank", "noopener,noreferrer");
      }

      showToast(
        copied
          ? "Lien copié. Ouvrez l’application choisie et collez-le dans votre publication."
          : "Copiez l’adresse de cette page depuis la barre du navigateur."
      );
    };

    document.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-share-action]");
      if (!button) return;

      const action = button.dataset.shareAction;

      if (action === "copy") {
        const copied = await copyLink();
        showToast(copied ? "Lien copié dans le presse-papiers." : "Impossible de copier automatiquement le lien.");
        return;
      }

      await nativeShare(action);
    });
  })();
  </script>`;
}

async function conseilsIndex(store) {
  const items = (await readJson(store, "articles/index.json", []))
    .filter(x => x.status === "published")
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));

  const cards = items.length
    ? `<div class="content-grid">${items.map(x => `<article class="article-card">${x.imageUrl ? `<a class="article-card-media" href="/conseils/${encodeURIComponent(x.slug)}/"><img src="${escapeHtml(x.imageUrl)}" alt="${escapeHtml(x.imageAlt || x.title)}" loading="lazy"></a>` : ""}<div class="article-card-body"><div class="article-meta"><span>${escapeHtml(formatDateFr(x.date))}</span><span>·</span><span>${escapeHtml(x.author || "Amber Atlas")}</span></div><h2><a href="/conseils/${encodeURIComponent(x.slug)}/">${escapeHtml(x.title)}</a></h2><p>${escapeHtml(x.excerpt || "")}</p><a class="article-card-link" href="/conseils/${encodeURIComponent(x.slug)}/">Lire l’article →</a></div></article>`).join("")}</div>`
    : `<div class="empty-state"><h2>Les premiers articles arrivent bientôt</h2><p>Nous préparons des analyses pratiques sur le photovoltaïque, le stockage d’énergie et la rentabilité des projets pour les entreprises au Maroc.</p></div>`;

  const body = `<main><section class="content-hero"><div class="container"><div class="kicker">Expertise Amber Atlas</div><h1>Conseils photovoltaïques pour les entreprises au Maroc</h1><p>Analyses, guides et réponses pratiques pour préparer un investissement solaire adapté à votre activité, votre consommation et votre localisation.</p></div></section><section class="content-main"><div class="container">${cards}<div class="cta-box content-cta"><div><h3>Vous préparez un projet photovoltaïque ?</h3><p>Utilisez notre calculateur ou contactez l’équipe Amber Atlas pour une première analyse de votre site.</p></div><div><a class="btn btn-primary" href="/calculator/">Calculateur solaire</a></div></div></div></section></main>`;

  return page({
    title: "Conseils photovoltaïques au Maroc | Amber Atlas",
    description: "Guides et analyses sur le photovoltaïque, le stockage d’énergie et l’autoconsommation pour les entreprises au Maroc.",
    canonical: `${base}/conseils/`,
    body,
    active: "conseils"
  });
}

async function articlePage(store, slug) {
  const item = await readJson(store, `articles/${slug}.json`, null);
  if (!item || item.status !== "published") return notFound();

  const canonical = `${base}/conseils/${encodeURIComponent(item.slug)}/`;
  const description = item.excerpt || stripHtml(item.content).slice(0, 230);
  const ogImage = item.imageUrl ? absoluteUrl(item.imageUrl) : `${base}/logo.png`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    description,
    datePublished: item.date,
    dateModified: item.updatedAt || item.date,
    mainEntityOfPage: canonical,
    author: { "@type": "Person", name: item.author || "Amber Atlas" },
    publisher: {
      "@type": "Organization",
      name: "Amber Atlas",
      logo: { "@type": "ImageObject", url: `${base}/logo.png` }
    },
    ...(item.imageUrl ? { image: absoluteUrl(item.imageUrl) } : {})
  };

  const body = `<main><section class="content-main"><article class="article-shell"><div class="breadcrumbs"><a href="/">Accueil</a> / <a href="/conseils/">Conseils</a> / ${escapeHtml(item.title)}</div><header class="article-header"><div class="kicker">Conseils Amber Atlas</div><h1>${escapeHtml(item.title)}</h1><div class="article-meta"><span>${escapeHtml(formatDateFr(item.date))}</span><span>·</span><span>${escapeHtml(item.author || "Amber Atlas")}</span></div>${description ? `<p class="article-lead">${escapeHtml(description)}</p>` : ""}</header>${item.imageUrl ? `<img class="article-cover" src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.imageAlt || item.title)}">` : ""}<div class="article-content">${item.content}</div>${sharePanel(canonical)}<div class="article-actions"><a class="btn btn-secondary" href="/conseils/">Tous les conseils</a><a class="btn btn-primary" href="/#kontakt">Parler de votre projet</a></div></article></section></main>`;

  return page({
    title: `${item.title} | Amber Atlas`,
    description,
    canonical,
    body,
    schema,
    active: "conseils",
    ogType: "article",
    ogImage,
    articlePublishedTime: item.date,
    articleModifiedTime: item.updatedAt || item.date,
    extraScripts: shareScript()
  });
}

async function faqPage(store) {
  const items = (await readJson(store, "faq/index.json", []))
    .filter(x => x.status === "published")
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const list = items.length
    ? `<div class="faq-list">${items.map((x, i) => `<details class="faq-item"${i === 0 ? " open" : ""}><summary>${escapeHtml(x.question)}</summary><div class="faq-answer">${x.answer}${x.imageUrl ? `<img class="faq-image" src="${escapeHtml(x.imageUrl)}" alt="${escapeHtml(x.imageAlt || x.question)}" loading="lazy">` : ""}</div></details>`).join("")}</div>`
    : `<div class="empty-state"><h2>La FAQ est en préparation</h2><p>Les réponses aux questions les plus fréquentes sur les installations photovoltaïques au Maroc seront publiées prochainement.</p></div>`;

  const schema = items.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map(x => ({
          "@type": "Question",
          name: x.question,
          acceptedAnswer: { "@type": "Answer", text: stripHtml(x.answer) }
        }))
      }
    : null;

  const body = `<main><section class="content-hero"><div class="container"><div class="kicker">Questions fréquentes</div><h1>FAQ sur le photovoltaïque au Maroc</h1><p>Des réponses claires aux questions des entreprises, hôtels, exploitations agricoles et sites industriels qui étudient un projet solaire.</p></div></section><section class="content-main"><div class="container">${list}<div class="cta-box content-cta"><div><h3>Vous n’avez pas trouvé votre réponse ?</h3><p>Décrivez votre projet à l’équipe Amber Atlas ou utilisez le calculateur solaire.</p></div><div><a class="btn btn-primary" href="/#kontakt">Nous contacter</a></div></div></div></section></main>`;

  return page({
    title: "FAQ photovoltaïque au Maroc | Amber Atlas",
    description: "Réponses aux questions fréquentes sur les panneaux solaires, l’autoconsommation, le stockage et les projets photovoltaïques au Maroc.",
    canonical: `${base}/faq-photovoltaique-maroc/`,
    body,
    schema,
    active: "faq"
  });
}

function notFound() {
  const body = `<main class="not-found"><div class="container"><div class="kicker">Erreur 404</div><h1>Article introuvable</h1><p class="section-sub">Cette publication n’existe pas ou n’est pas encore publiée.</p><div class="article-actions" style="justify-content:center"><a class="btn btn-primary" href="/conseils/">Retour aux conseils</a></div></div></main>`;

  return {
    html: page({
      title: "Article introuvable | Amber Atlas",
      description: "Article introuvable.",
      canonical: `${base}/conseils/`,
      body,
      active: "conseils"
    }),
    status: 404
  };
}

export default async (req) => {
  let path = new URL(req.url).pathname;
  if (!path.endsWith("/")) path += "/";
  path = path.replace(/\/{2,}/g, "/");

  const store = contentStore();
  let result;

  if (path === "/faq-photovoltaique-maroc/") {
    result = await faqPage(store);
  } else if (path === "/conseils/") {
    result = await conseilsIndex(store);
  } else {
    const match = path.match(/^\/conseils\/([^/]+)\/$/);
    result = match ? await articlePage(store, decodeURIComponent(match[1])) : notFound();
  }

  const status = typeof result === "object" ? result.status : 200;
  const html = typeof result === "object" ? result.html : result;

  return new Response(html, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
      "x-content-type-options": "nosniff"
    }
  });
};

export const config = {
  path: [
    "/conseils",
    "/conseils/",
    "/conseils/:slug",
    "/conseils/:slug/",
    "/faq-photovoltaique-maroc",
    "/faq-photovoltaique-maroc/"
  ]
};
