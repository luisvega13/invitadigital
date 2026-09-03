import {Navbar} from "@/components/layout/navbar";import {Footer} from "@/components/layout/footer";import {WhatsAppFloating} from "@/components/layout/whatsapp-floating";
export default function PublicLayout({children}:{children:React.ReactNode}){return <><Navbar/><main>{children}</main><Footer/><WhatsAppFloating/></>}
