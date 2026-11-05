import {PrismaClient} from "@prisma/client";

const globalForPrisma=globalThis as unknown as {prisma?:PrismaClient};

function pooledDatabaseUrl(){
  const value=process.env.DATABASE_URL;
  if(!value)return undefined;

  try{
    const url=new URL(value);
    const isSupabaseTransactionPooler=url.hostname.endsWith(".pooler.supabase.com")&&url.port==="6543";
    if(!isSupabaseTransactionPooler)return value;

    // Each Vercel instance owns its own Prisma pool. Keep that pool deliberately
    // small so a traffic burst cannot exhaust Supabase's shared transaction pool.
    if(!url.searchParams.has("pgbouncer"))url.searchParams.set("pgbouncer","true");
    if(!url.searchParams.has("connection_limit"))url.searchParams.set("connection_limit","1");
    if(!url.searchParams.has("connect_timeout"))url.searchParams.set("connect_timeout","10");
    if(!url.searchParams.has("pool_timeout"))url.searchParams.set("pool_timeout","10");
    return url.toString();
  }catch{
    return value;
  }
}

export const prisma=globalForPrisma.prisma??new PrismaClient({datasourceUrl:pooledDatabaseUrl()});
if(process.env.NODE_ENV!=="production")globalForPrisma.prisma=prisma;
