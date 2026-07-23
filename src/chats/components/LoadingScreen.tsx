import styles from './LoadingScreen.module.css';

export default function LoadingScreen() {
  return (
    <div className={styles.wrap}>
      <div className={styles.stage}>
        <span className={styles.heart} aria-hidden="true">♡</span>
      </div>
    </div>
  );
}
