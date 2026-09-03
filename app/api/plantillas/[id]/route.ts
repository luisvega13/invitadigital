import {revalidatePath} from "next/cache";
import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireAdmin} from "@/lib/admin";
import {templateSchema} from "@/lib/validations";

export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
  const denied=await requireAdmin();if(denied)return denied;const {id}=await params;
  const current=await prisma.template.findUnique({where:{id},select:{slug:true}});if(!current)return NextResponse.json({error:"Plantilla no encontrada"},{status:404});
  const parsed=templateSchema.partial().safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:parsed.error.issues[0]?.message||"Datos no válidos"},{status:400});
  const data=parsed.data;
  try{const item=await prisma.template.update({where:{id},data:{...data,demoUrl:data.demoUrl===""?null:data.demoUrl,whatsappMessage:data.whatsappMessage===""?null:data.whatsappMessage,previousPrice:data.previousPrice===0?null:data.previousPrice}});revalidatePath("/");revalidatePath("/plantillas");revalidatePath(`/plantillas/${current.slug}`);revalidatePath(`/plantillas/${item.slug}`);revalidatePath("/sitemap.xml");return NextResponse.json({ok:true})}catch(error){console.error(error);return NextResponse.json({error:"No se pudo actualizar. Revisa que el slug no esté repetido."},{status:409})}
}

export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){const denied=await requireAdmin();if(denied)return denied;const {id}=await params;const current=await prisma.template.findUnique({where:{id},select:{slug:true}});if(!current)return NextResponse.json({error:"Plantilla no encontrada"},{status:404});await prisma.template.delete({where:{id}});revalidatePath("/");revalidatePath("/plantillas");revalidatePath(`/plantillas/${current.slug}`);revalidatePath("/sitemap.xml");return NextResponse.json({ok:true})}
