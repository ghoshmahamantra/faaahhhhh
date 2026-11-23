import React, { useEffect, useState } from 'react';
import { CalendarPlus, Check } from 'lucide-react';
import { ASSETS, COUPLE_INFO, WEDDING_FUNCTIONS } from '../data/weddingData';
import { calculateCountdown, generateWeddingIcs, padTwo } from '../utils/weddingLogic';
import {
  BismillahMedallion,
  FloralDivider,
  MughalLotusCrest,
  ShahiGeometricBand,
} from './Ornaments';

interface SaveTheDateScrollProps {
  onRevealBurst: () => void;
}

const DATE_PRESETS = [
  { id: 'haldi', label: 'Haldi · 25 Mar', day: '25', month: 'MAR', year: '2027', note: 'Haldi & Mehendi · Thu 7:00 PM' },
  { id: 'nikaah', label: 'Nikaah · 26 Mar', day: '26', month: 'MAR', year: '2027', note: 'Baraat & Nikaah · Fri 8:00 PM' },
  { id: 'walima', label: 'Walima · 29 Mar', day: '29', month: 'MAR', year: '2027', note: 'Grand Walima · Mon 8:00 PM' },
] as const;

/**
 * Full-Screen Save the Date + Fountain Pavilion & Royal Families (Screenshots 3 & 4):
 * - Maroon lotus & pink rosebud crest crowning the section
 * - Three maroon scalloped DATE / MONTH / YEAR cartouche plaques flanked symmetrically
 *   by mirrored ceremonial white royal elephants
 * - Gold diamond ribbon band transitioning to the Royal Fountain Pavilion & Family Blessings
 */
