import React, { useState } from 'react';
import { StampHeart } from './StampHeart';
import { StampKey } from './StampKey';
import { Postmark } from './Postmark';
import TypingText from './TypingText';
import styles from './PostCard.module.css';

const DEFAULT_BODY = `The day you entered my life, it felt like a dream. A woman so charming, so kind, so beautiful, with a personality so unique that even the stars couldn't compare.
You made me realize that yes, true love does exist. And with you, baby, it feels like we've been together since past of the past lives, like my soul already knew yours before we ever met.
You are the most important person in my world. The one I want to tell everything to. The one whose laugh feels like home. The one I'd choose again, in every lifetime, without a second thought.
You didn't just walk into my life, you completed it. And every single day with you feels like a gift I never want to stop unwrapping.
Happy Birthday, my love. Here's to you; the most beautiful soul I've ever known.`;

export default function PostCard({
  toName = 'Bhavi',
  fromName = 'Aditya',
  salutation = 'My Love, Bhavi',
  bodyText = DEFAULT_BODY,
  date = '12/05',
  id,
}) {
  const [phase, setPhase] = useState(0); // 0: To, 1: From, 2: Salutation, 3: Body, 4: Done

  return (
    <div id={id} className={styles.page}>
      {/* wiggly-box mask applied here — this is the scalloped card */}
      <div className={styles.card}>
        {/* Content lives inside a padded inner div so padding is
            independent of the mask geometry */}
        <div className={styles.cardContent}>
          {/* SECTION 1 — Title */}
          <h1 className={styles.title}>A Love Letter</h1>

          {/* SECTION 2 — Recipients + Stamps */}
          <div className={styles.recipientRow}>
            <div className={styles.recipientBlock}>
              <div className={styles.recipientLine}>
                <span className={styles.label}>To:</span>
                <span className={styles.name}>
                  <TypingText
                    text={toName}
                    shouldStart={phase >= 0}
                    speed={50}
                    onComplete={() => setPhase((p) => Math.max(p, 1))}
                  />
                </span>
                <span className={styles.underline} aria-hidden="true" />
              </div>
              <div className={styles.recipientLine}>
                <span className={styles.label}>From:</span>
                <span className={styles.name}>
                  <TypingText
                    text={fromName}
                    shouldStart={phase >= 1}
                    speed={50}
                    onComplete={() => setPhase((p) => Math.max(p, 2))}
                  />
                </span>
                <span className={styles.underline} aria-hidden="true" />
              </div>
            </div>

            <div className={styles.stamps} aria-label="Postal stamps">
              <StampHeart />
              <StampKey />
            </div>
          </div>

          {/* SECTION 3 — Salutation */}
          <p className={styles.salutation}>
            <TypingText
              text={salutation}
              shouldStart={phase >= 2}
              speed={40}
              onComplete={() => setPhase((p) => Math.max(p, 3))}
            />
          </p>

          {/* SECTION 4 — Body */}
          <div className={styles.body}>
            <TypingText
              text={bodyText}
              shouldStart={phase >= 3}
              speed={25}
              onComplete={() => setPhase((p) => Math.max(p, 4))}
            />
          </div>

          {/* Decorative divider */}
          <div className={styles.divider} aria-hidden="true">
            <span className={styles.dividerHeart}>♥</span>
          </div>

          {/* SECTION 5 — Footer */}
          <footer className={styles.footer}>
            <span className={styles.date}>{date}</span>
            <div className={styles.greeting} aria-label="Happy Birthday Love">
              <span className={styles.happyText}>happy</span>
              <span className={styles.valentinesText}>Birthday Love</span>
            </div>
            <Postmark />
          </footer>
        </div>
      </div>
    </div>
  );
}

PostCard.defaultProps = {
  toName: 'Bhavi',
  fromName: 'Aditya',
  salutation: 'My Love, Bhavi',
  bodyText: DEFAULT_BODY,
  date: '12/05',
};
