import type { AnalysisResult } from './lib/types';
import StoryShell from './components/StoryShell';
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
  return (
    <div className="storyRoot">
      <StoryShell slides={SLIDES} data={metricsData as unknown as AnalysisResult} />
    </div>
  );
}
