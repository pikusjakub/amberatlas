import { mediaStore } from "./_cms-utils.mjs";
export default async(req,context)=>{
  const key=String(context.params.key||"");if(!/^[a-zA-Z0-9._-]+$/.test(key))return new Response("Not found",{status:404});
  const entry=await mediaStore().getWithMetadata(key,{type:"blob",consistency:"strong"});if(!entry)return new Response("Not found",{status:404});
  return new Response(entry.data,{headers:{"content-type":entry.metadata?.contentType||"application/octet-stream","cache-control":"public, max-age=31536000, immutable","x-content-type-options":"nosniff"}});
};
export const config={path:"/media/:key",method:"GET"};
