import { create } from "zustand";
import * as signalR from "@microsoft/signalr";
import type {
  TableItem,
  Order,
  MenuItem,
  MenuCategory,
  ItemDestination,
  Tab,
  PaymentMethod,
  OrderStore,
} from "../types";
import { getAuthHeaders } from "../utils/api";
import { useAuthStore } from "./authStore";
import { useNotificationStore } from "./notificationStore";
import { useCartStore } from "./cartStore";
import { useProductStore } from "./productStore";
import { ERROR_MESSAGES } from "../constants/messages";
import { API_URL, SIGNALR_URL } from "../config";

const STATUS_MAP: Record<number, string> = {
  0: "Pending",
  1: "Preparing",
  2: "Ready",
  3: "Delivered",
  4: "Cancelled",
};

const TAB_STATUS_MAP: Record<number, string> = {
  0: "Open",
  1: "Pending",
  2: "Closed",
  3: "Cancelled",
};

const mapStatus = (status: number | string): string => {
  if (typeof status === "number") return STATUS_MAP[status] || "Pending";
  return status;
};

const mapTabStatus = (status: number | string): string => {
  if (typeof status === "number") return TAB_STATUS_MAP[status] || "Open";
  return status;
};

const mapOrderItems = (items: any[]): any[] => {
  return items.map((i: any) => ({
    ...i,
    status: mapStatus(i.status),
    dest:
      i.destination === "Bar" || i.destination === 1
        ? "Bar"
        : i.destination === "Kitchen" || i.destination === 0
          ? "Kitchen"
          : i.dest || "Kitchen",
  }));
};

const getTableDisplayName = (tableId: string | null): string => {
  if (!tableId) return "Sin mesa";
  const table = defaultTables.find((t) => t.id === tableId);
  return table?.name || tableId;
};

const defaultTables: TableItem[] = [
  { id: "t1", name: "Mesa 1", status: "free" },
  { id: "t2", name: "Mesa 2", status: "free" },
  { id: "t3", name: "Mesa 3", status: "free" },
  { id: "t4", name: "Mesa 4", status: "free" },
  { id: "t5", name: "Mesa 5", status: "free" },
  { id: "t6", name: "Mesa 6", status: "free" },
  { id: "t7", name: "Mesa 7", status: "free" },
  { id: "t8", name: "Mesa 8", status: "free" },
  { id: "b1", name: "Barra 1", status: "free", type: "bar" },
  { id: "b2", name: "Barra 2", status: "free", type: "bar" },
];

