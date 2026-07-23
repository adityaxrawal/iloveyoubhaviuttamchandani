import type { ChatExport } from './lib/types';
import { useAnalysis } from './lib/useAnalysis';
import LoadingScreen from './components/LoadingScreen';
import ErrorScreen from './components/ErrorScreen';
import StoryShell from './components/StoryShell';
import { ThemeProvider } from './theme/ThemeContext';
import { useTheme } from './theme/theme';
import ThemeToggle from './theme/ThemeToggle';
// import sampleData from './code/sample_chat.json';
import chatData from './code/chat.json';
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

function ChatWrappedInner() {
  const { theme } = useTheme();
  const state = useAnalysis((chatData as ChatExport).messages);

  return (
    <div className="storyRoot" data-theme={theme}>
      <ThemeToggle />
      {state.status === 'loading' && <LoadingScreen />}
      {state.status === 'error' && <ErrorScreen message={state.message} />}
      {state.status === 'ready' && <StoryShell slides={SLIDES} data={state.data} />}
    </div>
  );
}

export default function ChatWrappedApp() {
  return (
    <ThemeProvider>
      <ChatWrappedInner />
    </ThemeProvider>
  );
}
