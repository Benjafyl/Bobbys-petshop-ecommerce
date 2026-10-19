import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/instagram-icon";
import { instagramProfileUrl } from "@/lib/social";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#E5DED4] bg-[#243C3A] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-lg font-black">Bobby&apos;s Pet Shop</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-[#E5DED4]">
            Ropa para perros y collares para gatos. Explora las prendas y existencias
            disponibles mientras preparamos las opciones de compra.
          </p>
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#F9D36B]">
            Ayuda
          </p>
          <div className="mt-3 grid gap-2 text-sm text-[#E5DED4]">
            <Link href="/preguntas-frecuentes">Preguntas frecuentes</Link>
            <Link href="/cambios-y-devoluciones">Cambios y devoluciones</Link>
            <Link href="/contacto">Contacto</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#F9D36B]">
            Contacto
          </p>
          <div className="mt-3 flex gap-2">
            <Link className="rounded-full bg-white/10 p-2" href="/contacto" aria-label="Contacto">
              <MessageCircle size={18} />
            </Link>
            <Link className="rounded-full bg-white/10 p-2" href="/contacto" aria-label="Información de contacto">
              <Mail size={18} />
            </Link>
            <a className="rounded-full bg-white/10 p-2 transition hover:bg-white/20" href={instagramProfileUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram de Bobby's Pet Shop">
              <InstagramIcon size={18} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-[#C8D2CC]">
        Inventario publicado con precios y existencias por talla; compras aún no habilitadas.
      </div>
    </footer>
  );
}
