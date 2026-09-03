export function formatPrice(value:number){return new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN",maximumFractionDigits:0}).format(value)}
export function cn(...parts:(string|false|null|undefined)[]){return parts.filter(Boolean).join(" ")}
