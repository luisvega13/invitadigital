import {AdminHeader} from "@/components/admin/page-header";
import {TemplateManager,type AdminTemplate} from "@/components/admin/template-manager";
import {prisma} from "@/lib/prisma";
export const dynamic="force-dynamic";

export default async function TemplatesAdminPage(){
  const [rows,categories]=await Promise.all([prisma.template.findMany({include:{category:{select:{name:true}}},orderBy:{createdAt:"desc"}}),prisma.category.findMany({where:{active:true},select:{id:true,name:true},orderBy:{name:"asc"}})]);
  const items:AdminTemplate[]=rows.map(row=>({id:row.id,name:row.name,slug:row.slug,shortDescription:row.shortDescription,description:row.description,categoryId:row.categoryId,categoryName:row.category.name,style:row.style,price:Number(row.price),previousPrice:row.previousPrice===null?null:Number(row.previousPrice),coverImage:row.coverImage,images:row.images,demoUrl:row.demoUrl||"",whatsappMessage:row.whatsappMessage||"",features:row.features,isFeatured:row.isFeatured,isPopular:row.isPopular,isNew:row.isNew,active:row.active}));
  return <><AdminHeader title="Plantillas" copy="Crea, edita, publica y administra el catálogo desde un solo lugar."/><TemplateManager items={items} categories={categories}/></>
}
