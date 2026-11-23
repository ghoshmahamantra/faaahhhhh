import React, { useEffect, useState } from 'react';
import { ASSETS, COUPLE_INFO } from '../data/weddingData';
import { BismillahMedallion } from './Ornaments';

interface VelvetBookIntroProps {
  onOpenStart: () => void;
  onOpenComplete: () => void;
}

/**
 * Full-screen Shahi Patra Opening Page (Screenshot 1) with 3D Origami Unfolding:
 * - Left & Right deep maroon damask folded panels featuring Mughal lotus sprigs (top)
 *   and ceremonial white royal elephants facing inward (bottom), bounded by beaded rails.
 * - Center full-height cream damask invitation strip with Bismillah medallion, blessing text,
 *   and scalloped "Tap to open" cartouche button.
 * - On tap: center strip folds horizontally along an origami crease while side bi-fold wings
 *   swing open in 3D perspective to reveal the full-screen courtyard hero behind.
 */
export const VelvetBookIntro: React.FC<VelvetBookIntroProps> = ({
  onOpenStart,
  onOpenComplete,
}) => {
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const urls = [
      ASSETS.heroCourtyardWide,
      ASSETS.royalDoorElephant,
      ASSETS.royalLotusSprig,
      ASSETS.royalElephantCream,
      ASSETS.royalFountainPavilion,
      ASSETS.couplePortraitGarden,
      ASSETS.couplePortraitTwilight,
      ASSETS.couplePortraitCelebration,
    ];
    let loaded = 0;

    const markDone = () => {
      if (cancelled) return;
      loaded += 1;
      const pct = Math.min(100, Math.round((loaded / (urls.length + 1)) * 100));
      setLoadProgress(pct);
      if (loaded >= urls.length + 1) {
        window.setTimeout(() => {
          if (!cancelled) setIsReady(true);
        }, 120);
      }
    };

    urls.forEach((src) => {
      const img = new Image();
      img.onload = markDone;
      img.onerror = markDone;
      img.src = src;
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(markDone).catch(markDone);
    } else {
      markDone();
    }

    const ceiling = window.setTimeout(() => {
      if (!cancelled) {
        setLoadProgress(100);
        setIsReady(true);
      }
    }, 2200);

    return () => {
      cancelled = true;
      window.clearTimeout(ceiling);
    };
  }, []);

  const handleOpen = () => {
    if (!isReady || isOpening) return;
    setIsOpening(true);
    onOpenStart();
    window.setTimeout(() => {
      onOpenComplete();
    }, 1300);
  };

  return (
    <section
      aria-label="Royal Wedding Invitation Doors"
      className={`shahi-origami-stage fixed inset-0 z-50 w-screen h-[100dvh] overflow-hidden ${
        isOpening ? 'pointer-events-none' : ''
      }`}
    >
      {/* Full-viewport 3-zone grid matching Screenshot 1 */}
      <div className="relative w-full h-full grid grid-cols-[1fr_minmax(195px,44%)_1fr] sm:grid-cols-[1fr_minmax(310px,360px)_1fr] lg:grid-cols-[1fr_410px_1fr]">
        {/* LEFT ORIGAMI WING (Upper Lotus + Lower Royal Elephant) */}
        <div
          aria-hidden="true"
          className={`shahi-origami-wing-left relative h-full flex ${isOpening ? 'is-open' : ''}`}
        >
          {/* Far-left maroon gold-beaded margin rail */}
          <div className="hidden sm:block w-8 md:w-12 lg:w-16 h-full shahi-maroon-beaded-rail border-r border-[#c49746]/55 shrink-0" />

          {/* Left Door Panel with top & bottom inset compartments */}
          <div className="shahi-origami-leaf-inner-left relative flex-1 h-full shahi-maroon-damask flex flex-col justify-between p-1.5 sm:p-4 lg:p-5 border-r border-[#8d1b38]/80 shadow-[inset_-14px_0_30px_rgba(14,1,5,0.45)]">
            {/* Upper Left Compartment: Mughal Lotus & Rose Sprig */}
            <div className="relative flex-1 flex items-center justify-center border border-[#c49746]/45 rounded-xs mb-1 sm:mb-3 overflow-hidden">
              <div className="pointer-events-none absolute inset-1 border border-[#c49746]/20" />
              <img
                src={ASSETS.royalLotusSprig}
                alt=""
                referrerPolicy="no-referrer"
                className="w-24 sm:w-40 md:w-52 lg:w-60 h-28 sm:h-48 md:h-60 object-contain mix-blend-lighten opacity-95 select-none pointer-events-none"
                style={{
                  maskImage: 'radial-gradient(ellipse 74% 80% at 50% 50%, black 56%, transparent 98%)',
                  WebkitMaskImage:
                    'radial-gradient(ellipse 74% 80% at 50% 50%, black 56%, transparent 98%)',
                }}
              />
            </div>

            {/* Lower Left Compartment: Royal White Elephant facing inward right */}
            <div className="relative flex-1 flex items-center justify-center border border-[#c49746]/45 rounded-xs mt-1 sm:mt-2 overflow-hidden">
              <div className="pointer-events-none absolute inset-1 border border-[#c49746]/20" />
              <img
                src={ASSETS.royalDoorElephant}
                alt=""
                referrerPolicy="no-referrer"
                className="w-28 sm:w-44 md:w-60 lg:w-72 h-28 sm:h-48 md:h-64 object-contain mix-blend-lighten opacity-95 select-none pointer-events-none"
                style={{
                  maskImage: 'radial-gradient(ellipse 78% 78% at 50% 50%, black 58%, transparent 98%)',
                  WebkitMaskImage:
                    'radial-gradient(ellipse 78% 78% at 50% 50%, black 58%, transparent 98%)',
                }}
              />
            </div>
          </div>
        </div>

        {/* CENTER FULL-HEIGHT CREAM INVITATION STRIP (splits/folds like origami on open) */}
        <div className="relative h-full z-20 flex flex-col">
          {/* Vertical left & right maroon beaded border rails framing the cream column */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 left-0 w-2 sm:w-3 z-30 shahi-maroon-beaded-rail border-r border-[#c49746]/60 transition-opacity duration-500 ${
              isOpening ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 right-0 w-2 sm:w-3 z-30 shahi-maroon-beaded-rail border-l border-[#c49746]/60 transition-opacity duration-500 ${
              isOpening ? 'opacity-0' : 'opacity-100'
            }`}
          />

          {/* Top Origami Fold Leaf */}
          <div
            aria-hidden="true"
            className={`shahi-origami-center-top flex-1 shahi-parchment shadow-[inset_0_-18px_36px_rgba(140,99,35,0.08)] ${
              isOpening ? 'is-open' : ''
            }`}
          />

          {/* Bottom Origami Fold Leaf */}
          <div
            aria-hidden="true"
            className={`shahi-origami-center-bottom flex-1 shahi-parchment shadow-[inset_0_18px_36px_rgba(140,99,35,0.08)] ${
              isOpening ? 'is-open' : ''
            }`}
          />

          {/* Center Content Floating Over the Cream Origami Seam */}
          <div
            className={`absolute inset-0 z-20 flex flex-col items-center justify-center px-4 sm:px-9 text-center transition-all duration-500 ease-out ${
              isOpening ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            <BismillahMedallion size="md" className="scale-90 sm:scale-100" />

            <p className="mt-2 sm:mt-3 text-[10px] sm:text-[11px] font-medium tracking-[0.18em] uppercase text-[#8c6323]">
              {COUPLE_INFO.invocationEnglish}
            </p>

            <p
              className="mt-2.5 sm:mt-3 text-[16px] sm:text-[22px] leading-snug text-[#680d26] max-w-[280px] font-medium"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              We cordially invite you to grace the auspicious occasion of the marriage of…
            </p>

            <div className="mt-6 min-h-[48px] flex flex-col items-center justify-center">
              {!isReady ? (
                <div className="flex flex-col items-center gap-2" role="status" aria-live="polite">
                  <div className="w-32 sm:w-40 h-1 rounded-full bg-[#680d26]/15 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#b28236] via-[#d9b061] to-[#680d26] transition-all duration-300"
                      style={{ width: `${Math.max(18, loadProgress)}%` }}
                    />
                  </div>
                  <span className="text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-[#6d4621]">
                    Preparing Shahi Patra…
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleOpen}
                  aria-label="Tap to open Dr. Saifuddin Alam and Sidra Ahmed wedding invitation"
                  className="shahi-cartouche-btn min-h-[44px] px-6 sm:px-10 py-2.5 text-[#f6e0ae] text-xs sm:text-sm font-medium tracking-[0.1em] active:scale-[0.97] transition-transform whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#680d26]"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Tap to open
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT ORIGAMI WING (Mirrored Upper Lotus + Lower Royal Elephant) */}
        <div
          aria-hidden="true"
          className={`shahi-origami-wing-right relative h-full flex ${isOpening ? 'is-open' : ''}`}
        >
          <div className="shahi-origami-leaf-inner-right relative flex-1 h-full shahi-maroon-damask flex flex-col justify-between p-1.5 sm:p-4 lg:p-5 border-l border-[#8d1b38]/80 shadow-[inset_14px_0_30px_rgba(14,1,5,0.45)]">
            {/* Upper Right Compartment: Mirrored Mughal Lotus & Rose Sprig */}
            <div className="relative flex-1 flex items-center justify-center border border-[#c49746]/45 rounded-xs mb-1 sm:mb-3 overflow-hidden">
              <div className="pointer-events-none absolute inset-1 border border-[#c49746]/20" />
              <img
                src={ASSETS.royalLotusSprig}
                alt=""
                referrerPolicy="no-referrer"
                className="w-24 sm:w-40 md:w-52 lg:w-60 h-28 sm:h-48 md:h-60 object-contain mix-blend-lighten opacity-95 -scale-x-100 select-none pointer-events-none"
                style={{
                  maskImage: 'radial-gradient(ellipse 74% 80% at 50% 50%, black 56%, transparent 98%)',
                  WebkitMaskImage:
                    'radial-gradient(ellipse 74% 80% at 50% 50%, black 56%, transparent 98%)',
                }}
              />
            </div>

            {/* Lower Right Compartment: Mirrored Royal Elephant facing inward left */}
            <div className="relative flex-1 flex items-center justify-center border border-[#c49746]/45 rounded-xs mt-1 sm:mt-2 overflow-hidden">
              <div className="pointer-events-none absolute inset-1 border border-[#c49746]/20" />
              <img
                src={ASSETS.royalDoorElephant}
                alt=""
                referrerPolicy="no-referrer"
                className="w-28 sm:w-44 md:w-60 lg:w-72 h-28 sm:h-48 md:h-64 object-contain mix-blend-lighten opacity-95 -scale-x-100 select-none pointer-events-none"
                style={{
                  maskImage: 'radial-gradient(ellipse 78% 78% at 50% 50%, black 58%, transparent 98%)',
                  WebkitMaskImage:
                    'radial-gradient(ellipse 78% 78% at 50% 50%, black 58%, transparent 98%)',
                }}
              />
            </div>
          </div>

          {/* Far-right maroon gold-beaded margin rail */}
          <div className="hidden sm:block w-8 md:w-12 lg:w-16 h-full shahi-maroon-beaded-rail border-l border-[#c49746]/55 shrink-0" />
        </div>
      </div>
    </section>
  );
};
