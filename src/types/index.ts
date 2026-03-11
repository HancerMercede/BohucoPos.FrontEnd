// ─── ENUMS ───────────────────────────────────────────────────────

export type OrderType = 'Table' | 'Bar' | 'TakeAway' | 'Delivery'

export type OrderStatus =
  | 'Pending'
  | 'InProgress'
  | 'Ready'
  | 'Delivered'
  | 'Cancelled'

export type ItemStatus =
  | 'Pending'
  | 'Preparing'
  | 'Ready'
  | 'Delivered'

export type ItemDestination = 'Kitchen' | 'Bar'

export type TableStatus = 'free' | 'occupied' | 'has-tabs'

export type ViewId = 'waiter' | 'kitchen' | 'bar' | 'overview'

export type WaiterStep = 'tables' | 'menu' | 'tabs'

export type MenuCategory = 'Todos' | 'Platos' | 'Entradas' | 'Bebidas'

export type TabStatus = 'Open' | 'Pending' | 'Closed' | 'Cancelled'

export type PaymentMethod = 'Cash' | 'Card' | 'Transfer'

// ─── ENTITIES ────────────────────────────────────────────────────

export interface OrderItem {
  id: number
  orderId?: number
  productId?: string
  productName: string
  name?: string
  unitPrice?: number
  quantity: number
  qty?: number
  notes: string
  destination?: ItemDestination
  dest?: ItemDestination
  status: ItemStatus
}

export interface Order {
  id: number
  idDisplay?: string
  orderType?: OrderType
  type?: OrderType
  status: OrderStatus
  tableId?: string | null
  table?: string
  waiterName?: string
  waiter?: string
  createdAt: string
  items: OrderItem[]
}

export interface MenuItem {
  id: string
  name: string
  price: number
  dest: ItemDestination
  category: Exclude<MenuCategory, 'Todos'>
  emoji: string
}

export interface TableItem {
  id: string
  name: string
  status: TableStatus
  type?: 'bar'
}

export interface Tab {
  id: number
  idDisplay: string
  location: string
  customerName: string
  waiterName: string
  status: TabStatus
  openedAt: string
  closedAt?: string
  paymentMethod?: PaymentMethod
  subtotal: number
  tax: number
  total: number
  notes?: string
  orders: Order[]
}

// ─── CART ────────────────────────────────────────────────────────

export interface CartItem extends MenuItem {
  qty: number
  notes: string
}

// ─── DESIGN SYSTEM ────────────────────────────────────────────────

export interface StatusStyle {
  bg: string
  border: string
  text: string
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
  status: ItemStatus | OrderStatus
}

export interface DestTagProps {
  dest: ItemDestination
}

export interface TopBarProps {
  view: ViewId
  setView: (view: ViewId) => void
}

export interface DisplayViewProps {
  dest: ItemDestination
}

export interface OrderCardProps {
  order: Order
  dest: ItemDestination
  onUpdateStatus: (orderId: string, itemId: number, newStatus: ItemStatus) => void
}

export interface ItemRowProps {
  item: OrderItem
  accentGrad: string
  accentGlow: string
  onUpdateStatus: (itemId: number, newStatus: ItemStatus) => void
}

export interface StatCardProps {
  data: StatCardData
  animationDelay: number
}

export interface NoteModalProps {
  itemId: string
  initialNote: string
  onSave: (itemId: string, note: string) => void
  onClose: () => void
}

export interface TableSelectorProps {
  tables: TableItem[]
  onSelect: (table: TableItem) => void
}

export interface MenuPanelProps {
  selectedTable: TableItem
  items: MenuItem[]
  cart: CartItem[]
  onAdd: (item: MenuItem) => void
  onBack: () => void
  activeCategory: MenuCategory
  onCategoryChange: (cat: MenuCategory) => void
}

export interface CartSidebarProps {
  cart: CartItem[]
  selectedTable: TableItem
  onAdd: (item: MenuItem) => void
  onRemove: (itemId: string) => void
  onAddNote: (itemId: string, note: string) => void
  onSend: () => void
}
