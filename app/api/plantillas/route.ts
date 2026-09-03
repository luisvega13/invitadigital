import {revalidatePath} from "next/cache";
import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireAdmin} from "@/lib/admin";
import {templateSchema} from "@/lib/validations";

export async function GET(){const denied=await requireAdmin();if(denied)return denied;const data=await prisma.template.findMany({include:{category:true},orderBy:{createdAt:"desc"}});return NextResponse.json(data)}

export async function POST(request:Request){
  const denied=await requireAdmin();if(denied)return denied;
  const parsed=templateSchema.safeParse(await request.json());
  if(!parsed.success)return NextResponse.json({error:parsed.error.issues[0]?.message||"Datos no válidos"},{status:400});
  const data=parsed.data;
  try{
    const item=await prisma.template.create({data:{...data,demoUrl:data.demoUrl||null,whatsappMessage:data.whatsappMessage||null,previousPrice:data.previousPrice||null}});
    revalidatePath("/");revalidatePath("/plantillas");revalidatePath("/sitemap.xml");
    return NextResponse.json({ok:true,id:item.id},{status:201});
  }catch(error){console.error(error);return NextResponse.json({error:"No se pudo crear. Revisa que el slug no esté repetido."},{status:409})}
}
