import React from 'react';
import styles from './LoveCard.module.css';
import StickFigures from '../Charms/StickFigures/StickFigures';

/**
 * LoveCard
 * Same layout as BirthdayCard with user-provided stamp effect.
 */
export default function LoveCard() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.charmCenter}>
          <StickFigures />
        </div>
      </div>
    </div>
  );
}
