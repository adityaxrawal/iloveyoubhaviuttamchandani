import { useEffect, useState } from 'react';
import type { AnalysisResult } from './lib/types';
import StoryShell from './components/StoryShell';
import ModeSwitch from './components/ModeSwitch';
import BentoDashboardView from './views/BentoDashboardView';
import metricsData from './code/metrics.json';
import './theme/tokens.css';

import Cover from './slides/00Cover';
import Receipts from './slides/01Receipts';
import ShapeOfUs from './slides/02ShapeOfUs';
import CalendarSlide from './slides/03Calendar';
import NinePmSpike from './slides/04NinePmSpike';
import Streak from './slides/05Streak';
import WhoStarts from './slides/06WhoStarts';
import ResponseTime from './slides/07ResponseTime';
import Vocabulary from './slides/08Vocabulary';
import OurWords from './slides/09OurWords';
import NightOwl from './slides/10NightOwl';
import LongestMessage from './slides/11LongestMessage';
import DoubleText from './slides/12DoubleText';
import Outro from './slides/13Outro';

const SLIDES = [
  Cover, Receipts, ShapeOfUs, CalendarSlide, NinePmSpike,
  Streak, WhoStarts, ResponseTime, Vocabulary, OurWords,
  NightOwl, LongestMessage, DoubleText, Outro,
];

export default function ChatWrappedApp() {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }
    return false;
  });

  // Mobile defaults to 'story'; Desktop/Tablet defaults to 'bento'
  const [viewMode, setViewMode] = useState<'story' | 'bento'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      return 'story';
    }
    return 'bento';
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const data = metricsData as unknown as AnalysisResult;

  // Track window resize to detect Mobile vs Desktop/Tablet
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setViewMode('story'); // Force Story mode on mobile
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeMode = isMobile ? 'story' : viewMode;

  return (
    <div
      className="storyRoot"
      style={{
        minHeight: '100dvh',
        height: isMobile ? 'auto' : '100dvh',
        background: 'radial-gradient(circle at 50% 40%, #7a1527 0%, #4a0d17 100%)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Hide ModeSwitch on Mobile View completely */}
      {!isMobile && (
        <ModeSwitch
          mode={activeMode}
          onChangeMode={setViewMode}
          currentIndex={currentIndex}
          totalSlides={SLIDES.length}
        />
      )}

      <div style={{ flex: 1, display: 'flex', width: '100%', minHeight: 0, overflow: 'hidden' }}>
        {activeMode === 'story' ? (
          <StoryShell
            slides={SLIDES}
            data={data}
            currentIndex={currentIndex}
            onIndexChange={setCurrentIndex}
          />
        ) : (
          <BentoDashboardView
            data={data}
            onOpenStory={() => setViewMode('story')}
          />
        )}
      </div>
    </div>
  );
}
