import Image from "next/image";
import Link from "next/link";

const garments = [
  { slug: "parka-bicolor-gris", name: "Parka gris", image: "/images/rack/parka-gris.png", shape: "parka" },
  { slug: "poleron-ositos", name: "Chaleco animal print café", image: "/images/rack/chaleco-ositos.png", shape: "sweater" },
  { slug: "parka-bicolor-beige", name: "Parka beige", image: "/images/rack/parka-beige.png", shape: "parka" },
  { slug: "poleron-leopardo-gris", name: "Chaleco animal print blanco", image: "/images/rack/chaleco-animal-print-blanco.png", shape: "sweater" },
  { slug: "parka-azul", name: "Parka azul", image: "/images/rack/parka-azul.png", shape: "parka" },
  { slug: "poleron-corazones-rosa", name: "Chaleco corazones", image: "/images/rack/chaleco-corazones.png", shape: "sweater" },
  { slug: "poleron-flores-rosa", name: "Chaleco patitas", image: "/images/rack/chaleco-patitas.png", shape: "sweater" },
  { slug: "poleron-dinosaurios", name: "Chaleco dinosaurios", image: "/images/rack/chaleco-dinosaurios.png", shape: "sweater" },
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
      <div className="w-full px-4 py-14 sm:px-6 lg:px-8 lg:py-20 xl:px-10">
        <div className="rack-intro">
          <div>
            <p className="rack-eyebrow">El perchero de Bobby&apos;s</p>
            <h2 id="rack-heading" className="rack-heading">Elige su próximo look.</h2>
          </div>
        </div>
        <div className="rack-stage" role="group" aria-label="Parkas y chalecos para explorar">
          <div className="rack-scroll">
            <div className="rack-items">
              <div className="rack-rail" aria-hidden="true" />
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
                    <strong>{garment.name}</strong>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
