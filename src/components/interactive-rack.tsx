import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const garments = [
  { slug: "parka-bicolor-gris", name: "Parka gris", type: "Parka", image: "/images/rack/parka-gris.png", shape: "parka" },
  { slug: "poleron-ositos", name: "Chaleco de ositos", type: "Chaleco", image: "/images/rack/chaleco-ositos.png", shape: "sweater" },
  { slug: "parka-bicolor-beige", name: "Parka beige", type: "Parka", image: "/images/rack/parka-beige.png", shape: "parka" },
  { slug: "poleron-corazones-rosa", name: "Chaleco corazones", type: "Chaleco", image: "/images/rack/chaleco-corazones.png", shape: "sweater" },
  { slug: "parka-azul", name: "Parka azul", type: "Parka", image: "/images/rack/parka-azul.png", shape: "parka" },
  { slug: "poleron-dinosaurios", name: "Chaleco dinosaurios", type: "Chaleco", image: "/images/rack/chaleco-dinosaurios.png", shape: "sweater" },
] as const;

function Hanger() {
  return (
    <svg className="rack-hanger" viewBox="0 0 112 64" fill="none" aria-hidden="true">
      <path d="M56 27v-6c7-1 10-5 10-10a10 10 0 0 0-20 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M54 27 8 55c-3 2-2 6 2 6h92c4 0 5-4 2-6L58 27c-1-1-3-1-4 0Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

export function InteractiveRack() {
  return (
    <section aria-labelledby="rack-heading" className="rack-section border-y border-[#E5DED4]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="rack-intro">
          <div>
            <p className="rack-eyebrow">El perchero de Bobby&apos;s</p>
            <h2 id="rack-heading" className="rack-heading">Elige su próximo look.</h2>
          </div>
          <p className="rack-instruction">Pasa el cursor sobre una prenda y tócala para ver sus fotos, tallas y precio.</p>
        </div>
        <div className="rack-stage" role="group" aria-label="Parkas y chalecos para explorar">
          <div className="rack-scroll">
            <div className="rack-rail" aria-hidden="true" />
            <div className="rack-items">
              {garments.map((garment) => (
                <Link
                  key={garment.slug}
                  href={`/producto/${garment.slug}`}
                  className={`rack-item rack-item--${garment.shape}`}
                  aria-label={`Ver ${garment.name} en el catálogo`}
                >
                  <span className="rack-swing">
                    <Hanger />
                    <span className="rack-photo">
                      <Image src={garment.image} alt="" fill sizes="(min-width: 1024px) 180px, 150px" className="object-contain" />
                    </span>
                  </span>
                  <span className="rack-label">
                    <span><small>{garment.type}</small><strong>{garment.name}</strong></span>
                    <ArrowRight size={17} aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <p className="rack-mobile-hint">Desliza para ver más prendas <ArrowRight size={15} aria-hidden="true" /></p>
      </div>
    </section>
  );
}
