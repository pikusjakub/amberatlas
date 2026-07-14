import crypto from "node:crypto";
import { json, requireSession, contentStore, readJson, writeJson, slugify, sanitizeRich, stripHtml, articleSummary } from "./_cms-utils.mjs";

export default async (req,context)=>{
  const denied=requireSession(req); if(denied)return denied;
  const store=contentStore(); const type=context.params.type; const id=context.params.id;
  try{
    if(type==="articles") return await articles(req,store,id);
    if(type==="faq") return await faq(req,store,id);
    return json({error:"Nieznany typ treści."},404);
  }catch(err){console.error(err);return json({error:"Nie udało się zapisać danych. Spróbuj ponownie."},500)}
};

async function articles(req,store,slug){
  let index=await readJson(store,"articles/index.json",[]);
  if(req.method==="GET"){
    if(slug){const item=await readJson(store,`articles/${slug}.json`,null);return item?json({item}):json({error:"Nie znaleziono artykułu."},404)}
    return json({items:index.sort((a,b)=>String(b.date||"").localeCompare(String(a.date||"")))});
  }
  if(req.method==="POST"){
    const body=await req.json(); const title=String(body.title||"").trim(); const content=sanitizeRich(body.content||"");
    const newSlug=slugify(body.slug||title); if(!title||!newSlug||!stripHtml(content))return json({error:"Tytuł, slug i treść artykułu są wymagane."},400);
    const oldSlug=slugify(body.originalSlug||"");
    const now=new Date().toISOString(); const date=/^\d{4}-\d{2}-\d{2}$/.test(body.date||"")?body.date:now.slice(0,10);
    const item={slug:newSlug,title:title.slice(0,140),excerpt:String(body.excerpt||stripHtml(content).slice(0,230)).trim().slice(0,320),author:String(body.author||"Amber Atlas").trim().slice(0,80),date,status:body.status==="published"?"published":"draft",imageUrl:String(body.imageUrl||"").startsWith("/media/")?String(body.imageUrl):"",imageAlt:String(body.imageAlt||"").trim().slice(0,180),content,createdAt:now,updatedAt:now};
    const existing=await readJson(store,`articles/${newSlug}.json`,null); if(existing)item.createdAt=existing.createdAt||now;
    await writeJson(store,`articles/${newSlug}.json`,item);
    if(oldSlug&&oldSlug!==newSlug)await store.delete(`articles/${oldSlug}.json`);
    index=index.filter(x=>x.slug!==newSlug&&x.slug!==oldSlug); index.push(articleSummary(item));
    await writeJson(store,"articles/index.json",index); return json({ok:true,item});
  }
  if(req.method==="DELETE"&&slug){await store.delete(`articles/${slug}.json`);index=index.filter(x=>x.slug!==slug);await writeJson(store,"articles/index.json",index);return json({ok:true})}
  return json({error:"Méthode non autorisée."},405);
}

async function faq(req,store,id){
  let items=await readJson(store,"faq/index.json",[]);
  if(req.method==="GET")return json({items:items.sort((a,b)=>(a.order||0)-(b.order||0))});
  if(req.method==="POST"){
    const body=await req.json(); const question=String(body.question||"").trim(); const answer=sanitizeRich(body.answer||"");
    if(!question||!stripHtml(answer))return json({error:"Pytanie i odpowiedź są wymagane."},400);
    const now=new Date().toISOString(); const item={id:String(body.id||crypto.randomUUID()),question:question.slice(0,220),answer,order:Number.isFinite(Number(body.order))?Number(body.order):items.length,status:body.status==="draft"?"draft":"published",imageUrl:String(body.imageUrl||"").startsWith("/media/")?String(body.imageUrl):"",imageAlt:String(body.imageAlt||"").trim().slice(0,180),updatedAt:now};
    const old=items.find(x=>x.id===item.id); item.createdAt=old?.createdAt||now; items=items.filter(x=>x.id!==item.id);items.push(item);await writeJson(store,"faq/index.json",items);return json({ok:true,item});
  }
  if(req.method==="DELETE"&&id){items=items.filter(x=>x.id!==id);await writeJson(store,"faq/index.json",items);return json({ok:true})}
  return json({error:"Méthode non autorisée."},405);
}
export const config={path:["/api/cms/content/:type","/api/cms/content/:type/:id"],method:["GET","POST","DELETE"]};
