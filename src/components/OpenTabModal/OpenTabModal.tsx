import { useState } from 'react';
import styles from './OpenTabModal.module.css';

interface OpenTabModalProps {
  location: string;
  isBar: boolean;
  onOpen: (customerName: string) => void;
  onClose: () => void;
}

export const OpenTabModal = ({ location, isBar, onOpen, onClose }: OpenTabModalProps) => {
  const [customerName, setCustomerName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBar && !customerName.trim()) {
      setError('El nombre es obligatorio en la barra');
      return;
    }
    
    onOpen(customerName.trim());
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{location} — Nueva Cuenta</h2>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Nombre del cliente</label>
            <input
              type="text"
              className={styles.input}
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                setError('');
              }}
              placeholder={isBar ? 'Obligatorio' : 'Opcional'}
              autoFocus
            />
            {error && <span className={styles.error}>{error}</span>}
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitBtn}>
              Abrir Cuenta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
