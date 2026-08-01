import styles from './ModeSwitch.module.css';

interface ModeSwitchProps {
  mode: 'story' | 'bento';
  onChangeMode: (mode: 'story' | 'bento') => void;
  currentIndex?: number;
  totalSlides?: number;
}

export default function ModeSwitch({ mode, onChangeMode, currentIndex, totalSlides }: ModeSwitchProps) {
  return (
    <div className={styles.headerBar}>
      <div className={styles.brandTitle}>
        <span className={styles.heartIcon}>♡</span>
        <span className={styles.brandText}>Chat Wrapped</span>
      </div>

      <div className={styles.switchContainer}>
        <button
          type="button"
          className={`${styles.switchBtn} ${mode === 'story' ? styles.activeBtn : ''}`}
          onClick={() => onChangeMode('story')}
          title="Story Mode (Slide by Slide)"
        >
          <span className={styles.btnIcon}>✨</span>
          <span className={styles.btnLabel}>Story Mode</span>
          {mode === 'story' && currentIndex !== undefined && totalSlides !== undefined && (
            <span className={styles.badge}>{currentIndex + 1}/{totalSlides}</span>
          )}
        </button>

        <button
          type="button"
          className={`${styles.switchBtn} ${mode === 'bento' ? styles.activeBtn : ''}`}
          onClick={() => onChangeMode('bento')}
          title="Bento Grid Dashboard View"
        >
          <span className={styles.btnIcon}>🍱</span>
          <span className={styles.btnLabel}>Bento Grid</span>
        </button>
      </div>
    </div>
  );
}
