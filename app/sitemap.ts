import type {MetadataRoute} from "next";
import {projects} from "@/lib/data";
import {getPublicTemplates} from "@/lib/templates";
export const dynamic="force-dynamic";
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const base=process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000";const routes=["","/plantillas","/portafolio","/personalizada","/como-funciona","/contacto"];const templates=await getPublicTemplates();return[...routes.map(path=>({url:base+path,lastModified:new Date(),changeFrequency:"weekly" as const,priority:path===""?1:.8})),...templates.map(item=>({url:`${base}/plantillas/${item.slug}`,lastModified:new Date(),changeFrequency:"weekly" as const,priority:.7})),...projects.map(item=>({url:`${base}/portafolio/${item.slug}`,lastModified:new Date(),changeFrequency:"monthly" as const,priority:.6}))]}
