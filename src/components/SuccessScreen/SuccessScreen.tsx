import styles from './SuccessScreen.module.css';
import { FONTS } from '../../constants/design';

export function SuccessScreen() {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>✓</div>
      <div style={{ fontFamily: FONTS.display, fontSize: 32, fontWeight: 800, color: '#fff' }}>
        ¡Orden Enviada!
      </div>
      <div style={{ fontFamily: FONTS.body, fontSize: 14, color: 'rgba(255,255,255,.45)' }}>
        Notificando cocina y barra en tiempo real...
      </div>
    </div>
  );
}
