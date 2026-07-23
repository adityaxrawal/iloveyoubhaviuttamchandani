import styles from './ErrorScreen.module.css';

interface ErrorScreenProps {
  message: string;
}

export default function ErrorScreen({ message }: ErrorScreenProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.stage}>
        <p>{message}</p>
      </div>
    </div>
  );
}