export const SaveTheDateScroll: React.FC<SaveTheDateScrollProps> = ({ onRevealBurst }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<'haldi' | 'nikaah' | 'walima'>('nikaah');
  const [countdown, setCountdown] = useState(() =>
    calculateCountdown(COUPLE_INFO.weddingTargetIso)
  );
  const [calendarSaved, setCalendarSaved] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(calculateCountdown(COUPLE_INFO.weddingTargetIso));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const activePreset =
    DATE_PRESETS.find((p) => p.id === selectedPresetId) ?? DATE_PRESETS[1];

  const handleSelectDate = (id: 'haldi' | 'nikaah' | 'walima') => {
    setSelectedPresetId(id);
    onRevealBurst();
  };

  const handleAddToCalendar = () => {
    const icsContent = generateWeddingIcs(WEDDING_FUNCTIONS);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Saifuddin-and-Sidra-Wedding-March-2027.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setCalendarSaved(true);
    onRevealBurst();
    window.setTimeout(() => setCalendarSaved(false), 3200);
  };

  return (
    <div id="save-the-date" className="w-full">
      {/* SCREENSHOT 3: Save the Date with Maroon Lotus Crest, 3 Plaques & Flanking Elephants */}
      <section
        aria-labelledby="save-the-date-heading"
        className="shahi-parchment relative w-full pt-12 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-8 flex flex-col items-center overflow-hidden"
      >
        {/* Top Ornate Painted Maroon Lotus & Rosebud Vine Crest */}
        <MughalLotusCrest className="-mt-4 sm:-mt-6" />

        {/* Central Plaques + Symmetrical Flanking White Royal Elephants */}
        <div className="relative mt-6 sm:mt-8 w-full max-w-[980px] mx-auto flex items-center justify-center">
          {/* Left Royal Elephant (overlapping left edge of DATE plaque on md+, tucked beside on mobile) */}
          <div
            aria-hidden="true"
            className="hidden sm:block pointer-events-none select-none w-36 md:w-52 lg:w-64 -mr-8 md:-mr-12 z-20 self-end translate-y-4"
          >
            <img
              src={ASSETS.royalElephantCream}
              alt=""
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain mix-blend-multiply"
              style={{
                maskImage: 'radial-gradient(ellipse 84% 84% at 50% 50%, black 66%, transparent 98%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 84% 84% at 50% 50%, black 66%, transparent 98%)',
              }}
            />
          </div>

          {/* Three Horizontal Maroon Scalloped Date / Month / Year Plaques */}
          <div className="relative z-10 grid grid-cols-3 gap-2.5 sm:gap-5 md:gap-7 w-full max-w-[600px]">
            {[
              { label: 'DATE', value: activePreset.day },
              { label: 'MONTH', value: activePreset.month },
              { label: 'YEAR', value: activePreset.year },
            ].map((item) => (
              <div key={item.label} className="relative flex flex-col items-center">
                {/* Small Cream Scalloped Top Label Tab */}
                <span className="relative z-20 -mb-3 px-4 sm:px-6 py-1 rounded-full bg-[#f7e9d3] border border-[#d6ad5e] text-[9px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-[#5c0d23] shadow-xs">
                  {item.label}
                </span>

                {/* Scalloped Deep Maroon Plaque with Warm Gold Numerals */}
                <div className="shahi-date-plaque w-full aspect-[4/3] flex items-center justify-center px-2 sm:px-4 pt-2">
                  <span
                    className="text-[28px] sm:text-[42px] md:text-[50px] font-semibold text-[#e8be6b] leading-none tracking-tight tabular-nums select-none"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Mirrored Royal Elephant facing inward left */}
          <div
            aria-hidden="true"
            className="hidden sm:block pointer-events-none select-none w-36 md:w-52 lg:w-64 -ml-8 md:-ml-12 z-20 self-end translate-y-4"
          >
            <img
              src={ASSETS.royalElephantCream}
              alt=""
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain mix-blend-multiply -scale-x-100"
              style={{
                maskImage: 'radial-gradient(ellipse 84% 84% at 50% 50%, black 66%, transparent 98%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 84% 84% at 50% 50%, black 66%, transparent 98%)',
              }}
            />
          </div>
        </div>

        {/* Mobile Flanking Elephants Pair (visible below plaques on narrow phones) */}
        <div
          aria-hidden="true"
          className="sm:hidden mt-2 flex items-center justify-between w-full max-w-[290px] pointer-events-none select-none"
        >
          <img
            src={ASSETS.royalElephantCream}
            alt=""
            referrerPolicy="no-referrer"
            className="w-24 h-auto object-contain mix-blend-multiply"
          />
          <img
            src={ASSETS.royalElephantCream}
            alt=""
            referrerPolicy="no-referrer"
            className="w-24 h-auto object-contain mix-blend-multiply -scale-x-100"
          />
        </div>

        {/* Italic Maroon "Save the Date" Heading */}
        <h2
          id="save-the-date-heading"
          className="mt-6 sm:mt-8 text-3xl sm:text-5xl font-normal italic text-[#680d26] text-center"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Save the Date
        </h2>

        {/* Interactive Celebration Date Switcher */}
        <div
          role="tablist"
          aria-label="Preview celebration dates"
          className="mt-4 inline-flex items-center gap-1 p-1 rounded-lg bg-[#ebd6b7]/80 border border-[#c49746]/45"
        >
          {DATE_PRESETS.map((preset) => {
            const active = preset.id === selectedPresetId;
            return (
              <button
                key={preset.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleSelectDate(preset.id)}
                className={`px-3 sm:px-4 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#5c0d23] text-[#f8e6c2] shadow-xs'
                    : 'text-[#5b352c] hover:text-[#470718]'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        <p className="mt-2.5 text-xs sm:text-sm font-medium text-[#6e4a44] text-center">
          {activePreset.note} · Kolkata
        </p>

        {/* Clean Tabular Countdown & Add to Calendar */}
        <div
          aria-label="Countdown to Nikaah Ceremony"
          className="mt-6 flex items-baseline justify-center gap-3 sm:gap-5 text-[#55081d] tabular-nums flex-wrap"
        >
          <div className="flex items-baseline gap-1">
            <span
              className="text-2xl sm:text-3xl font-semibold"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {countdown.days}
            </span>
            <span className="text-[11px] uppercase tracking-[0.14em] text-[#7a5042]">days</span>
          </div>
          <span aria-hidden="true" className="text-[#c49746] font-serif text-lg">
            ·
          </span>
          <div className="flex items-baseline gap-1">
            <span
              className="text-2xl sm:text-3xl font-semibold"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {padTwo(countdown.hours)}
            </span>
            <span className="text-[11px] uppercase tracking-[0.14em] text-[#7a5042]">hrs</span>
          </div>
          <span aria-hidden="true" className="text-[#c49746] font-serif text-lg">
            ·
          </span>
          <div className="flex items-baseline gap-1">
            <span
              className="text-2xl sm:text-3xl font-semibold"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {padTwo(countdown.minutes)}
            </span>
            <span className="text-[11px] uppercase tracking-[0.14em] text-[#7a5042]">min</span>
          </div>
          <span aria-hidden="true" className="text-[#c49746] font-serif text-lg">
            ·
          </span>
          <div className="flex items-baseline gap-1">
            <span
              className="text-2xl sm:text-3xl font-semibold"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {padTwo(countdown.seconds)}
            </span>
            <span className="text-[11px] uppercase tracking-[0.14em] text-[#7a5042]">sec</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCalendar}
          className="shahi-cartouche-btn mt-7 min-h-[46px] inline-flex items-center justify-center gap-2 px-8 py-2.5 text-[#f8e4b8] text-xs font-medium tracking-[0.16em] uppercase active:scale-[0.98] transition-transform whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#55081d]"
        >
          {calendarSaved ? (
            <>
              <Check className="w-4 h-4 text-[#f5dca2]" />
              <span>Calendar File Downloaded</span>
            </>
          ) : (
            <>
              <CalendarPlus className="w-4 h-4 text-[#f5dca2]" />
              <span>Add to calendar</span>
            </>
          )}
        </button>
      </section>

      {/* Gold Diamond Border Ribbon separating Save the Date & Pavilion Courtyard (Screenshot 3/4) */}
      <ShahiGeometricBand />

      {/* SCREENSHOT 4: Spacious Royal Courtyard Fountain Pavilion + Clean Family Blessings */}
      <section
        id="families"
        aria-label="The Families and Royal Courtyard"
        className="shahi-parchment relative w-full pt-12 pb-16 sm:pt-16 sm:pb-24 px-5 sm:px-10 text-center"
      >
        {/* Centered Large Sandstone Mughal Fountain Pavilion Vignette */}
        <div className="w-full max-w-[820px] mx-auto">
          <img
            src={ASSETS.royalFountainPavilion}
            alt="Royal Mughal sandstone pavilion and lotus fountain courtyard"
            referrerPolicy="no-referrer"
            className="w-full h-auto object-contain mix-blend-multiply"
            style={{
              maskImage: 'radial-gradient(ellipse 84% 84% at 50% 50%, black 60%, transparent 98%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 84% 84% at 50% 50%, black 60%, transparent 98%)',
            }}
          />
        </div>

        {/* Clean Unboxed Family Lineage (matching spacious editorial elegance) */}
        <div className="mt-6 sm:mt-10 max-w-4xl mx-auto">
          <BismillahMedallion size="md" />

          <p className="mt-4 text-xs font-semibold tracking-[0.22em] uppercase text-[#8c6323]">
            {COUPLE_INFO.invocationEnglish}
          </p>
          <p className="mt-1 text-xs sm:text-sm tracking-[0.14em] uppercase text-[#6e4a44]">
            {COUPLE_INFO.togetherLine}
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6 md:gap-8">
            <div className="py-2">
              <h3
                className="text-3xl sm:text-4xl font-semibold text-[#58081e]"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {COUPLE_INFO.groomName}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#5c362e] leading-relaxed">
                <span className="italic text-[#8c6323] mr-1.5">
                  {COUPLE_INFO.groomParentsPrefix}
                </span>
                <span className="font-medium">{COUPLE_INFO.groomParents}</span>
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 w-36 mx-auto" aria-hidden="true">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c49746]" />
              <span
                className="text-2xl italic text-[#8c6323]"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                weds
              </span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c49746]" />
            </div>

            <div className="py-2">
              <h3
                className="text-3xl sm:text-4xl font-semibold text-[#58081e]"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {COUPLE_INFO.brideName}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#5c362e] leading-relaxed">
                <span className="italic text-[#8c6323] mr-1.5">
                  {COUPLE_INFO.brideParentsPrefix}
                </span>
                <span className="font-medium">{COUPLE_INFO.brideParents}</span>
              </p>
            </div>
          </div>

          <p className="mt-7 text-sm text-[#57342c] max-w-xl mx-auto leading-relaxed">
            {COUPLE_INFO.inviteLine}
          </p>

          <FloralDivider className="mt-8" />
        </div>
      </section>
    </div>
  );
};
