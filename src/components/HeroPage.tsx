import React from 'react';
import { ChevronDown } from 'lucide-react';
import { ASSETS, COUPLE_INFO } from '../data/weddingData';

interface HeroPageProps {
  isOpened: boolean;
  onScrollDown: () => void;
}

interface AnimatedNameProps {
  text: string;
  baseDelayMs: number;
  active: boolean;
}

const AnimatedName: React.FC<AnimatedNameProps> = ({ text, baseDelayMs, active }) => {
  const letters = Array.from(text);
  return (
    <span className="inline-block" aria-label={text}>
      {letters.map((char, idx) => (
        <span
          key={idx}
          aria-hidden="true"
          className={active ? 'inline-block animate-letter-reveal' : 'inline-block opacity-0'}
          style={{
            animationDelay: `${baseDelayMs + idx * 28}ms`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

/**
 * Full-Screen Panoramic Palace Courtyard Hero (Screenshot 2):
 * Edge-to-edge sunset Mughal palace courtyard with couple names floating serenely
 * in the upper pastel sky and subtle "Scroll down" chevron over the reflecting pool.
 */
export const HeroPage: React.FC<HeroPageProps> = ({ isOpened, onScrollDown }) => {
  return (
    <section
      id="invitation-hero"
      aria-label="Wedding Invitation Opening Palace"
      className="relative min-h-[100svh] w-full overflow-hidden flex flex-col items-center justify-between bg-[#edd7bf]"
    >
      {/* Full-bleed wide 16:9 panoramic palace courtyard painting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <img
          src={ASSETS.heroCourtyardWide}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center animate-arch-zoom"
        />
        {/* Gentle sky readability haze across upper third matching Screenshot 2 */}
        <div
          className="absolute inset-x-0 top-0 h-[42%]"
          style={{
            background:
              'linear-gradient(180deg, rgba(255, 240, 228, 0.45) 0%, rgba(255, 238, 224, 0.16) 65%, transparent 100%)',
          }}
        />
        {/* Subtle bottom pool contrast gradient for crisp Scroll down visibility */}
        <div
          className="absolute inset-x-0 bottom-0 h-28"
          style={{
            background:
              'linear-gradient(0deg, rgba(38, 8, 16, 0.56) 0%, rgba(38, 8, 16, 0.18) 55%, transparent 100%)',
          }}
        />
      </div>

      {/* Couple Names in Graceful Italic Maroon Serif floating in the open sunset sky */}
      <div className="relative z-10 w-full flex flex-col items-center justify-start pt-16 sm:pt-20 md:pt-24 px-5 text-center">
        <h1
          className="text-[clamp(2rem,4.8vw,4.35rem)] leading-[1.12] font-normal italic text-[#5c0d23] tracking-tight text-balance drop-shadow-[0_2px_14px_rgba(255,244,234,0.85)]"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          <AnimatedName text={COUPLE_INFO.groomName} baseDelayMs={140} active={isOpened} />
          <span className="mx-3 sm:mx-4 text-[0.78em] font-normal text-[#781831]">&amp;</span>
          <AnimatedName text={COUPLE_INFO.brideName} baseDelayMs={640} active={isOpened} />
        </h1>
        <p className="mt-2.5 text-[11px] sm:text-xs font-medium tracking-[0.26em] uppercase text-[#66172d]/90 drop-shadow-[0_1px_6px_rgba(255,244,234,0.9)]">
          {COUPLE_INFO.celebrationDatesLine}
        </p>
      </div>

      {/* Bottom Center Scroll Down Prompt (Screenshot 2) */}
      <div className="relative z-10 pb-6 sm:pb-8 flex flex-col items-center">
        <button
          type="button"
          onClick={onScrollDown}
          aria-label="Scroll down to Save the Date"
          className="min-w-[44px] min-h-[44px] inline-flex flex-col items-center justify-center gap-0.5 text-[#fff7ea] hover:text-white transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#f8e6c2] rounded-full px-4 py-1"
        >
          <span
            className="text-sm sm:text-base italic tracking-wide drop-shadow-[0_2px_6px_rgba(24,4,10,0.8)]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Scroll down
          </span>
          <ChevronDown className="w-5 h-5 animate-scroll-arrow text-[#fff2da] drop-shadow-[0_2px_4px_rgba(24,4,10,0.8)]" />
        </button>
      </div>
    </section>
  );
};
