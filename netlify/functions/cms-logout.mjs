import { json, sessionCookie } from "./_cms-utils.mjs";
export default async ()=>json({ok:true},200,{"set-cookie":sessionCookie("",0)});
export const config={path:"/api/cms/logout",method:"POST"};
