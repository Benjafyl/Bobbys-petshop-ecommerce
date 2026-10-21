"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { useState } from "react";
import { useOfficialCart } from "@/components/official-cart-provider";
import { InstagramIcon } from "@/components/instagram-icon";
import { instagramProfileUrl } from "@/lib/social";

const navItems = [
  { href: "/tienda", label: "Tienda" },
  { href: "/guia-de-tallas", label: "Tallas" },
  { href: "/the-boss", label: "La marca" },
  { href: "/envios", label: "Envíos" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { cartCount } = useOfficialCart();

  return (
    <header className="sticky top-0 z-50 border-b border-[#E5DED4] bg-[#FBF7F1]/95 backdrop-blur">
      <div className="bg-[#243C3A] px-4 py-2 text-center text-xs font-semibold text-white">
        Envíos a todo Chile por $5.000 · Arma tu carrito · Pago en línea próximamente
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Ir al inicio">
          <span className="relative block h-12 w-24 overflow-hidden rounded-sm bg-[#F8F0E3] sm:w-32">
            <Image src="/images/official/logo-bobbys-pet-shop.jpg" alt="Bobby's Pet Shop" fill sizes="128px" className="object-cover" />
          </span>
          <span className="block max-w-[84px] text-xs font-black leading-tight text-[#243C3A] sm:max-w-none sm:text-sm">Bobby&apos;s Pet Shop</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-[#354642] lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[#B6633A]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/cuenta" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5DED4] text-[#243C3A] transition hover:border-[#B6633A]" aria-label="Mi cuenta"><UserRound size={19} /></Link>
          <a
            href={instagramProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5DED4] text-[#243C3A] transition hover:border-[#B6633A] hover:text-[#B6633A]"
            aria-label="Instagram de Bobby's Pet Shop"
          >
            <InstagramIcon size={19} />
          </a>
          <Link
            href="/tienda"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#E5DED4] text-[#243C3A] transition hover:bg-white sm:flex"
            aria-label="Buscar productos"
          >
            <Search size={18} />
          </Link>
          <Link
            href="/carrito"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#E5DED4] text-[#243C3A] transition hover:border-[#B6633A] hover:text-[#B6633A]"
            aria-label={`Carrito${cartCount > 0 ? `, ${cartCount} ${cartCount === 1 ? "producto" : "productos"}` : " vacío"}`}
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#B6633A] px-1 text-[10px] font-black text-white">{cartCount}</span>}
          </Link>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5DED4] text-[#243C3A] lg:hidden"
            type="button"
            aria-label="Abrir menu"
            onClick={() => setOpen((value) => !value)}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
      {open ? (
        <nav className="grid gap-1 border-t border-[#E5DED4] bg-[#FBF7F1] px-4 py-3 text-sm font-semibold text-[#243C3A] lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-2 hover:bg-white"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <a href={instagramProfileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-white" onClick={() => setOpen(false)}>
            <InstagramIcon size={18} /> Instagram @bobbys.cl
          </a>
        </nav>
      ) : null}
    </header>
  );
}
