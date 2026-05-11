import React from 'react';
import styles from './Footer.module.css';
import ILY from '../Charms/ILY/ILY';

/**
 * Footer
 * Just giant text centered in the maroon background.
 */
export default function Footer() {
  return (
    <section id="footer" className={styles.section}>
      <div className={styles.footerSectionContent}>
        {/* <h1 className={styles.footerLoveText}>I love you.</h1> */}
        <ILY/>
      </div>
    </section>
  );
}
