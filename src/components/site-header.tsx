"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/components/store-provider";

const navItems = [
  { href: "/tienda", label: "Tienda" },
  { href: "/guia-de-tallas", label: "Tallas" },
  { href: "/the-boss", label: "The Boss" },
  { href: "/envios", label: "Envios" },
  { href: "/admin", label: "Admin" },
];

export function SiteHeader() {
  const { cartCount } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E5DED4] bg-[#FBF7F1]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Ir al inicio">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#243C3A] text-sm font-black text-[#F9D36B]">
            BP
          </span>
          <span>
            <span className="block text-base font-black text-[#243C3A]">
              Bobby&apos;s Pet Shop
            </span>
            <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#B6633A]">
              Ropa para mascotas
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-[#354642] lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[#B6633A]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/tienda"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#E5DED4] text-[#243C3A] transition hover:bg-white sm:flex"
            aria-label="Buscar productos"
          >
            <Search size={18} />
          </Link>
          <Link
            href="/cuenta"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#E5DED4] text-[#243C3A] transition hover:bg-white sm:flex"
            aria-label="Ir a mi cuenta"
          >
            <UserRound size={18} />
          </Link>
          <Link
            href="/carrito"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#243C3A] text-white transition hover:bg-[#315955]"
            aria-label={`Ir al carrito con ${cartCount} productos`}
          >
            <ShoppingBag size={18} />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F9D36B] px-1 text-xs font-black text-[#243C3A]">
                {cartCount}
              </span>
            ) : null}
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
        </nav>
      ) : null}
    </header>
  );
}
