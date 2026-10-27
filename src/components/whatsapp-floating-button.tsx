import Image from "next/image";
import { whatsappProfileUrl } from "@/lib/social";

export function WhatsAppFloatingButton() {
  if (!whatsappProfileUrl) return null;

  return (
    <a
      href={whatsappProfileUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-[#25D366] shadow-[0_8px_26px_rgba(0,0,0,0.22)] transition hover:scale-105 hover:bg-[#20BD5C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#243C3A] sm:bottom-6 sm:left-6"
    >
      <Image src="/whatsapp.svg" alt="" width={30} height={30} unoptimized />
    </a>
  );
}
