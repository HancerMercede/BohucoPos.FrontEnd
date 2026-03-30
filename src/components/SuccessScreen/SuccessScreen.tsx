import styles from "./SuccessScreen.module.css";
import { FONTS } from "../../constants/design";

export function SuccessScreen() {
  return (
    <div className={styles.successContainer}>
      <div className={styles.successIcon}>✓</div>
      <div className={styles.successTitle}>¡Orden Enviada!</div>
      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: 14,
          color: "rgba(255,255,255,.45)",
        }}
      >
        Notificando cocina y barra en tiempo real...
      </div>
    </div>
  );
}
