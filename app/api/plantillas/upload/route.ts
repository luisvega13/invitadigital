import {NextResponse} from "next/server";
import {requireAdmin} from "@/lib/admin";
import {uploadTemplateCover} from "@/lib/supabase-storage";

export async function POST(request:Request){
  const denied=await requireAdmin();if(denied)return denied;
  try{const form=await request.formData();const file=form.get("file");const slug=String(form.get("slug")||"");if(!(file instanceof File))return NextResponse.json({error:"Selecciona una imagen WebP"},{status:400});if(!/^[a-z0-9-]+$/.test(slug))return NextResponse.json({error:"Guarda un slug válido antes de subir"},{status:400});const url=await uploadTemplateCover(file,slug);return NextResponse.json({url})}catch(error){const message=error instanceof Error?error.message:"No fue posible subir la imagen";return NextResponse.json({error:message},{status:400})}
}
