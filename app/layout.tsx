import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
export const metadata:Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000"),title:{default:"INVITA DIGITAL | Invitaciones digitales para eventos",template:"%s | INVITA DIGITAL"},description:"Invitaciones digitales modernas y personalizadas para bodas, XV años, cumpleaños, baby showers, graduaciones y eventos especiales.",openGraph:{title:"INVITA DIGITAL",description:"Invitaciones que cuentan historias",type:"website",locale:"es_MX"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}<Toaster richColors position="top-center"/></body></html>}
