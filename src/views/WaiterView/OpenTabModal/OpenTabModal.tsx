import { useState } from 'react'
import type { OpenTabModalProps } from '../../../types'
import styles from './OpenTabModal.module.css'

export function OpenTabModal({ table, onConfirm, onClose }: OpenTabModalProps) {
  const [name, setName] = useState('')
  const isBar = table.type === 'bar'
  const canSubmit = isBar ? name.trim().length > 0 : true

  const handleSubmit = () => {
    if (!canSubmit) return
    onConfirm(name.trim() || 'Cliente')
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canSubmit) handleSubmit()
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <div className={styles.header}>
          <div className={styles.headerIcon}>
            {isBar ? '🪑' : '🍽️'}
          </div>
          <div>
            <h3 className={styles.title}>{table.name}</h3>
            <p className={styles.subtitle}>Abrir nueva cuenta</p>
          </div>
        </div>

        <div className={styles.body}>
          <label className={styles.label}>
            Nombre del cliente
            {isBar && <span className={styles.required}> *requerido</span>}
          </label>
          <input
            className={styles.input}
            type="text"
            placeholder={isBar ? 'ej: Luis, Ana, Mesa de Carlos...' : 'ej: Juan (opcional)'}
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={handleKey}
            autoFocus
            maxLength={40}
          />
          {isBar && !name.trim() && (
            <p className={styles.hint}>
              En barra es obligatorio identificar al cliente para separar cuentas.
            </p>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.btnCancel} onClick={onClose}>
            Cancelar
          </button>
          <button
            className={styles.btnConfirm}
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              background: canSubmit
                ? 'linear-gradient(135deg, #3B82F6, #8B5CF6)'
                : 'rgba(255,255,255,0.08)',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              opacity: canSubmit ? 1 : 0.5,
            }}
          >
            Abrir Cuenta →
          </button>
        </div>

      </div>
    </div>
  )
}
