import type { StatusStyle } from '../types'

export const FONTS = {
  display: "'Syne', sans-serif",
  body:    "'Outfit', sans-serif",
  mono:    "'Fira Code', monospace",
} as const

export const STATUS_COLORS: Record<string, StatusStyle> = {
  pending:   { bg:'rgba(249,115,22,0.15)',  border:'rgba(249,115,22,0.40)',  text:'#F97316' },
  preparing: { bg:'rgba(59,130,246,0.15)',  border:'rgba(59,130,246,0.40)',  text:'#3B82F6' },
  ready:     { bg:'rgba(16,185,129,0.15)',  border:'rgba(16,185,129,0.40)',  text:'#10B981' },
  delivered: { bg:'rgba(148,163,184,0.15)', border:'rgba(148,163,184,0.30)', text:'#94A3B8' },
}

export const STATUS_LABELS: Record<string, string> = {
  Pending:   'Pendiente',
  Preparing: 'Preparando',
  Ready:     'Listo ✓',
  Delivered: 'Entregado',
}

export const ACTION_LABELS: Record<string, string> = {
  Pending:   '▶ Iniciar',
  Preparing: '✓ Listo',
  Ready:     '↗ Entregar',
}

export const ACTION_GRADIENTS: Record<string, string> = {
  Pending:   'linear-gradient(135deg,#3B82F6,#6366F1)',
  Preparing_Kitchen: 'linear-gradient(135deg,#10B981,#059669)',
  Preparing_Bar:     'linear-gradient(135deg,#8B5CF6,#6366F1)',
  Ready:     'linear-gradient(135deg,#64748B,#475569)',
}

export const NEXT_STATUS: Partial<Record<string, string>> = {
  Pending:   'Preparing',
  Preparing: 'Ready',
  Ready:     'Delivered',
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
