# BOHUCO POS Frontend

Modern restaurant order management system frontend built with React, TypeScript, and Vite.

## Overview

BOHUCO POS is a comprehensive restaurant management application designed for waitstaff to manage table orders, tab accounts, and kitchen/bar workflows efficiently. The system supports both table service and bar operations with real-time order tracking.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **State Management**: Zustand
- **Routing**: React Router
- **Real-time**: SignalR
- **Styling**: CSS Modules
- **HTTP Client**: Fetch API
- **Package Manager**: npm

## Project Structure

```
NexusPOS.Frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── DestTag/         # Destination tag (Kitchen/Bar)
│   │   └── CartBadge/       # Shopping cart badge
│   ├── constants/           # App constants and design tokens
│   ├── stores/              # Zustand state management
│   │   └── orderStore.ts   # Main order/tab state management
│   ├── types/              # TypeScript type definitions
│   ├── views/              # Page components
│   │   └── WaiterView/     # Main waiter interface
│   │       ├── WaiterView.tsx
│   │       ├── TableSelector/        # Table/bar grid display
│   │       ├── OpenTabModal/        # New account modal
│   │       ├── TabsModal/           # Account list modal
│   │       └── TabDetailModal/     # Account detail modal
│   ├── App.tsx            # Root application component
│   └── main.tsx           # Entry point
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── CHANGELOG.md          # Version history
```

## Features

### Authentication & Roles
- JWT-based authentication with login/register
- Role-based access control (Waiter, Kitchen, Bar, Admin)
- Persistent auth with token storage
- Role-based navigation (Admin sees Products & Dashboard tabs)

### Table Management
- Visual grid display of tables and bar seats
- Real-time status indicators (Free/Occupied/Pending)
- Tab count badges showing active accounts per table
- Larger, more visible cards for better UX

### Tab (Account) System
- **Open Tab**: Create new accounts with optional customer name (required for bar)
- **View Accounts**: See all active accounts per table/bar
- **Account Details**: View full order history with:
  - Order ID and time (e.g., ORD-0028, 14:35)
  - Product items with quantities and prices
  - Destination tags (Kitchen/Bar)
  - Subtotal, tax, and total calculation
- **Add Order**: Navigate to menu to add new orders
- **Request Bill**: Mark account as pending payment
- **Close & Charge**: Process payment (Card/Cash/Transfer)

### Order Management
- Menu display with categories (Platos, Bebidas, Entradas)
- Product cards with emoji, name, and price
- Destination-based routing (Kitchen/Bar)
- Shopping cart with item management
- Real-time status updates via SignalR with JWT auth

### Products Management (Admin)
- Full CRUD operations for menu products
- Search functionality
- Pagination (5 items per page)
- Fields: name, price, category, destination (Kitchen/Bar), emoji

### Manager Dashboard (Admin)
- Sales analytics with date range filtering
- Low inventory alerts
- Sales totals and counts
- Pagination (5 items per page)

### PDF Bill Generation
- Generate PDF bills for closed tabs
- Includes all orders, items, notes, tax breakdown

### Navigation Flow
1. **Login** → Authenticate with role
2. **Table Selection** → Select table/bar
3. **Account Selection** → Choose existing account or create new
4. **Menu** → Browse and add products
5. **Cart Review** → Review and send order
6. **Account Details** → View all orders and totals

## API Integration

The frontend connects to the BOHUCO POS Backend API at `https://localhost:7089`:

### Endpoints Used
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/tabs/active` - Get all active tabs
- `GET /api/tabs/location/{location}` - Get tabs by location
- `GET /api/tabs/{id}` - Get tab details
- `POST /api/tabs` - Open new tab
- `POST /api/tabs/{id}/request-bill` - Request bill
- `POST /api/tabs/{id}/close` - Close tab with payment
- `POST /api/tabs/{id}/cancel` - Cancel tab
- `POST /api/orders` - Create new order
- `POST /api/tabs/orders` - Link order to tab
- `GET /api/orders/destination/{destination}` - Get pending orders
- `PATCH /api/orders/items/{itemId}/status` - Update item status

### Products API (Admin)
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Dashboard API (Admin)
- `GET /api/dashboard/sales` - Sales analytics
- `GET /api/dashboard/low-inventory` - Low stock items

### PDF
- `GET /api/pdf/bill/{tabId}` - Generate PDF bill

### Real-time Updates
- SignalR hub at `/hubs/orders` with JWT token for live order status
- Waiter joins notification group on login
- Toast notifications for order item status changes

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- BOHUCO POS Backend running on port 7089

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173`

### Production Build

```bash
npm run build
```

### Type Checking

```bash
npm run typecheck
```

## State Management

The app uses Zustand for global state management:

### Auth Store (`src/stores/authStore.ts`)
```typescript
interface AuthStore {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  // actions
  login: (token: string, user: User) => void
  logout: () => void
}
```

### Order Store (`src/stores/orderStore.ts`)
```typescript
interface OrderStore {
  tables: TableItem[]
  tabs: Tab[]
  selectedTable: TableItem | null
  selectedTab: Tab | null
  cart: CartItem[]
  orders: Order[]
  // ... actions
}
```

Key actions:
- `fetchTabsByLocation()` - Load tabs from API
- `openTab()` - Create new account
- `submitOrder()` - Send order to kitchen/bar
- `closeTab()` - Close account with payment method
- `loadSignalR()` - Initialize SignalR with JWT token

## Environment

The frontend expects the backend API at:
```typescript
const API_URL = 'https://localhost:7089';
```

To change the API URL, edit `src/stores/orderStore.ts`.

## Design System

Custom design tokens in `src/constants/design.ts`:
- Status colors for tabs (Open, Pending, Closed, Cancelled)
- Tax rate configuration (18% ITBIS)
- Color palette for UI components

## Contributing

1. Create a feature branch from `development`
2. Make changes and commit
3. Create PR to `development` branch
4. Merge to `main` after review

## State Management

### Auth Store (`src/stores/authStore.ts`)
- JWT token storage and retrieval
- User info (id, firstName, lastName, email, role)
- Role-based access checks
- Login/logout actions
- Persists to localStorage

### Order Store (`src/stores/orderStore.ts`)
- Tables and tabs management
- Cart operations
- Order creation and submission
- SignalR connection with JWT token
- Waiter group joining for notifications

## Role-Based Navigation

Navigation tabs adapt based on user role:

| Role | Tabs Visible |
|------|---------------|
| Admin | Mesero, Cocina, Barra, Resumen, Productos, Gerente |
| Waiter | Mesero, Cocina, Barra, Resumen |
| Kitchen | Cocina |
| Bar | Barra |

Products tab and Manager Dashboard (Gerente) are only visible to Admin role.

## Version

Current version: **1.3.0**

See [CHANGELOG.md](CHANGELOG.md) for version history.

## License

Proprietary - BOHUCO Restaurant
