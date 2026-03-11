// ─── ENUMS / UNION TYPES ─────────────────────────────────────────

export type OrderType      = 'Table' | 'Bar' | 'TakeAway' | 'Delivery'
export type OrderStatus    = 'Pending' | 'InProgress' | 'Ready' | 'Delivered' | 'Cancelled'
export type ItemStatus     = 'Pending' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled'
export type ItemDestination= 'Kitchen' | 'Bar'
export type TableStatus    = 'free' | 'occupied' | 'pending' | 'has-tabs'
export type TableType      = 'table' | 'bar'
export type ViewId         = 'waiter' | 'kitchen' | 'bar' | 'overview'
export type WaiterStep     = 'tables' | 'menu' | 'tabs'
export type MenuCategory   = 'Todos' | 'Platos' | 'Entradas' | 'Bebidas'
export type TabStatus      = 'OPEN' | 'PENDING' | 'CLOSED' | 'CANCELLED' | 'Open' | 'Pending' | 'Closed' | 'Cancelled'
export type PaymentMethod  = 'CASH' | 'CARD' | 'TRANSFER' | 'Cash' | 'Card' | 'Transfer'

// ─── CORE ENTITIES ───────────────────────────────────────────────

export interface OrderItem {
  id: number
  orderId?: number
  productId?: string
  productName?: string
  name?: string
  unitPrice?: number
  price?: number
  quantity?: number
  qty?: number
  notes: string
  destination?: ItemDestination
  dest?: ItemDestination
  status: ItemStatus
}

export interface Order {
  id: number | string
  idDisplay?: string
  tabId?: string
  table?: string
  waiterName?: string
  waiter?: string
  tableId?: string | null
  orderType?: OrderType
  type?: OrderType
  status: OrderStatus
  createdAt: string
  items: OrderItem[]
}

export interface Tab {
  id: number
  idDisplay?: string
  location: string
  customerName: string
  waiterId: string
  waiterName?: string
  status: TabStatus
  openedAt: string
  closedAt?: string
  orders: Order[]
  paymentMethod?: PaymentMethod
  notes?: string
  subtotal?: number
  tax?: number
  total?: number
}

export interface TableItem {
  id: string
  name: string
  status: TableStatus
  type?: TableType
}

export interface MenuItem {
  id: string
  name: string
  price: number
  dest: ItemDestination
  category: Exclude<MenuCategory, 'Todos'>
  emoji: string
}

export interface CartItem extends MenuItem {
  qty: number
  notes: string
}

// ─── COMPUTED / UI HELPERS ─────────────────────────────────────────

export interface StatusStyle {
  label?: string
  color?: string
  bg: string
  border: string
  text?: string
}

export interface StatCardData {
  label: string
  value: number
  icon: string
  grad: string
  glow: string
}

// ─── COMPONENT PROPS ─────────────────────────────────────────────

export interface BadgeProps {
  status: ItemStatus | OrderStatus | TabStatus
}

export interface DestTagProps {
  dest: ItemDestination
}

export interface TopBarProps {
  view: ViewId
  setView: (view: ViewId) => void
}

export interface TableSelectorProps {
  tables: TableItem[]
  tabsByTable: Record<string, Tab[]>
  onSelectFree: (table: TableItem) => void
  onSelectOccupied: (table: TableItem) => void
}

export interface OpenTabModalProps {
  table: TableItem
  onConfirm: (customerName: string) => void
  onClose: () => void
}

export interface TabsModalProps {
  table: TableItem
  tabs: Tab[]
  onViewTab: (tab: Tab) => void
  onNewTab: () => void
  onClose: () => void
}

export interface TabDetailModalProps {
  tab: Tab
  table: TableItem
  onClose: () => void
  onAddOrder: () => void
  onRequestBill?: () => void
  onCloseTab?: (paymentMethod: PaymentMethod) => void
}

export interface NoteModalProps {
  itemId: string
  initialNote: string
  onSave: (itemId: string, note: string) => void
  onClose: () => void
}

export interface DisplayViewProps {
  dest: ItemDestination
}
