import styles from './Background.module.css';

export function Background() {
  return (
    <div className={styles.bg}>
      <div className={styles.gradient} />
      <div className={styles.orbBlue} />
      <div className={styles.orbPurple} />
      <div className={styles.orbGreen} />
      <div className={styles.orbOrange} />
      <div className={styles.grid} />
    </div>
  );
}
