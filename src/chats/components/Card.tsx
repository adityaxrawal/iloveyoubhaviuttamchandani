import type { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  label?: string;
  title?: string;
  subtitle?: string;
  footer?: string;
  children: ReactNode;
}

export default function Card({ label, title, subtitle, footer, children }: CardProps) {
  return (
    <div className={styles.card}>
      {label && <p className={styles.label}>{label}</p>}
      {title && <h2 className={styles.title}>{title}</h2>}
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      <div className={styles.body}>{children}</div>
      {footer && <p className={styles.footer}>{footer}</p>}
      <span className={styles.heart} aria-hidden="true">♡</span>
    </div>
  );
}
