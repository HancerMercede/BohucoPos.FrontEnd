# Changelog - BOHUCO POS Frontend

## [1.2.1] - 2026-03-11

### Added - Item Destination (Kitchen/Bar)
- Send destination when creating orders from frontend
- Backend now accepts destination from frontend (0=Kitchen, 1=Bar)
- Fixed item destination mapping in TabDetailModal
- Uses lowercase "destination" to match backend response
- Fix item destination mapping to handle both string ('Bar', 'Kitchen') and number (0, 1) formats from backend
- Create mapOrderItems helper to reuse mapping logic across fetchTabsByLocation and fetchTabDetails

### Fixed - Tab System Integration Issues

- **Tab Entity ID Auto-Increment**: Fixed duplicate key error when opening tabs
  - Removed manual static sequence in Tab.cs (was causing ID collision)
  - Added `ValueGeneratedOnAdd()` to Tab Id in AppDbContext.cs
  - Now uses database auto-increment instead of manual ID generation
- **Payment Method Enum**: Backend expects numeric enum values (0=Cash, 1=Card, 2=Transfer), not string literals
  - Fixed `closeTab` in orderStore.ts to convert payment method to numeric value
  - Updated TabDetailModal to pass correct format

- **Table Status Updates**: Tables now properly update based on active tabs from database
  - All tables initialize as 'free'
  - When tabs are loaded from DB, tables with active tabs become 'occupied'
  - When a tab is closed and no more tabs exist for that table, it becomes 'free' again
  - Fixed `getTableState` in TableSelector to handle both 'occupied' and 'has-tabs' status

- **Selected Tab Context**: Fixed issue where new orders weren't linking to the correct tab
  - `openTab` in orderStore now sets `selectedTab` after creating the tab
  - `handleOpenTab` in WaiterView now calls `goToMenu` to navigate after opening tab

- **Item Destination**: Items now correctly save their destination (Kitchen/Bar)
  - Added `destination` field when creating orders in submitOrder
  - Fixed mapping in `fetchTabsByLocation` to preserve `Destination` from backend

- **UI Fixes**:
  - "Volver" button now uses `goBackToTables()` to return to table selector
  - Modal buttons now properly close and navigate after actions
  - Fixed TabDetailModal to show action buttons for both 'OPEN' and 'Open' status

---

## [1.2.0] - 2026-03-11

### Added - Tab System (Account/Tab Management)
Implemented full account/tab functionality per `bohuco-pos-logica-cuentas.md`:

**Backend (.NET)**
- `Tab` entity with status (Open, Pending, Closed, Cancelled)
- `PaymentMethod` enum (Cash, Card, Transfer)
- New API endpoints:
  - POST `/api/tabs` - Open new tab
  - GET `/api/tabs/location/{location}` - Get active tabs by location
  - GET `/api/tabs/{tabId}` - Get tab details
  - GET `/api/tabs/open` - Get all open tables with tab counts
  - POST `/api/tabs/orders` - Add order to tab
  - POST `/api/tabs/{tabId}/request-bill` - Request bill (Open → Pending)
  - POST `/api/tabs/{tabId}/close` - Close and pay
  - POST `/api/tabs/{tabId}/cancel` - Cancel tab

**Frontend (React)**
- `Tab` types in `types/index.ts`
- Updated `orderStore.ts` with tab state and actions
- New components:
  - `OpenTabModal` - Modal to open new account with customer name
  - `TabList` - List of active tabs per table
  - `TabDetail` - Full tab view with orders, totals, and actions
- Updated `WaiterView`:
  - Table status: yellow "Cuentas" for tables with active tabs
  - Click occupied table → shows tab list
  - Open tab → adds to tab, not direct to order
  - Order creation links to tab for accumulation
  - Request bill, close & pay, cancel actions

**Database**
- Migration created and applied: `AddTabs`
- Tables: `Tabs` with columns (Id, Location, CustomerName, WaiterId, WaiterName, Status, etc.)
- Orders now have optional `TabId` foreign key

### Fixed
- Tab Command Handlers now use `IUnitOfWork` for consistency:
  - `OpenTabCommandHandler`
  - `AddOrderToTabCommandHandler`
  - `CloseTabCommandHandler`
  - `CancelTabCommandHandler`
- `Order.TabId` property changed to public setter for linking orders to tabs

---

## [1.1.0] - 2026-03-10

### Added
- **API Integration**: Full backend integration with proper enum mapping
  - Status conversion: string to numeric enum (Pending=0, Preparing=1, Ready=2, Delivered=3)
  - Table ID to display name mapping
  - Order type as number (0=Table, 1=Bar)

### Fixed Issues
- **Duplicate Orders**: Added `clearFirst` parameter to prevent order duplication when switching views
- **Orders not disappearing**: Items now hide when status is "Delivered"
- **Badge TypeError**: Fixed `status.toLowerCase is not a function` by handling both string and number statuses
- **Overview Stats**: Fixed items count for Kitchen, Bar, and Ready items
- **Performance**: Added `useMemo` and `useCallback` for optimized re-renders

### Updated
- Display titles: "Kitchen Display" → "COCINA", "Bar Display" → "BAR"
- DisplayView uses `fetchPendingOrders` with `clearFirst=true` to always load fresh data

---

## [1.0.0] - 2026-03-10

### Added
- **Framework Setup**: React + TypeScript + Vite project initialized
- **State Management**: Zustand store (`orderStore.ts`) for global state
- **Routing**: View-based navigation (waiter, kitchen, bar, overview)
- **SignalR Integration**: Real-time updates via SignalR Hub

### Components Created (CSS Modules)
- **Background**: Animated orbs and grid background
- **TopBar**: Navigation with logo, tabs, and SignalR status indicator
- **Badge**: Order status badges (Pending, Preparing, Ready, Delivered)
- **DestTag**: Kitchen/Bar destination tags

### Views Created
- **WaiterView**: Table selection and order creation with cart
- **DisplayView**: Kitchen and Bar display for order management
- **OverviewView**: Real-time dashboard with stats and order table

### Styling
- Design tokens (fonts, colors, spacing) in `constants/design.ts`
- CSS variables in `styles/variables.css`
- Global styles and animations in `styles/globals.css`
- All components use CSS Modules (`.module.css`)

### API Integration
- POST `/api/orders` - Create new order
- GET `/api/orders/pending/{destination}` - Fetch pending orders
- PATCH `/api/orders/items/{id}/status` - Update order item status
- SignalR Hub at `/hubs/orders` for real-time updates

### Fixed Issues
- Header width: 100% fullscreen with content centered at 1280px
- TopBar structure: `.nav` (full width) + `.inner` (1280px centered)
- Text alignment issues resolved
- CSS Module styling consistency across all components

### Design Tokens
- **Fonts**: Syne (display), Outfit (body), Fira Code (mono)
- **Background**: Dark gradient (#0a0f1e → #14082e → #071a30)
- **Glassmorphism**: Backdrop blur effects on cards and panels
- **Animations**: pulse-dot, float-in, success-pop

---

## Previous Notes
- Frontend was rebuilt from scratch after accidental deletion
- Followed `bohuco-pos-frontend-spec.md` specification
- Used as reference: `NexusPOS.jsx` for design patterns
