import { contentStore, readJson, escapeHtml } from "./_cms-utils.mjs";
const base="https://amberatlas.solar";
const home=[["fr",`${base}/`],["ar",`${base}/ar/`],["en",`${base}/en/`],["pl",`${base}/pl/`]];
const calc=[["fr",`${base}/calculator/`],["ar",`${base}/ar/calculator/`],["en",`${base}/en/calculator/`],["pl",`${base}/pl/calculator/`]];
const industries=["solaire-hotels-maroc","photovoltaique-industriel-maroc","pompage-solaire-agricole-maroc","chambres-froides-solaires-maroc","stockage-energie-entreprises-maroc","solaire-entrepots-logistique-maroc","photovoltaique-maisons-maroc"].map(x=>`${base}/solutions/${x}/`);
const cities=["agadir","marrakech","taroudant","fes","casablanca","rabat","oujda","essaouira","errachidia","zagora","beni-mellal"].map(x=>`${base}/panneaux-solaires-${x}/`);
function u(loc,lastmod,alts=[]){return `<url><loc>${escapeHtml(loc)}</loc>${alts.map(([lang,href])=>`<xhtml:link rel="alternate" hreflang="${lang}" href="${escapeHtml(href)}"/>`).join("")}${lastmod?`<lastmod>${lastmod}</lastmod>`:""}</url>`}
export default async()=>{
 const rows=[];
 for(const [,loc] of home)rows.push(u(loc,null,[...home,["x-default",`${base}/`]]));
 for(const [,loc] of calc)rows.push(u(loc,null,[...calc,["x-default",`${base}/calculator/`]]));
 for(const loc of cities)rows.push(u(loc,null));
 rows.push(u(`${base}/solutions/`,null));
 for(const loc of industries)rows.push(u(loc,null));
 rows.push(u(`${base}/conseils/`,null));rows.push(u(`${base}/faq-photovoltaique-maroc/`,null));
 const articles=(await readJson(contentStore(),"articles/index.json",[])).filter(x=>x.status==="published");
 for(const a of articles)rows.push(u(`${base}/conseils/${encodeURIComponent(a.slug)}/`,/^\d{4}-\d{2}-\d{2}/.test(String(a.updatedAt||a.date||""))?(a.updatedAt||a.date).slice(0,10):null));
 const xml=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${rows.join("")}</urlset>`;
 return new Response(xml,{headers:{"content-type":"application/xml; charset=utf-8","cache-control":"public, max-age=300"}});
};
export const config={path:"/sitemap.xml",method:"GET"};
