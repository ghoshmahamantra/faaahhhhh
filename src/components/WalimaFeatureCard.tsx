import React from 'react';
import { Calendar, Clock, MapPin, Navigation } from 'lucide-react';
import { WEDDING_FUNCTIONS } from '../data/weddingData';
import { FloralDivider } from './Ornaments';

interface WalimaFeatureCardProps {
  onShowWalimaMap: () => void;
  onJumpToRsvp: () => void;
}

export const WalimaFeatureCard: React.FC<WalimaFeatureCardProps> = ({
  onShowWalimaMap,
  onJumpToRsvp,
}) => {
  const walima = WEDDING_FUNCTIONS.find((f) => f.id === 'walima')!;

  const sparkles = [
    { top: '14%', left: '10%', delay: '0s' },
    { top: '20%', right: '11%', delay: '0.9s' },
    { bottom: '18%', left: '14%', delay: '1.3s' },
    { bottom: '14%', right: '14%', delay: '2.1s' },
  ];

  return (
    <section
      id="grand-reception"
      aria-labelledby="walima-reception-heading"
      className="shahi-parchment relative w-full py-16 sm:py-24 px-5 sm:px-8 flex justify-center"
    >
      <div className="shahi-maroon-damask relative w-full max-w-4xl rounded-2xl overflow-hidden border-[2px] border-[#c49746] px-6 sm:px-14 py-12 sm:py-16 text-center text-[#f7e4bc] shadow-[0_24px_56px_-20px_rgba(48,4,16,0.65)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-3.5 rounded-xl border border-[#e6c88a]/40"
        />

        {sparkles.map((sp, idx) => (
          <svg
            key={idx}
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="pointer-events-none absolute w-3 h-3 text-[#f2d699] animate-sparkle"
            style={{
              ...sp,
              animationDelay: sp.delay,
            }}
            fill="currentColor"
          >
            <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" />
          </svg>
        ))}

        <div className="relative z-10 flex flex-col items-center">
          <p className="text-[11px] font-medium tracking-[0.26em] uppercase text-[#e6c88a]/90">
            Royal Evening Banquet
          </p>

          <h2
            id="walima-reception-heading"
            className="mt-2.5 text-3xl sm:text-5xl font-semibold text-[#fae7c2] leading-tight text-balance"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Grand Walima Reception
          </h2>

          <FloralDivider variant="light" className="mt-4 max-w-[240px]" />

          <p className="mt-4 text-sm sm:text-base text-[#f3e0c2]/90 max-w-lg leading-relaxed">
            Join the Alam &amp; Ahmed families for a celebratory dinner honoring the newlyweds.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl text-sm text-[#f8ead0] border-y border-[#e6c88a]/25 py-6">
            <div className="flex flex-col items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#e6c88a]" />
              <span className="font-semibold text-[#fae7c2]">{walima.dayDate}</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#e6c88a]" />
              <span className="font-medium">{walima.time}</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#e6c88a]" />
              <span className="font-semibold text-[#fae7c2]">{walima.venueName}</span>
            </div>
          </div>

          <p className="mt-5 text-xs sm:text-sm text-[#ecd7b4]/90 max-w-xl leading-relaxed">
            {walima.address}
          </p>
          <p className="mt-2 text-[11px] tracking-[0.16em] uppercase text-[#e6c88a]/85">
            Dress Code · {walima.dressCode}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={onShowWalimaMap}
              className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#f5e1b8] text-[#470718] text-xs font-semibold tracking-[0.14em] uppercase hover:bg-[#fbf0d7] active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5e1b8]"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Reception Map</span>
            </button>

            <button
              type="button"
              onClick={onJumpToRsvp}
              className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-[#e6c88a]/75 text-[#fae7c2] text-xs font-medium tracking-[0.14em] uppercase hover:bg-[#e6c88a]/15 active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5e1b8]"
            >
              <span>Confirm Attendance</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
