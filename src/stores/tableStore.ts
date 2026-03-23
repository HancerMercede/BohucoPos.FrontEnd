import { create } from 'zustand';
import type { TableItem, Tab, MenuCategory } from '../types';
import { useCartStore } from './cartStore';

const defaultTables: TableItem[] = [
  { id: 't1', name: 'Mesa 1', status: 'free' },
  { id: 't2', name: 'Mesa 2', status: 'free' },
  { id: 't3', name: 'Mesa 3', status: 'free' },
  { id: 't4', name: 'Mesa 4', status: 'free' },
  { id: 't5', name: 'Mesa 5', status: 'free' },
  { id: 't6', name: 'Mesa 6', status: 'free' },
  { id: 't7', name: 'Mesa 7', status: 'free' },
  { id: 't8', name: 'Mesa 8', status: 'free' },
  { id: 'b1', name: 'Barra 1', status: 'free', type: 'bar' },
  { id: 'b2', name: 'Barra 2', status: 'free', type: 'bar' },
];

interface TableStore {
  tables: TableItem[];
  selectedTable: TableItem | null;
  waiterStep: 'tables' | 'menu' | 'tabs';
  category: MenuCategory;
  tabs: Tab[];
  selectedTab: Tab | null;
  
  selectTable: (table: TableItem, tabs?: Tab[]) => void;
  goToTabs: (table: TableItem) => void;
  goToMenu: (table: TableItem) => void;
  goBackToTables: () => void;
  setCategory: (cat: MenuCategory) => void;
  setSelectedTab: (tab: Tab | null) => void;
  setTabs: (tabs: Tab[]) => void;
  updateTableStatus: (tableName: string, status: 'free' | 'occupied') => void;
}

export const useTableStore = create<TableStore>((set) => ({
  tables: defaultTables,
  selectedTable: null,
  waiterStep: 'tables',
  category: 'Todos',
  tabs: [],
  selectedTab: null,

  selectTable: (table, tabs) => {
    if (tabs && tabs.length > 0) {
      set({ selectedTable: table, tabs });
    } else {
      useCartStore.getState().clearCart();
      set({ selectedTable: table });
    }
  },

  goToTabs: (table) => {
    set({ selectedTable: table, waiterStep: 'tabs' });
  },

  goToMenu: (table) => {
    useCartStore.getState().clearCart();
    set({ selectedTable: table, waiterStep: 'menu' });
  },

  goBackToTables: () => {
    useCartStore.getState().clearCart();
    set({ selectedTable: null, waiterStep: 'tables', selectedTab: null });
  },

  setCategory: (cat) => set({ category: cat }),

  setSelectedTab: (tab) => set({ selectedTab: tab }),

  setTabs: (tabs) => set({ tabs }),

  updateTableStatus: (tableName, status) => {
    set((state) => ({
      tables: state.tables.map((t) =>
        t.name === tableName ? { ...t, status } : t
      ),
    }));
  },
}));

export { defaultTables };
