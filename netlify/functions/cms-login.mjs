import { json, configured, validLogin, adminUser, createToken, sessionCookie } from "./_cms-utils.mjs";
export default async (req) => {
  if(req.method!=="POST") return json({error:"Méthode non autorisée."},405);
  if(!configured()) return json({error:"Brak konfiguracji CMS_ADMIN_PASSWORD w Netlify."},503);
  let body; try{body=await req.json()}catch{return json({error:"Nieprawidłowe dane logowania."},400)}
  if(!validLogin(body.username,body.password)) return json({error:"Nieprawidłowy login lub hasło."},401);
  return json({ok:true,user:adminUser()},200,{"set-cookie":sessionCookie(createToken(adminUser()))});
};
export const config={path:"/api/cms/login",method:"POST"};
