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
- **Close & Charge**: Process payment (Card/Cash)

### Order Management
- Menu display with categories (Platos, Bebidas, Entradas)
- Product cards with emoji, name, and price
- Destination-based routing (Kitchen/Bar)
- Shopping cart with item management
- Real-time status updates via SignalR

### Navigation Flow
1. **Table Selection** → Select table/bar
2. **Account Selection** → Choose existing account or create new
3. **Menu** → Browse and add products
4. **Cart Review** → Review and send order
5. **Account Details** → View all orders and totals

## API Integration

The frontend connects to the BOHUCO POS Backend API at `https://localhost:7089`:

### Endpoints Used
- `GET /api/tabs/active` - Get all active tabs
- `GET /api/tabs/location/{location}` - Get tabs by location
- `GET /api/tabs/{id}` - Get tab details
- `POST /api/tabs` - Open new tab
- `POST /api/tabs/{id}/request-bill` - Request bill
- `POST /api/tabs/{id}/close` - Close tab with payment
- `POST /api/orders` - Create new order
- `POST /api/tabs/orders` - Link order to tab

### Real-time Updates
- SignalR hub at `/hubs/orders` for live order status updates

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

The app uses Zustand for global state management in `src/stores/orderStore.ts`:

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

## Version

Current version: **1.2.1**

See [CHANGELOG.md](CHANGELOG.md) for version history.

## License

Proprietary - BOHUCO Restaurant
