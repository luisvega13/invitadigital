import "server-only";
import {createClient} from "@supabase/supabase-js";

const bucket=process.env.SUPABASE_STORAGE_BUCKET||"invitaciones";

function adminClient(){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)throw new Error("Supabase Storage no está configurado. Agrega NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.");
  return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
}

export async function uploadTemplateCover(file:File,slug:string){
  if(file.type!=="image/webp")throw new Error("La portada debe estar en formato WebP.");
  if(file.size>5*1024*1024)throw new Error("La imagen no puede superar 5 MB.");
  const client=adminClient();
  const existing=await client.storage.getBucket(bucket);
  if(existing.error){
    const created=await client.storage.createBucket(bucket,{public:true,fileSizeLimit:5*1024*1024,allowedMimeTypes:["image/webp"]});
    if(created.error)throw new Error(`No se pudo preparar el bucket: ${created.error.message}`);
  }
  const safeSlug=slug.replace(/[^a-z0-9-]/g,"-");
  const path=`templates/${safeSlug}/${crypto.randomUUID()}.webp`;
  const bytes=await file.arrayBuffer();
  const uploaded=await client.storage.from(bucket).upload(path,bytes,{contentType:"image/webp",cacheControl:"31536000",upsert:false});
  if(uploaded.error)throw new Error(uploaded.error.message);
  return client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
