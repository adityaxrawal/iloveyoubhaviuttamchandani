import React from 'react';
import styles from './Messages.module.css';

/**
 * Reusable TextSection component for sections 2 and 4
 */
export default function Messages({ id, heading, body }) {
  return (
    <section id={id} className={styles.section}>
      <div className={styles.textSectionContent}>
        <h2 className={styles.textHeading}>{heading}</h2>
        <p className={styles.textBody}>{body}</p>
      </div>
    </section>
  );
}
