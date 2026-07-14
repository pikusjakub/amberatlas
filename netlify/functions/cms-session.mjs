import { json, getSession } from "./_cms-utils.mjs";
export default async (req)=>json({authenticated:Boolean(getSession(req))});
export const config={path:"/api/cms/session",method:"GET"};
