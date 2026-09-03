import {Catalog} from "@/components/templates/catalog";
import {SectionTitle} from "@/components/ui/section-title";
import {getPublicTemplates} from "@/lib/templates";
export const dynamic="force-dynamic";
export const metadata={title:"Plantillas de invitaciones digitales",description:"Explora invitaciones digitales elegantes para bodas, XV años, cumpleaños y eventos especiales."};
export default async function TemplatesPage({searchParams}:{searchParams:Promise<{categoria?:string}>}){const [{categoria=""},items]=await Promise.all([searchParams,getPublicTemplates()]);return <section className="section-pad"><div className="container-site"><SectionTitle eyebrow="Catálogo" title="Encuentra tu diseño" copy="Filtra por ocasión o estilo. Cada plantilla se personaliza con la información y esencia de tu evento."/><Catalog items={items} initialCategory={categoria}/></div></section>}
