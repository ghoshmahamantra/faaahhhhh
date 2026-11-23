import { Suspense, lazy, useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { ClosingSection } from './components/ClosingSection';
import { FestivitiesCarousel } from './components/FestivitiesCarousel';
import { HeroPage } from './components/HeroPage';
import { PetalCanvas } from './components/PetalCanvas';
import { RsvpSection } from './components/RsvpSection';
import { SaveTheDateScroll } from './components/SaveTheDateScroll';
import { VelvetBookIntro } from './components/VelvetBookIntro';
import { VenueMapSection } from './components/VenueMapSection';
import { WalimaFeatureCard } from './components/WalimaFeatureCard';
import { weddingAudio } from './utils/audioEngine';

const StoryCarousel = lazy(() =>
  import('./components/StoryCarousel').then((m) => ({ default: m.StoryCarousel }))
);

export default function App() {
  const autostart =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('autostart') === '1';

  const [bookDismissed, setBookDismissed] = useState(autostart);
  const [inviteRevealed, setInviteRevealed] = useState(autostart);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [activeVenueId, setActiveVenueId] = useState<'ojas' | 'ganpati'>('ojas');
  const [docHidden, setDocHidden] = useState(false);
  const [burstState, setBurstState] = useState<{
    nonce: number;
    type: 'petals' | 'celebration';
  }>({ nonce: 0, type: 'petals' });

  useEffect(() => {
    const onVisibility = () => {
      setDocHidden(document.hidden);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const triggerBurst = (type: 'petals' | 'celebration') => {
    setBurstState((prev) => ({ nonce: prev.nonce + 1, type }));
  };

  const handleBookOpenStart = () => {
    setInviteRevealed(true);
    triggerBurst('petals');
    weddingAudio.playWithFadeIn().then((started) => {
      setIsMusicPlaying(started);
    });
  };

  const handleBookOpenComplete = () => {
    setBookDismissed(true);
  };

  const handleToggleMusic = async () => {
    const playing = await weddingAudio.toggle();
    setIsMusicPlaying(playing);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectVenueOnMap = (venueId: 'ojas' | 'ganpati') => {
    setActiveVenueId(venueId);
    scrollToSection('locations');
  };

  const handleReplayBook = () => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    setBookDismissed(false);
    setInviteRevealed(false);
  };

  return (
    <div
      data-invitation-state={bookDismissed ? 'opened' : 'cover'}
      className={`shahi-parchment relative min-h-screen w-full overflow-x-clip ${
        docHidden ? 'anim-paused' : ''
      }`}
    >
      {/* Pre-cached offscreen rose petals & gold confetti burst canvas */}
      <PetalCanvas
        burstNonce={burstState.nonce}
        burstType={burstState.type}
        ambientActive={bookDismissed}
      />

      {/* 1. Full-Screen Shahi Patra Origami Royal Palace Doors */}
      {!bookDismissed && (
        <VelvetBookIntro
          onOpenStart={handleBookOpenStart}
          onOpenComplete={handleBookOpenComplete}
        />
      )}

      {/* Discreet Top-Right Circular Audio Toggle (Screenshot 1–6) */}
      <div className="fixed top-4 right-4 z-[60]">
        <button
          type="button"
          onClick={handleToggleMusic}
          aria-label={isMusicPlaying ? 'Mute wedding music' : 'Play wedding music'}
          aria-pressed={isMusicPlaying}
          className="min-w-[44px] min-h-[44px] rounded-full bg-[#fcf4e6]/95 text-[#470718] border border-[#c49746]/80 shadow-lg flex items-center justify-center hover:bg-[#470718] hover:text-[#f8e6c2] active:scale-[0.96] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e6c88a]"
        >
          {isMusicPlaying ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Full-Screen Edge-to-Edge Shahi Patra Experience */}
      <main className="relative z-10 w-full">
        {/* 2. Full-Screen Panoramic Palace Courtyard Hero */}
        <HeroPage
          isOpened={inviteRevealed}
          onScrollDown={() => scrollToSection('save-the-date')}
        />

        {/* 3. Full-Width Save the Date (3 Plaques + Flanking Elephants) & Fountain Pavilion */}
        <SaveTheDateScroll onRevealBurst={() => triggerBurst('celebration')} />

        {/* 4. Full-Width 3D Three.js Hanging Photo & Quote Frames with Pendulum Physics */}
        <Suspense
          fallback={
            <section
              id="our-story"
              className="shahi-floral-wall w-full min-h-[560px] flex items-center justify-center"
            />
          }
        >
          <StoryCarousel />
        </Suspense>

        {/* 5. Full-Width Deep Maroon Ceremonies Court with 3 Mughal Arch Windows */}
        <FestivitiesCarousel onSelectVenueOnMap={handleSelectVenueOnMap} />

        {/* 6. Grand Walima Reception Spotlight */}
        <WalimaFeatureCard
          onShowWalimaMap={() => handleSelectVenueOnMap('ganpati')}
          onJumpToRsvp={() => scrollToSection('rsvp')}
        />

        {/* 7. Kolkata Interactive Route Map — Ojas Banquets & Ganpati Banquets */}
        <VenueMapSection
          activeVenueId={activeVenueId}
          onChangeVenue={setActiveVenueId}
        />

        {/* 8. Painted Palace Easel Courtyard + RSVP & Warm Wishes Wall */}
        <RsvpSection onRsvpSuccessBurst={() => triggerBurst('celebration')} />

        {/* 9. Imperial Maroon Closing & Print Card PDF */}
        <ClosingSection onReplayBook={handleReplayBook} />
      </main>
    </div>
  );
}
