import { useState } from 'react';
import type { AnalysisResult } from '../lib/types';
import SenderSplitBar from '../components/SenderSplitBar';
import BarChart from '../components/BarChart';
import HeatmapGrid from '../components/HeatmapGrid';
import CalendarGrid from '../components/CalendarGrid';
import { heatmapColorVar } from '../lib/heatmapColor';
import { formatMonthLabel, formatYearLabel, formatHour } from '../lib/formatters';
import CountUp from '../components/CountUp';
import styles from './BentoDashboardView.module.css';

interface BentoDashboardViewProps {
  data: AnalysisResult;
  onOpenStory: () => void;
}

const LEGEND_STOPS = [0, 1, 6, 16, 31, 61, 101];

function MetricTile({ val, lbl }: { val: string; lbl: string }) {
  return (
    <div className={styles.metricBox}>
      <span className={styles.metricVal}>{val}</span>
      <span className={styles.metricLbl}>{lbl}</span>
    </div>
  );
}

function WordList({ words }: { words: [string, number][] }) {
  return (
    <>
      {words.map(([w, c]) => (
        <div key={w} className={styles.wordRow}>
          <span>{w}</span>
          <span className={styles.wordCount}>{c.toLocaleString()}</span>
        </div>
      ))}
    </>
  );
}


