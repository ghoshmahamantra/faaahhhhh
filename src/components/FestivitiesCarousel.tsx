import React from 'react';
import { MapPin } from 'lucide-react';
import { WEDDING_FUNCTIONS } from '../data/weddingData';
import { CeremonyCornerValance, MughalLotusCrest } from './Ornaments';

interface FestivitiesCarouselProps {
  onSelectVenueOnMap: (venueId: 'ojas' | 'ganpati') => void;
}

/**
 * Full-Screen Ceremonies Court (Screenshot 5):
 * - Deep imperial maroon damask backdrop framed at top-left & top-right by ornate
 *   cream-and-gold Mughal floral scalloped corner valances with hanging tassels.
 * - Three side-by-side scalloped Mughal cusped-arch cream parchment ceremony windows:
 *   Haldi & Mehendi, Baraat & Nikaah, and Walima Reception.
 */
export const FestivitiesCarousel: React.FC<FestivitiesCarouselProps> = ({
  onSelectVenueOnMap,
}) => {
  return (
    <section
      id="festivities"
      aria-labelledby="festivities-heading"
      className="shahi-maroon-damask relative w-full pt-16 sm:pt-20 pb-24 px-4 sm:px-8 lg:px-12 overflow-hidden"
    >
      {/* Top-Left & Top-Right Cream & Gold Floral Corner Arch Valances (Screenshot 5) */}
      <CeremonyCornerValance side="left" />
      <CeremonyCornerValance side="right" />

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <h2
          id="festivities-heading"
          className="text-4xl sm:text-5xl font-semibold text-[#e6be72] tracking-tight text-balance"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Ceremonies
        </h2>
        <p className="mt-2.5 text-xs sm:text-sm tracking-[0.18em] uppercase text-[#e6c88a]/80">
          25 · 26 · 29 March 2027 · Kolkata
        </p>
      </div>

      {/* 3 Separate Side-by-Side Mughal Arch Ceremony Windows */}
      <div className="relative z-10 mt-12 sm:mt-14 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-stretch">
        {WEDDING_FUNCTIONS.map((fn) => (
          <article key={fn.id} className="relative flex flex-col">
            {/* Outer Antique Cream Mughal Arch Card with Pointed Finial Apex */}
            <div className="relative flex-1 flex flex-col bg-[#f7e6cd] rounded-t-[220px] rounded-b-sm border-[2.5px] border-[#c49746] p-2 shadow-[0_24px_54px_-16px_rgba(12,1,4,0.72)]">
              {/* Pointed Mughal Arch Finial Peak */}
              <svg
                aria-hidden="true"
                viewBox="0 0 160 36"
                className="absolute -top-6 left-1/2 -translate-x-1/2 w-36 h-9 pointer-events-none"
                fill="none"
              >
                <path
                  d="M8 34 C44 30 66 20 80 4 C94 20 116 30 152 34 Z"
                  fill="#f7e6cd"
                  stroke="#c49746"
                  strokeWidth="2.2"
                />
                <path
                  d="M22 33 C52 29 68 21 80 9 C92 21 108 29 138 33"
                  stroke="#7b1630"
                  strokeWidth="0.9"
                  strokeOpacity="0.65"
                />
              </svg>

              {/* Inner Double-Hairline Maroon & Gold Frame */}
              <div className="relative flex-1 flex flex-col rounded-t-[210px] rounded-b-xs border border-[#7b1630]/60 bg-[#f8ead4] overflow-hidden">
                {/* Painted Ceremony Illustration feathered softly into the cream arch */}
                <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-[#f8ead4] pt-4 px-4 flex items-center justify-center">
                  <img
                    src={fn.sceneImage}
                    alt={fn.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center rounded-t-[180px]"
                    style={{
                      maskImage:
                        'radial-gradient(ellipse 84% 84% at 50% 48%, black 56%, transparent 98%)',
                      WebkitMaskImage:
                        'radial-gradient(ellipse 84% 84% at 50% 48%, black 56%, transparent 98%)',
                    }}
                  />
                </div>

                {/* Title + Venue + Pin + Date/Time Footer */}
                <div className="flex-1 flex flex-col justify-between px-6 pt-2 pb-6 text-center">
                  <div>
                    <h3
                      className="text-[28px] sm:text-[30px] font-semibold text-[#55081d] leading-tight"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {fn.shortTitle}
                    </h3>
                    <p className="mt-1 text-xs italic text-[#7a5042]">{fn.subtitle}</p>
                  </div>

                  {/* Venue Left + Square-Rounded Location Pin Button Right (Screenshot 5) */}
                  <div className="mt-6 flex items-center justify-between gap-3 text-left">
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-medium text-[#470718] leading-snug">
                        {fn.venueName}
                      </p>
                      <p className="mt-0.5 text-xs text-[#6a443a] line-clamp-2">
                        {fn.shortVenue}
                      </p>
                    </div>

                    {fn.mapVenueId ? (
                      <button
                        type="button"
                        onClick={() => onSelectVenueOnMap(fn.mapVenueId!)}
                        aria-label={`View ${fn.shortTitle} venue on route map`}
                        className="shrink-0 w-10 h-10 rounded-lg border-[1.5px] border-[#55081d]/80 bg-[#fcf4e6] text-[#55081d] flex items-center justify-center hover:bg-[#55081d] hover:text-[#f8ead4] active:scale-[0.96] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#55081d]"
                      >
                        <MapPin className="w-4 h-4" />
                      </button>
                    ) : (
                      <a
                        href={fn.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${fn.shortTitle} location in Google Maps`}
                        className="shrink-0 w-10 h-10 rounded-lg border-[1.5px] border-[#55081d]/80 bg-[#fcf4e6] text-[#55081d] flex items-center justify-center hover:bg-[#55081d] hover:text-[#f8ead4] active:scale-[0.96] transition-colors focus-visible:outline-2 focus-visible:outline-[#55081d]"
                      >
                        <MapPin className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Horizontal Divider + Date Left / Time Right (Screenshot 5) */}
                  <div className="mt-5 pt-3.5 border-t border-[#c49746]/65 flex items-baseline justify-between gap-2 text-xs sm:text-[13px] text-[#55081d]">
                    <span className="font-semibold">{fn.compactDate}</span>
                    <span className="font-medium text-[#6e463a] whitespace-nowrap">
                      {fn.compactTime}
                    </span>
                  </div>

                  {/* Quiet unboxed attire line */}
                  <div className="mt-2.5 flex items-center justify-between gap-2 text-[11px] text-[#6d483e]">
                    <span className="truncate">{fn.dressCode}</span>
                    <span className="inline-flex items-center gap-1.5 shrink-0">
                      {fn.swatches.map((sw) => (
                        <span
                          key={sw.name}
                          title={sw.name}
                          aria-label={sw.name}
                          className="w-3 h-3 rounded-full border border-[#c49746] inline-block"
                          style={{ backgroundColor: sw.hex }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom Ornate Lotus Crest Peeking at Lower Maroon Border (Screenshot 5) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 left-1/2 -translate-x-1/2 opacity-95"
      >
        <MughalLotusCrest className="w-[280px] sm:w-[340px]" />
      </div>
    </section>
  );
};
