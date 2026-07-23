import { useTheme } from './theme';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button type="button" className={styles.button} onClick={toggle}>
      {theme === 'wrapped' ? 'Letter theme' : 'Wrapped theme'}
    </button>
  );
}