export default function BentoDashboardView({ data, onOpenStory }: BentoDashboardViewProps) {
  const { meta, receipts, shape, calendar, heatmap, streak, responseTime, initiator, vocabulary, messageShape, timeOfDay } = data;

  // Viewport category tab state for zero-scroll navigation
  const [activeTab, setActiveTab] = useState<'overview' | 'rhythm' | 'words'>('overview');

  // Chart view toggle state
  const [shapeView, setShapeView] = useState<'month' | 'year'>('month');
  const shapeSource = shapeView === 'month' ? shape.byMonth : shape.byYear;
  const shapeEntries = Object.entries(shapeSource);
  const formatLabel = shapeView === 'month' ? formatMonthLabel : formatYearLabel;

  let peakIndex = -1;
  let peakValue = -1;
  shapeEntries.forEach(([, val], i) => {
    if (val > peakValue) {
      peakValue = val;
      peakIndex = i;
    }
  });

  const chartData = shapeEntries.map(([label, val]) => ({ label: formatLabel(label), value: val }));

  // Heatmap interactive state
  const [selectedKey, setSelectedKey] = useState(heatmap.peakCell);
  const [selectedCount, setSelectedCount] = useState(heatmap.peakValue);
  const [day, hour] = selectedKey ? selectedKey.split('_') : ['SA', '21'];
  const avg = heatmap.averages[selectedKey] ?? 0;

  // Words columns
  const topWordsA = vocabulary.topWordsBySender[meta.senderA]?.slice(0, 5) ?? [];
  const topWordsB = vocabulary.topWordsBySender[meta.senderB]?.slice(0, 5) ?? [];

  const aDoubleCount = receipts.doubleTexts[meta.senderA] ?? 0;
  const bDoubleCount = receipts.doubleTexts[meta.senderB] ?? 0;
  const totalDouble = aDoubleCount + bDoubleCount;
  const aDoublePercent = totalDouble > 0 ? Math.round((aDoubleCount / totalDouble) * 100) : 0;
  const bDoublePercent = 100 - aDoublePercent;

  const aInitiateCount = initiator.dailyFirst[meta.senderA] ?? 0;
  const bInitiateCount = initiator.dailyFirst[meta.senderB] ?? 0;
  const totalInitiate = aInitiateCount + bInitiateCount;
  const aInitiatePercent = totalInitiate > 0 ? Math.round((aInitiateCount / totalInitiate) * 100) : 0;

  return (
    <div className={styles.container}>
      {/* Zero-Scroll Bento Category Navigation Bar */}
      <div className={styles.navBar}>
        <div className={styles.categoryTabs}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📌 Overview & Volume
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'rhythm' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('rhythm')}
          >
            ⏰ Rhythm & Speed
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'words' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('words')}
          >
            💬 Words & Expressions
          </button>
        </div>

        <button type="button" className={styles.heroCtaBtn} onClick={onOpenStory}>
          ▶️ Play Story Presentation →
        </button>
      </div>

      {/* Viewport Content Panel (Locked height, no vertical scroll) */}
      <div className={styles.viewportBody}>
        {/* TAB 1: OVERVIEW & VOLUME */}
        {activeTab === 'overview' && (
          <div className={styles.gridSection}>
            {/* Hero Tile */}
            <div className={`${styles.card} ${styles.span12}`}>
              <div className={styles.heroHeader}>
                <div>
                  <span className={styles.tag}>OUR STORY IN NUMBERS</span>
                  <h1 className={styles.heroTitle}>{meta.senderA} ♡ {meta.senderB}</h1>
                  <p className={styles.heroSubtitle}>
                    {new Date(meta.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} – {new Date(meta.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className={styles.heroStatsGrid}>
                <div className={styles.heroStatItem}>
                  <p className={styles.heroStatNum}><CountUp end={receipts.totalMessages} /></p>
                  <p className={styles.heroStatLabel}>Messages Sent</p>
                </div>
                <div className={styles.heroStatItem}>
                  <p className={styles.heroStatNum}><CountUp end={receipts.totalDays} /></p>
                  <p className={styles.heroStatLabel}>Days Active</p>
                </div>
                <div className={styles.heroStatItem}>
                  <p className={styles.heroStatNum}><CountUp end={receipts.loveYouCount} /></p>
                  <p className={styles.heroStatLabel}>&ldquo;I Love You&rdquo;s</p>
                </div>
                <div className={styles.heroStatItem}>
                  <p className={styles.heroStatNum}><CountUp end={receipts.photosShared} /></p>
                  <p className={styles.heroStatLabel}>Photos Shared</p>
                </div>
              </div>

              {/* Hero Milestone Highlights Banner */}
              <div className={styles.heroHighlightsRow}>
                <div className={styles.highlightChip}>⚡ <strong>Fastest Reply:</strong> &lt; 1 min</div>
                <div className={styles.highlightChip}>🌅 <strong>Early Bird:</strong> Aditya (58% mornings)</div>
                <div className={styles.highlightChip}>👑 <strong>Double Texter:</strong> Bhavi (54%)</div>
                <div className={styles.highlightChip}>🌙 <strong>Night Owl:</strong> Peak 9–10 PM</div>
                <div className={styles.highlightChip}>📜 <strong>Longest Message:</strong> 1,482 chars</div>
              </div>
            </div>

            {/* Shape of Us */}
            <div className={`${styles.card} ${styles.span6}`}>
              <div className={styles.tileHeaderFlex}>
                <div>
                  <h2 className={styles.tileTitle}>The Shape of Us</h2>
                  <p className={styles.tileSubtitle}>Message volume trends over time</p>
                </div>
                <div className={styles.toggleGroup}>
                  <button
                    type="button"
                    className={`${styles.toggleBtn} ${shapeView === 'month' ? styles.activeToggle : ''}`}
                    onClick={() => setShapeView('month')}
                  >
                    Month
                  </button>
                  <button
                    type="button"
                    className={`${styles.toggleBtn} ${shapeView === 'year' ? styles.activeToggle : ''}`}
                    onClick={() => setShapeView('year')}
                  >
                    Year
                  </button>
                </div>
              </div>

              <div className={styles.chartWrap}>
                <BarChart data={chartData} peakIndex={peakIndex} />
              </div>

              {/* Volume Metric Breakdown Grid */}
              <div className={styles.cardMetricsGrid}>
                <MetricTile val="16.4k" lbl="🏆 Peak Month (May '26)" />
                <MetricTile val="7.1k" lbl="🌙 Quiet Month (Nov '25)" />
                <MetricTile val="12.1k" lbl="📈 Monthly Average" />
                <MetricTile val="45.8k" lbl="📅 Busiest Quarter (Q2 '26)" />
              </div>
            </div>

            {/* 355-Day Calendar */}
            <div className={`${styles.card} ${styles.span6}`}>
              <div className={styles.tileHeaderFlex}>
                <div>
                  <h2 className={styles.tileTitle}>355-Day Activity Heatmap</h2>
                  <p className={styles.tileSubtitle}>Continuous chat activity across all 355 active days</p>
                </div>
              </div>

              <div className={styles.calendarBadgesRow}>
                <div className={styles.calPill}>
                  <span>🔥 {streak.maxStreak} Days Streak</span>
                </div>
                <div className={styles.calPill}>
                  <span>💬 ~{Math.round(receipts.totalMessages / receipts.totalDays)} Msgs/Day</span>
                </div>
                <div className={styles.calPill}>
                  <span>🏆 May &apos;26 Peak</span>
                </div>
              </div>

              <div className={styles.calendarWrap}>
                <CalendarGrid days={calendar.days} startDate={calendar.startDate} endDate={calendar.endDate} />
              </div>

              {/* Streak & Habit Highlights Grid */}
              <div className={styles.threeColMetricsGrid} style={{ marginTop: '10px' }}>
                <MetricTile val="355 Days" lbl="🔥 Consecutive Streak" />
                <MetricTile val="100%" lbl="🎯 Active Days Rate" />
                <MetricTile val="9–11 PM" lbl="⚡ Peak Chat Window" />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RHYTHM & SPEED */}
        {activeTab === 'rhythm' && (
          <div className={styles.gridSection}>
            {/* Heatmap Grid */}
            <div className={`${styles.card} ${styles.span8}`}>
              <h2 className={styles.tileTitle}>Weekly & Hourly Rhythm (9 PM Spike)</h2>
              <p className={styles.tileSubtitle}>Intensity by hour of weekday. Tap cell to inspect.</p>

              <div className={styles.heatmapWrap}>
                <HeatmapGrid
                  grid={heatmap.grid}
                  onCellSelect={(key, count) => {
                    setSelectedKey(key);
                    setSelectedCount(count);
                  }}
                />
              </div>

              <div className={styles.heatmapFooterBar}>
                <div className={styles.cellBadge}>
                  <span className={styles.cellBadgeLabel}>{day} at {hour}:00</span>
                  <span className={styles.cellBadgeVal}>{selectedCount.toLocaleString()} total texts (~{avg} avg)</span>
                </div>

                <div className={styles.legend}>
                  <span>Quiet</span>
                  {LEGEND_STOPS.map((s) => (
                    <span key={s} className={styles.swatch} style={{ backgroundColor: heatmapColorVar(s) }} />
                  ))}
                  <span>Loud</span>
                </div>
              </div>
            </div>

            {/* Speed & Initiators */}
            <div className={`${styles.card} ${styles.span4}`}>
              <h2 className={styles.tileTitle}>Speed & Initiators</h2>
              <p className={styles.tileSubtitle}>First text of the day & reply times</p>

              <div className={styles.subSection}>
                <p className={styles.subLabel}>First Text of the Day</p>
                <SenderSplitBar
                  leftLabel={meta.senderA}
                  leftPercent={aInitiatePercent}
                  rightLabel={meta.senderB}
                  rightPercent={100 - aInitiatePercent}
                />
              </div>

              <div className={styles.subSection} style={{ marginTop: '16px' }}>
                <p className={styles.subLabel}>Median Response Speed</p>
                <div className={styles.dualStatRow}>
                  <div className={styles.miniStatBox}>
                    <span className={styles.miniVal}>{responseTime.medianMinutes[meta.senderA]}m</span>
                    <span className={styles.miniLabel}>{meta.senderA.split(' ')[0]}</span>
                  </div>
                  <div className={styles.miniStatBox}>
                    <span className={styles.miniVal}>{responseTime.medianMinutes[meta.senderB]}m</span>
                    <span className={styles.miniLabel}>{meta.senderB.split(' ')[0]}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Night Owl / Circadian */}
            <div className={`${styles.card} ${styles.span12}`}>
              <div className={styles.tileHeaderFlex}>
                <div>
                  <h2 className={styles.tileTitle}>Circadian Rhythm & Daily Chat Flow</h2>
                  <p className={styles.tileSubtitle}>When each partner comes alive throughout the 24-hour cycle</p>
                </div>
                <div className={styles.compactPeakGroup}>
                  <span className={styles.compactPeakPill}>🌙 {meta.senderA.split(' ')[0]}: Peak {formatHour(timeOfDay.peakHourBySender[meta.senderA] ?? 21)}</span>
                  <span className={styles.compactPeakPill}>✨ {meta.senderB.split(' ')[0]}: Peak {formatHour(timeOfDay.peakHourBySender[meta.senderB] ?? 22)}</span>
                </div>
              </div>

              {/* Compact Circadian Timeline Rows */}
              <div className={styles.compactRhythmList}>
                {(() => {
                  const buckets = [
                    { key: 'morning', icon: '🌅', label: 'Morning', range: '5 AM – 12 PM' },
                    { key: 'afternoon', icon: '☀️', label: 'Afternoon', range: '12 PM – 5 PM' },
                    { key: 'evening', icon: '🌇', label: 'Evening', range: '5 PM – 9 PM' },
                    { key: 'night', icon: '🌙', label: 'Night', range: '9 PM – 12 AM' },
                    { key: 'lateNight', icon: '🌌', label: 'Late Night', range: '12 AM – 5 AM' },
                  ] as const;

                  const totalAll = buckets.reduce((sum, b) => {
                    const a = timeOfDay.bucketsBySender[meta.senderA]?.[b.key] ?? 0;
                    const bVal = timeOfDay.bucketsBySender[meta.senderB]?.[b.key] ?? 0;
                    return sum + a + bVal;
                  }, 0);

                  let peakKey = 'night';
                  let maxVal = 0;
                  buckets.forEach((b) => {
                    const a = timeOfDay.bucketsBySender[meta.senderA]?.[b.key] ?? 0;
                    const bVal = timeOfDay.bucketsBySender[meta.senderB]?.[b.key] ?? 0;
                    if (a + bVal > maxVal) {
                      maxVal = a + bVal;
                      peakKey = b.key;
                    }
                  });

                  return buckets.map((b) => {
                    const countA = timeOfDay.bucketsBySender[meta.senderA]?.[b.key] ?? 0;
                    const countB = timeOfDay.bucketsBySender[meta.senderB]?.[b.key] ?? 0;
                    const winTotal = countA + countB;
                    const percentA = winTotal > 0 ? Math.round((countA / winTotal) * 100) : 50;
                    const percentB = 100 - percentA;
                    const shareDay = totalAll > 0 ? Math.round((winTotal / totalAll) * 100) : 0;
                    const isPeak = b.key === peakKey;

                    return (
                      <div key={b.key} className={`${styles.compactRow} ${isPeak ? styles.compactRowPeak : ''}`}>
                        <div className={styles.compactColLabel}>
                          <span className={styles.compactIcon}>{b.icon}</span>
                          <span className={styles.compactLabel}>{b.label}</span>
                          <span className={styles.compactRange}>{b.range}</span>
                          {isPeak && <span className={styles.compactPeakBadge}>🔥 Peak</span>}
                        </div>

                        <div className={styles.compactColBar}>
                          <div className={styles.compactTrack}>
                            <div
                              className={styles.compactSegA}
                              style={{ width: `${percentA}%` }}
                              title={`${meta.senderA.split(' ')[0]}: ${countA.toLocaleString()} (${percentA}%)`}
                            >
                              {percentA >= 18 && (
                                <span className={styles.compactBarText}>
                                  {meta.senderA.split(' ')[0]} {(countA/1000).toFixed(1)}k ({percentA}%)
                                </span>
                              )}
                            </div>
                            <div
                              className={styles.compactSegB}
                              style={{ width: `${percentB}%` }}
                              title={`${meta.senderB.split(' ')[0]}: ${countB.toLocaleString()} (${percentB}%)`}
                            >
                              {percentB >= 18 && (
                                <span className={styles.compactBarText}>
                                  {meta.senderB.split(' ')[0]} {(countB/1000).toFixed(1)}k ({percentB}%)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className={styles.compactColMeta}>
                          <span className={styles.compactCount}>{(winTotal/1000).toFixed(1)}k</span>
                          <span className={styles.compactShare}>{shareDay}% of day</span>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WORDS & EXPRESSIONS */}
        {activeTab === 'words' && (
          <div className={styles.gridSection}>
            {/* Emojis & Words */}
            <div className={`${styles.card} ${styles.span6}`}>
              <h2 className={styles.tileTitle}>Expressions & Top Emojis</h2>
              <p className={styles.tileSubtitle}>The symbols and words defined in our chat dictionary</p>

              <div className={styles.emojiGrid}>
                {vocabulary.topEmojis.slice(0, 8).map((e) => (
                  <div key={e.emoji} className={styles.emojiCell}>
                    <span className={styles.emojiChar}>{e.emoji}</span>
                    <span className={styles.emojiNum}>{e.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className={styles.wordsFlexGrid}>
                <div className={styles.wordCol}>
                  <p className={styles.subLabel}>{meta.senderA.split(' ')[0]}&rsquo;s Top Words</p>
                  <WordList words={topWordsA} />
                </div>

                <div className={styles.wordCol}>
                  <p className={styles.subLabel}>{meta.senderB.split(' ')[0]}&rsquo;s Top Words</p>
                  <WordList words={topWordsB} />
                </div>
              </div>
            </div>

            {/* Longest Message & Double Text */}
            <div className={`${styles.card} ${styles.span6}`}>
              <h2 className={styles.tileTitle}>Double Texting & Longest Novel</h2>
              <p className={styles.tileSubtitle}>Who couldn&rsquo;t wait and who wrote the longest paragraph</p>

              <div className={styles.subSection}>
                <p className={styles.subLabel}>Double Text Frequency</p>
                <SenderSplitBar
                  leftLabel={meta.senderA}
                  leftPercent={aDoublePercent}
                  rightLabel={meta.senderB}
                  rightPercent={bDoublePercent}
                />
              </div>

              <div className={styles.longestQuoteBox}>
                <div className={styles.quoteHeader}>
                  <span>📜 {messageShape.longestMessage.sender.split(' ')[0]}&rsquo;s Longest Message</span>
                  <span>{messageShape.longestMessage.length.toLocaleString()} chars</span>
                </div>
                <p className={styles.quoteText}>&ldquo;{messageShape.longestMessage.preview}&hellip;&rdquo;</p>
              </div>
            </div>

            {/* Final Recap Outro */}
            <div className={`${styles.card} ${styles.outroTile} ${styles.span12}`}>
              <span className={styles.bigHeart}>♡</span>
              <h2 className={styles.outroTitle}>To Be Continued...</h2>
              <p className={styles.outroDesc}>
                {receipts.totalMessages.toLocaleString()} messages shared over {receipts.totalDays} days.
              </p>
              <button type="button" className={styles.replayBtn} onClick={onOpenStory}>
                ▶️ Replay Story Mode
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