export const useOrderStore = create<OrderStore>((set, get) => ({
  tables: defaultTables,
  orders: [],
  selectedTable: null,
  waiterStep: "tables",
  category: "Todos",
  sent: false,
  isLoading: false,

  tabs: [],
  selectedTab: null,

  fetchProducts: () => useProductStore.getState().fetchProducts(),

  selectTable: (table) => {
    const { tabs } = get();
    const tableTabs = tabs.filter(
      (t) =>
        t.location === table.name &&
        t.status !== "Closed" &&
        t.status !== "Cancelled",
    );

    if (tableTabs.length > 0) {
      set({ selectedTable: table, tabs: tableTabs });
    } else {
      useCartStore.getState().clearCart();
      set({ selectedTable: table });
    }
  },

  goToTabs: (table) => {
    set({ selectedTable: table, waiterStep: "tabs" });
  },

  goToMenu: (table) => {
    useCartStore.getState().clearCart();
    set({ selectedTable: table, waiterStep: "menu" });
  },

  goBackToTables: () => {
    useCartStore.getState().clearCart();
    set({ selectedTable: null, waiterStep: "tables", selectedTab: null });
  },

  setSelectedTab: (tab) => set({ selectedTab: tab }),

  addToCart: (item) => useCartStore.getState().addToCart(item),
  updateCartQty: (id, delta) =>
    useCartStore.getState().updateCartQty(id, delta),
  updateCartNote: (id, notes) =>
    useCartStore.getState().updateCartNote(id, notes),
  removeFromCart: (id) => useCartStore.getState().removeFromCart(id),
  clearCart: () => {
    useCartStore.getState().clearCart();
    set({ sent: false, selectedTable: null, waiterStep: "tables" });
  },

  setCategory: (cat) => set({ category: cat }),

  submitOrder: async (waiterName) => {
    const cart = useCartStore.getState().cart;
    const { selectedTable, selectedTab } = get();
    if (cart.length === 0) return;

    const orderType = selectedTable?.type === "bar" ? 1 : 0;

    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          orderType,
          tableId: selectedTable?.id || null,
          waiterName,
          items: cart.map((item) => ({
            productId: item.id,
            productName: item.name,
            unitPrice: item.price,
            quantity: item.qty,
            notes: item.notes || null,
            destination: item.dest === "Bar" ? 1 : 0,
          })),
        }),
      });

      if (response.ok) {
        const orderId = await response.json();

        if (selectedTab && selectedTable) {
          await fetch(`${API_URL}/api/tabs/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeaders(),
            },
            body: JSON.stringify({ TabId: selectedTab.id, OrderId: orderId }),
          });

          get().fetchTabsByLocation(selectedTable.name);
        }

        set({ sent: true });
        setTimeout(() => {
          useCartStore.getState().clearCart();
          set({
            sent: false,
            selectedTable: null,
            waiterStep: "tables",
            selectedTab: null,
          });
        }, 2300);
      } else {
        const errorText = await response.text();
        console.error("Order error:", errorText);
      }
    } catch (error) {
      console.error("Failed to submit order:", error);
      useNotificationStore
        .getState()
        .showNotification(ERROR_MESSAGES.submitOrder, "error");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPendingOrders: async (dest, clearFirst = false) => {
    set({ isLoading: true });
    try {
      const destination = dest === "Kitchen" ? 0 : 1;
      const response = await fetch(
        `${API_URL}/api/orders/pending/${destination}`,
        { headers: getAuthHeaders() },
      );
      if (response.ok) {
        const orders = await response.json();
        const mappedOrders = orders.map((o: any) => ({
          ...o,
          idDisplay: o.idDisplay || `ORD-${String(o.id).padStart(3, "0")}`,
          table: getTableDisplayName(o.tableId),
          waiter: o.waiterName,
          status: mapStatus(o.status),
          items: (o.items || []).map((item: any) => ({
            ...item,
            dest: item.destination === 0 ? "Kitchen" : "Bar",
            name: item.productName,
            qty: item.quantity,
            status: mapStatus(item.status),
          })),
        }));

        set((state) => {
          if (clearFirst) {
            return { orders: mappedOrders };
          }
          const existingIds = new Set(state.orders.map((o) => o.id));
          const newOrders = mappedOrders.filter(
            (o: any) => !existingIds.has(o.id),
          );
          return { orders: [...state.orders, ...newOrders] };
        });
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      useNotificationStore
        .getState()
        .showNotification(ERROR_MESSAGES.fetchOrders, "error");
    } finally {
      set({ isLoading: false });
    }
  },

  clearOrders: () => set({ orders: [] }),

  updateOrderItemStatus: async (orderId, itemId, status) => {
    const statusMap: Record<string, number> = {
      Pending: 0,
      Preparing: 1,
      Ready: 2,
      Delivered: 3,
    };
    const statusNumber =
      typeof status === "number" ? status : (statusMap[status] ?? 0);

    try {
      const response = await fetch(
        `${API_URL}/api/orders/items/${itemId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify({ Status: statusNumber }),
        },
      );

      if (response.ok) {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === Number(orderId)
              ? {
                  ...order,
                  items: order.items.map((item) =>
                    item.id === itemId
                      ? { ...item, status: status as any }
                      : item,
                  ),
                }
              : order,
          ),
        }));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  },

  loadSignalR: () => {
    const token = useAuthStore.getState().token;
    const user = useAuthStore.getState().user;
    const waiterName = user?.fullName?.split(" ")[0] || user?.username || "";

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(SIGNALR_URL, {
        accessTokenFactory: () => token || "",
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connection.on("OrderCreated", (order: Order) => {
      set((state) => {
        const existing = state.orders.find((o) => o.id === order.id);
        if (existing) {
          return {
            orders: state.orders.map((o) => (o.id === order.id ? order : o)),
          };
        }
        return { orders: [...state.orders, order] };
      });
    });

    connection.on("OrderUpdated", (order: Order) => {
      set((state) => ({
        orders: state.orders.map((o) => (o.id === order.id ? order : o)),
      }));
    });

    connection.on(
      "OrderItemStatusChanged",
      (data: {
        ItemId: number;
        Status: string;
        ItemName: string;
        OrderId: number;
      }) => {
        useNotificationStore
          .getState()
          .showNotification(`${data.ItemName}: ${data.Status}`, "info");
      },
    );

    connection
      .start()
      .then(async () => {
        if (waiterName) {
          await connection.invoke("JoinWaiterGroup", waiterName);
        }
      })
      .catch(console.error);
  },

  fetchTabsByLocation: async (location) => {
    set({ isLoading: true });
    try {
      const endpoint = location
        ? `/api/tabs/location/${encodeURIComponent(location)}`
        : "/api/tabs/active";
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const tabs = await response.json();
        const mappedTabs = tabs.map((t: any) => ({
          ...t,
          status: mapTabStatus(t.status),
          orders: (t.orders || []).map((o: any) => ({
            ...o,
            status: mapStatus(o.status),
            items: mapOrderItems(o.items || []),
          })),
        }));
        set({ tabs: mappedTabs });

        const tablesWithTabs = new Set(mappedTabs.map((t: Tab) => t.location));
        set((state) => ({
          tables: state.tables.map((t) =>
            tablesWithTabs.has(t.name)
              ? { ...t, status: "occupied" as const }
              : t,
          ),
        }));
      }
    } catch (error) {
      console.error("Failed to fetch tabs:", error);
      useNotificationStore
        .getState()
        .showNotification(ERROR_MESSAGES.fetchTabs, "error");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTabDetails: async (tabId) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/api/tabs/${tabId}`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const tab = await response.json();
        const mappedTab = {
          ...tab,
          status: mapTabStatus(tab.status),
          orders: (tab.orders || []).map((o: any) => ({
            ...o,
            status: mapStatus(o.status),
            items: mapOrderItems(o.items || []),
          })),
        };
        set({ selectedTab: mappedTab });
      }
    } catch (error) {
      console.error("Failed to fetch tab details:", error);
      useNotificationStore
        .getState()
        .showNotification(ERROR_MESSAGES.fetchTabDetails, "error");
    } finally {
      set({ isLoading: false });
    }
  },

  openTab: async (location, customerName, waiterId, waiterName) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/api/tabs`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          location,
          customerName,
          waiterId,
          waiterName,
          taxRate: 0.18,
        }),
      });

      if (response.ok) {
        const tabId = await response.json();
        await get().fetchTabsByLocation("");

        const newTab = get().tabs.find((t) => t.id === tabId);
        if (newTab) {
          set({ selectedTab: newTab });
        }

        return tabId;
      }
      throw new Error("Failed to open tab");
    } finally {
      set({ isLoading: false });
    }
  },

  requestBill: async (tabId) => {
    set({ isLoading: true });
    try {
      const response = await fetch(
        `${API_URL}/api/tabs/${tabId}/request-bill`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        },
      );

      if (response.ok) {
        const { selectedTable } = get();
        if (selectedTable) {
          await get().fetchTabsByLocation(selectedTable.name);
          await get().fetchTabDetails(tabId);
        }
      }
    } catch (error) {
      console.error("Failed to request bill:", error);
      useNotificationStore
        .getState()
        .showNotification(ERROR_MESSAGES.requestBill, "error");
    } finally {
      set({ isLoading: false });
    }
  },

  closeTab: async (tabId, paymentMethod, directClose = false) => {
    set({ isLoading: true });

    const paymentMap: Record<string, number> = {
      Cash: 0,
      Card: 1,
      Transfer: 2,
    };
    const paymentValue = paymentMap[paymentMethod] ?? 1;

    try {
      const response = await fetch(`${API_URL}/api/tabs/${tabId}/close`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          paymentMethod: paymentValue,
          directClose,
        }),
      });

      if (response.ok) {
        const { selectedTable } = get();
        const tableName = selectedTable?.name;

        await get().fetchTabsByLocation("");

        if (tableName) {
          const currentTabs = get().tabs.filter(
            (t) =>
              t.location === tableName &&
              t.status !== "Closed" &&
              t.status !== "Cancelled",
          );
          if (currentTabs.length === 0) {
            set((state) => ({
              tables: state.tables.map((t) =>
                t.name === tableName ? { ...t, status: "free" as const } : t,
              ),
            }));
          }
        }

        useCartStore.getState().clearCart();
        set({ selectedTab: null, waiterStep: "tables", selectedTable: null });
      }
    } catch (error) {
      console.error("Failed to close tab:", error);
      useNotificationStore
        .getState()
        .showNotification(ERROR_MESSAGES.closeTab, "error");
    } finally {
      set({ isLoading: false });
    }
  },

  cancelTab: async (tabId, reason) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/api/tabs/${tabId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        const { selectedTable } = get();
        if (selectedTable) {
          await get().fetchTabsByLocation(selectedTable.name);
        }
        set({ selectedTab: null });
      }
    } catch (error) {
      console.error("Failed to cancel tab:", error);
      useNotificationStore
        .getState()
        .showNotification(ERROR_MESSAGES.cancelTab, "error");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchBillPdf: async (tabId) => {
    const response = await fetch(`${API_URL}/api/tabs/${tabId}/pdf`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch PDF");
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  },

  cancelItem: async (itemId: number, reason?: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/api/orders/items/${itemId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        const { selectedTab, selectedTable } = get();
        if (selectedTab) {
          await get().fetchTabDetails(selectedTab.id);
        } else if (selectedTable) {
          await get().fetchTabsByLocation(selectedTable.name);
        }
      }
    } catch (error) {
      console.error("Failed to cancel item:", error);
      useNotificationStore
        .getState()
        .showNotification(ERROR_MESSAGES.cancelItem, "error");
    } finally {
      set({ isLoading: false });
    }
  },
}));

export { defaultTables };
