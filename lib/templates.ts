import "server-only";
import {unstable_cache} from "next/cache";
import {prisma} from "@/lib/prisma";
import type {TemplateItem} from "@/types";

function toPublicTemplate(row:{id:string;name:string;slug:string;shortDescription:string;description:string;style:string;price:unknown;previousPrice:unknown;coverImage:string;images:string[];demoUrl:string|null;whatsappMessage:string|null;features:string[];isFeatured:boolean;isPopular:boolean;isNew:boolean;active:boolean;views:number;category:{name:string}}):TemplateItem{return{id:row.id,name:row.name,slug:row.slug,shortDescription:row.shortDescription,description:row.description,category:row.category.name,style:row.style,price:Number(row.price),previousPrice:row.previousPrice===null?null:Number(row.previousPrice),coverImage:row.coverImage,images:row.images,demoUrl:row.demoUrl||"#",whatsappMessage:row.whatsappMessage,features:row.features,isFeatured:row.isFeatured,isPopular:row.isPopular,isNew:row.isNew,active:row.active,views:row.views}}

const getCachedPublicTemplates=unstable_cache(async()=>{
  const rows=await prisma.template.findMany({where:{active:true},include:{category:{select:{name:true}}},orderBy:{createdAt:"desc"}});
  return rows.map(toPublicTemplate);
},["public-templates"],{revalidate:300,tags:["public-templates"]});

const getCachedPublicTemplateBySlug=unstable_cache(async(slug:string)=>{
  const row=await prisma.template.findFirst({where:{slug,active:true},include:{category:{select:{name:true}}}});
  return row?toPublicTemplate(row):null;
},["public-template-by-slug"],{revalidate:300,tags:["public-templates"]});

export async function getPublicTemplates(){return getCachedPublicTemplates()}
export async function getPublicTemplateBySlug(slug:string){return getCachedPublicTemplateBySlug(slug)}
