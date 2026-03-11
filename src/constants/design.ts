import type { StatusStyle } from '../types'

export const FONTS = {
  display: "'Syne', sans-serif",
  body:    "'Outfit', sans-serif",
  mono:    "'Fira Code', monospace",
} as const

export const TAX_RATE = 0.18

export const STATUS_COLORS: Record<string, StatusStyle> = {
  pending:   { label:'Pendiente',  color:'#F97316', bg:'rgba(249,115,22,0.15)',  border:'rgba(249,115,22,0.40)',  text:'#F97316' },
  preparing: { label:'Preparando', color:'#3B82F6', bg:'rgba(59,130,246,0.15)',  border:'rgba(59,130,246,0.40)',  text:'#3B82F6' },
  ready:     { label:'Listo ✓',   color:'#10B981', bg:'rgba(16,185,129,0.15)',  border:'rgba(16,185,129,0.40)',  text:'#10B981' },
  delivered: { label:'Entregado',  color:'#94A3B8', bg:'rgba(148,163,184,0.15)', border:'rgba(148,163,184,0.30)', text:'#94A3B8' },
}

export const STATUS_LABELS: Record<string, string> = {
  Pending:   'Pendiente',
  Preparing: 'Preparando',
  Ready:     'Listo ✓',
  Delivered: 'Entregado',
}

export const TAB_STATUS_COLORS: Record<string, StatusStyle> = {
  OPEN:      { label:'Abierta',   color:'#10B981', bg:'rgba(16,185,129,0.15)',  border:'rgba(16,185,129,0.40)'  },
  PENDING:   { label:'Cuenta',    color:'#F97316', bg:'rgba(249,115,22,0.15)',  border:'rgba(249,115,22,0.40)'  },
  CLOSED:    { label:'Cerrada',   color:'#94A3B8', bg:'rgba(148,163,184,0.15)', border:'rgba(148,163,184,0.30)' },
  CANCELLED: { label:'Cancelada', color:'#EF4444', bg:'rgba(239,68,68,0.15)',   border:'rgba(239,68,68,0.40)'   },
  Open:      { label:'Abierta',   color:'#10B981', bg:'rgba(16,185,129,0.15)',  border:'rgba(16,185,129,0.40)'  },
  Pending:   { label:'Cuenta',    color:'#F97316', bg:'rgba(249,115,22,0.15)',  border:'rgba(249,115,22,0.40)'  },
  Closed:    { label:'Cerrada',   color:'#94A3B8', bg:'rgba(148,163,184,0.15)', border:'rgba(148,163,184,0.30)' },
  Cancelled: { label:'Cancelada', color:'#EF4444', bg:'rgba(239,68,68,0.15)',   border:'rgba(239,68,68,0.40)'   },
}

export const ACTION_LABELS: Record<string, string> = {
  Pending:   '▶ Iniciar',
  Preparing: '✓ Listo',
  Ready:     '↗ Entregar',
}

export const ACTION_GRADIENTS: Record<string, string> = {
  primary:   'linear-gradient(135deg, #3B82F6, #8B5CF6)',
  kitchen:   'linear-gradient(135deg, #10B981, #059669)',
  bar:       'linear-gradient(135deg, #8B5CF6, #6366F1)',
  danger:    'linear-gradient(135deg, #EF4444, #DC2626)',
  pending:   'linear-gradient(135deg, #F97316, #EA580C)',
  slate:     'linear-gradient(135deg, #64748B, #475569)',
}

export const NEXT_STATUS: Partial<Record<string, string>> = {
  Pending:   'Preparing',
  Preparing: 'Ready',
  Ready:     'Delivered',
}

export const PAYMENT_LABELS: Record<string, string> = {
  CASH:     '💵 Efectivo',
  CARD:     '💳 Tarjeta',
  TRANSFER: '📲 Transferencia',
}

export const DISPLAY_CONFIG = {
  Kitchen: {
    icon:       '🍳',
    title:      'COCINA',
    accentColor:'#34D399',
    accentGrad: 'linear-gradient(135deg,#10B981,#059669)',
    accentGlow: 'rgba(16,185,129,.35)',
  },
  Bar: {
    icon:       '🍹',
    title:      'BAR',
    accentColor:'#A78BFA',
    accentGrad: 'linear-gradient(135deg,#8B5CF6,#6366F1)',
    accentGlow: 'rgba(139,92,246,.35)',
  },
} as const

export const NAV_TABS = [
  { id: 'waiter',   icon: '🧾', label: 'Mesero'  },
  { id: 'kitchen',  icon: '🍳', label: 'Cocina'  },
  { id: 'bar',      icon: '🍹', label: 'Barra'   },
  { id: 'overview', icon: '📊', label: 'Resumen' },
] as const
