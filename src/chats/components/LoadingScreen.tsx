import styles from './LoadingScreen.module.css';

export default function LoadingScreen() {
  return (
    <div className={styles.wrap}>
      <span className={styles.heart} aria-hidden="true">♡</span>
    </div>
  );
}
