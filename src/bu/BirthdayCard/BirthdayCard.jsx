import React from 'react';
import styles from './BirthdayCard.module.css';
import StickFigures from '../Charms/StickFigures/StickFigures';

/**
 * BirthdayCard
 * Placeholder card — same scalloped shell as PostCard.
 * Items will be added progressively.
 */
export default function BirthdayCard() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cardContent}>
          {/* ── StickFigures charm ── */}
          <div className={styles.charmCenter}>
            <StickFigures />
          </div>
        </div>
      </div>
    </div>
  );
}
