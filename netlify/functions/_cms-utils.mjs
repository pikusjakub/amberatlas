import crypto from "node:crypto";
import sanitizeHtml from "sanitize-html";
import { getStore } from "@netlify/blobs";

export const COOKIE_NAME = "aa_cms_session";
export const CONTENT_STORE = "amber-atlas-content";
export const MEDIA_STORE = "amber-atlas-media";

export const contentStore = () => getStore(CONTENT_STORE);
export const mediaStore = () => getStore(MEDIA_STORE);

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), { status, headers: { "content-type":"application/json; charset=utf-8", "cache-control":"no-store", ...extraHeaders } });
}
export function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]));
}
export function safeJson(value) { return JSON.stringify(value).replace(/</g,"\\u003c"); }
export function slugify(value = "") {
  return String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,120);
}
export function sanitizeRich(value = "") {
  return sanitizeHtml(String(value), {
    allowedTags:["p","br","h2","h3","h4","strong","b","em","i","ul","ol","li","blockquote","a"],
    allowedAttributes:{a:["href","target","rel"]},
    allowedSchemes:["http","https","mailto"],
    transformTags:{a:(tagName,attrs)=>({tagName:"a",attribs:{...attrs,target:"_blank",rel:"noopener noreferrer"}})}
  }).trim();
}
export function stripHtml(value = "") { return sanitizeHtml(String(value),{allowedTags:[],allowedAttributes:{}}).replace(/\s+/g," ").trim(); }
export async function readJson(store, key, fallback) {
  const value = await store.get(key,{type:"json",consistency:"strong"});
  return value ?? fallback;
}
export async function writeJson(store,key,value) { return store.set(key,JSON.stringify(value),{metadata:{contentType:"application/json",updatedAt:new Date().toISOString()}}); }
export function adminUser() { return process.env.CMS_ADMIN_USER || "AmberAtlas"; }
export function configured() { return Boolean(process.env.CMS_ADMIN_PASSWORD); }
function secret() { return crypto.createHash("sha256").update(`amber-atlas-session:${process.env.CMS_ADMIN_PASSWORD || "not-configured"}`).digest(); }
function b64url(value) { return Buffer.from(value).toString("base64url"); }
function sign(value) { return crypto.createHmac("sha256",secret()).update(value).digest("base64url"); }
export function createToken(username) {
  const payload=b64url(JSON.stringify({u:username,exp:Date.now()+12*60*60*1000}));
  return `${payload}.${sign(payload)}`;
}
function parseCookies(header="") { return Object.fromEntries(header.split(";").map(x=>x.trim()).filter(Boolean).map(x=>{const i=x.indexOf("=");return i<0?[x,""]:[x.slice(0,i),decodeURIComponent(x.slice(i+1))]})); }
export function verifyToken(token="") {
  try {
    const [payload,sig]=String(token).split("."); if(!payload||!sig)return null;
    const expected=sign(payload); const a=Buffer.from(sig); const b=Buffer.from(expected); if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return null;
    const data=JSON.parse(Buffer.from(payload,"base64url").toString("utf8"));
    if(data.exp<Date.now()||data.u!==adminUser())return null; return data;
  } catch { return null; }
}
export function getSession(req) { const cookies=parseCookies(req.headers.get("cookie")||""); return verifyToken(cookies[COOKIE_NAME]); }
export function requireSession(req) { return getSession(req) ? null : json({error:"Sesja wygasła. Zaloguj się ponownie."},401); }
export function validLogin(username,password) {
  if(!configured()) return false;
  const expectedUser=Buffer.from(adminUser()); const gotUser=Buffer.from(String(username||""));
  const expectedPass=crypto.createHash("sha256").update(process.env.CMS_ADMIN_PASSWORD).digest();
  const gotPass=crypto.createHash("sha256").update(String(password||"")).digest();
  return expectedUser.length===gotUser.length && crypto.timingSafeEqual(expectedUser,gotUser) && crypto.timingSafeEqual(expectedPass,gotPass);
}
export function sessionCookie(token,maxAge=43200) { return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`; }
export function articleSummary(a) { return {slug:a.slug,title:a.title,excerpt:a.excerpt,author:a.author,date:a.date,status:a.status,imageUrl:a.imageUrl||"",imageAlt:a.imageAlt||"",updatedAt:a.updatedAt}; }
export function formatDateFr(value) { try { return new Intl.DateTimeFormat("fr-MA",{day:"numeric",month:"long",year:"numeric"}).format(new Date(`${value}T12:00:00Z`)); } catch { return value||""; } }
export function absoluteUrl(path="") { return path.startsWith("http")?path:`https://amberatlas.solar${path.startsWith("/")?path:`/${path}`}`; }
