import { useState } from 'react';
import styles from './NoteModal.module.css';
import { FONTS } from '../../constants/design';
import type { NoteModalProps } from '../../types';

export function NoteModal({ itemId, initialNote, onSave, onClose }: NoteModalProps) {
  const [note, setNote] = useState(initialNote);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 14 }}>
          Agregar nota
        </div>
        <textarea
          className={styles.input}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="ej: sin cebolla, extra picante..."
          autoFocus
        />
        <div className={styles.buttons}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancelar
          </button>
          <button 
            className={styles.saveBtn} 
            onClick={() => { onSave(itemId, note); onClose(); }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
