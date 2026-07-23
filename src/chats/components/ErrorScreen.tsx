import styles from './ErrorScreen.module.css';

interface ErrorScreenProps {
  message: string;
}

export default function ErrorScreen({ message }: ErrorScreenProps) {
  return (
    <div className={styles.wrap}>
      <p>{message}</p>
    </div>
  );
}
