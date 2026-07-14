import crypto from "node:crypto";
import { json, requireSession, mediaStore } from "./_cms-utils.mjs";
const allowed={"image/jpeg":"jpg","image/png":"png","image/webp":"webp"};
export default async(req)=>{
  const denied=requireSession(req);if(denied)return denied;
  try{
    const form=await req.formData();const file=form.get("file");
    if(!(file instanceof File))return json({error:"Nie wybrano pliku."},400);
    if(!allowed[file.type])return json({error:"Dozwolone są tylko obrazy JPG, PNG i WEBP."},400);
    if(file.size>5*1024*1024)return json({error:"Grafika może mieć maksymalnie 5 MB."},400);
    const key=`${Date.now()}-${crypto.randomUUID()}.${allowed[file.type]}`;const store=mediaStore();
    await store.set(key,file,{metadata:{contentType:file.type,fileName:file.name,size:file.size,createdAt:new Date().toISOString()}});
    return json({ok:true,url:`/media/${key}`});
  }catch(err){console.error(err);return json({error:"Nie udało się przesłać grafiki."},500)}
};
export const config={path:"/api/cms/upload",method:"POST"};
