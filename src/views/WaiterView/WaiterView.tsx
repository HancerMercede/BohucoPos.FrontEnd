import { useState, useMemo, useEffect } from 'react';
import { useOrderStore } from '../../stores/orderStore';
import { DestTag } from '../../components/DestTag';
import { OpenTabModal } from '../../components/OpenTabModal';
import { TabList } from '../../components/TabList';
import { TabDetail } from '../../components/TabDetail';
import styles from './WaiterView.module.css';
import type { MenuCategory, TableItem, PaymentMethod } from '../../types';

const categories: MenuCategory[] = ['Todos', 'Platos', 'Entradas', 'Bebidas'];

interface MenuItem {
  id: string;
  name: string;
  price: number;
  dest: 'Kitchen' | 'Bar';
  category: 'Platos' | 'Entradas' | 'Bebidas';
  emoji: string;
}

const menuItemsData: MenuItem[] = [
  { id: 'p1', name: 'Pollo a la Brasa', price: 12.5, dest: 'Kitchen', category: 'Platos', emoji: '🍗' },
  { id: 'p2', name: 'Pasta Carbonara', price: 11.0, dest: 'Kitchen', category: 'Platos', emoji: '🍝' },
  { id: 'p3', name: 'Pizza Margarita', price: 10.5, dest: 'Kitchen', category: 'Platos', emoji: '🍕' },
  { id: 'p4', name: 'Ensalada César', price: 8.0, dest: 'Kitchen', category: 'Entradas', emoji: '🥗' },
  { id: 'p5', name: 'Nachos', price: 7.5, dest: 'Kitchen', category: 'Entradas', emoji: '🧀' },
  { id: 'p6', name: 'Burger Clásica', price: 13.0, dest: 'Kitchen', category: 'Platos', emoji: '🍔' },
  { id: 'p7', name: 'Mojito', price: 9.0, dest: 'Bar', category: 'Bebidas', emoji: '🍹' },
  { id: 'p8', name: 'Negroni', price: 11.0, dest: 'Bar', category: 'Bebidas', emoji: '🍸' },
  { id: 'p9', name: 'Vino Tinto', price: 8.5, dest: 'Bar', category: 'Bebidas', emoji: '🍷' },
  { id: 'p10', name: 'Cerveza Artesanal', price: 6.5, dest: 'Bar', category: 'Bebidas', emoji: '🍺' },
  { id: 'p11', name: 'Coca-Cola', price: 3.0, dest: 'Bar', category: 'Bebidas', emoji: '🥤' },
  { id: 'p12', name: 'Papas Fritas', price: 5.0, dest: 'Kitchen', category: 'Entradas', emoji: '🍟' },
];

export function WaiterView() {
  const {
    tables,
    cart,
    selectedTable,
    waiterStep,
    category,
    sent,
    isLoading,
    tabs,
    selectedTab,
    selectTable,
    addToCart,
    updateCartQty,
    updateCartNote,
    setCategory,
    submitOrder,
    fetchTabsByLocation,
    fetchTabDetails,
    openTab,
    requestBill,
    closeTab,
    cancelTab,
    setSelectedTab,
    goToTabs,
    goBackToTables,
  } = useOrderStore();

  const [noteModal, setNoteModal] = useState<{ id: string; note: string } | null>(null);
  const [openTabModal, setOpenTabModal] = useState(false);

  const filteredItems = useMemo(() => {
    return category === 'Todos' ? menuItemsData : menuItemsData.filter(m => m.category === category);
  }, [category]);

  const total = useMemo(() => cart.reduce((s, c) => s + c.price * c.qty, 0), [cart]);

  const handleSend = () => {
    submitOrder('Mesero');
  };

  const handleOpenTab = async (customerName: string) => {
    if (selectedTable) {
      await openTab(selectedTable.name, customerName, 'waiter-1', 'Mesero');
      setOpenTabModal(false);
    }
  };

  const handleSelectTab = async (tab: typeof tabs[0]) => {
    setSelectedTab(tab);
    await fetchTabDetails(tab.id);
  };

  const handleAddOrderToTab = () => {
    // This goes to the menu view with the selected tab
    setSelectedTab(null);
    // Keep selectedTable but go to menu
  };

  useEffect(() => {
    if (selectedTable && waiterStep === 'tabs') {
      fetchTabsByLocation(selectedTable.name);
    }
  }, [selectedTable, waiterStep, fetchTabsByLocation]);

  if (sent) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successIcon}>✓</div>
        <div className={styles.successTitle}>¡Orden Enviada!</div>
        <div className={styles.successSubtitle}>Notificando cocina y barra en tiempo real...</div>
      </div>
    );
  }

  if (waiterStep === 'tabs') {
    const tableTabs = tabs.filter(t => t.location === selectedTable?.name);
    
    if (selectedTab) {
      return (
        <TabDetail
          tab={selectedTab}
          onBack={() => setSelectedTab(null)}
          onAddOrder={handleAddOrderToTab}
          onRequestBill={() => requestBill(selectedTab.id)}
          onClose={(paymentMethod: PaymentMethod, direct: boolean) => closeTab(selectedTab.id, paymentMethod, direct)}
          onCancel={(reason?: string) => cancelTab(selectedTab.id, reason)}
        />
      );
    }

    return (
      <TabList
        tabs={tableTabs}
        location={selectedTable?.name || ''}
        onSelectTab={handleSelectTab}
        onNewTab={() => setOpenTabModal(true)}
      />
    );
  }

  if (waiterStep === 'tables') {
    const handleTableClick = (t: TableItem) => {
      if (t.status === 'free') {
        selectTable(t);
      } else if (t.status === 'has-tabs') {
        goToTabs(t);
      } else {
        // For occupied tables, go to tabs view to see if there are any open
        goToTabs(t);
      }
    };

    return (
      <div className={styles.tablesContainer}>
        <div className={styles.headerWrapper}>
          <h2 className={styles.pageTitle}>Seleccionar Mesa</h2>
          <p className={styles.pageSubtitle}>Toca una mesa disponible para iniciar una orden</p>
        </div>
        <div className={styles.tablesGrid}>
          {tables.map((t: TableItem, i: number) => (
            <button
              key={t.id}
              className={`tb ${t.status === 'free' ? 'free' : 'occ'}`}
              style={{ animationDelay: `${i * 0.05}s` } as React.CSSProperties}
              onClick={() => handleTableClick(t)}
            >
              <div className={styles.tableIcon}>{t.type === 'bar' ? '🪑' : '🍽️'}</div>
              <div className={styles.tableName}>{t.name}</div>
              <div className={t.status === 'free' ? styles.tableStatusFree : t.status === 'has-tabs' ? styles.tableStatusTabs : styles.tableStatusOcc}>
                {t.status === 'free' ? '● Libre' : t.status === 'has-tabs' ? '● Cuentas' : '● Ocupada'}
              </div>
            </button>
          ))}
        </div>

        {openTabModal && selectedTable && (
          <OpenTabModal
            location={selectedTable.name}
            isBar={selectedTable.type === 'bar'}
            onOpen={handleOpenTab}
            onClose={() => setOpenTabModal(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className={styles.menuContainer}>
      <div className={styles.menuPanel}>
        <div className={styles.menuHeader}>
          <button className={styles.backBtn} onClick={() => goBackToTables()}>
            ← Volver
          </button>
          <h2 className={styles.menuTitle}>
            {selectedTable?.name}
            {selectedTab ? ` — ${selectedTab.customerName}` : ' — Nueva Orden'}
          </h2>
        </div>
        
        <div className={styles.categories}>
          {categories.map(c => (
            <button
              key={c}
              className={`pill ${category === c ? 'on' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className={styles.productsGrid}>
          {filteredItems.map((item, i) => {
            const inCart = cart.find(c => c.id === item.id);
            return (
              <div
                key={item.id}
                className={`mi ${inCart ? 'sel' : ''}`}
                style={{ animationDelay: `${i * 0.04}s` } as React.CSSProperties}
                onClick={() => addToCart(item)}
              >
                <div className={styles.productEmoji}>{item.emoji}</div>
                <div className={styles.productName}>{item.name}</div>
                <div className={styles.productRow} style={{ marginBottom: inCart ? 8 : 0 }}>
                  <span className={styles.productPrice}>${item.price.toFixed(2)}</span>
                  <DestTag dest={item.dest} />
                </div>
                {inCart && (
                  <div className={styles.inCartBadge}>
                    <span className={styles.inCartLabel}>En orden</span>
                    <span className={styles.inCartQty}>×{inCart.qty}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.cartPanel}>
        <div className={styles.cartHeader}>
          <div className={styles.cartTitle}>Orden</div>
          <div className={styles.cartSubtitle}>{selectedTable?.name}</div>
        </div>
        
        <div className={styles.cartBody}>
          {cart.length === 0 ? (
            <div className={styles.cartEmpty}>
              <div className={styles.cartEmptyIcon}>🛒</div>
              Agrega productos al menú
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.cartItemRow}>
                  <div className={styles.cartItemInfo}>
                    <div className={styles.cartItemName}>{item.name}</div>
                    <DestTag dest={item.dest} />
                    {item.notes && <div className={styles.cartItemNotes}>📝 {item.notes}</div>}
                  </div>
                  <span className={styles.cartItemTotal}>${(item.price * item.qty).toFixed(2)}</span>
                </div>
                <div className={styles.cartItemActions}>
                  <div className={styles.qtyControls}>
                    <button className={styles.qtyBtn} onClick={() => updateCartQty(item.id, -1)}>−</button>
                    <span className={styles.qtyValue}>{item.qty}</span>
                    <button className={styles.qtyBtn} onClick={() => updateCartQty(item.id, 1)}>+</button>
                  </div>
                  <button className={styles.noteBtn} onClick={() => setNoteModal({ id: item.id, note: item.notes })}>
                    + nota
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.cartFooter}>
          <div className={styles.cartTotalRow}>
            <span className={styles.cartTotalLabel}>Total</span>
            <span className={styles.cartTotalAmount}>${total.toFixed(2)}</span>
          </div>
          <button 
            className={styles.sendBtn}
            onClick={handleSend}
            disabled={cart.length === 0 || isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar Orden →'}
          </button>
        </div>
      </div>

      {noteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalTitle}>Agregar nota</div>
            <textarea
              className={styles.modalInput}
              value={noteModal.note}
              onChange={(e) => setNoteModal({ ...noteModal, note: e.target.value })}
              placeholder="ej: sin cebolla, extra picante..."
              autoFocus
            />
            <div className={styles.modalButtons}>
              <button className={styles.modalCancel} onClick={() => setNoteModal(null)}>Cancelar</button>
              <button 
                className={styles.modalSave} 
                onClick={() => { updateCartNote(noteModal.id, noteModal.note); setNoteModal(null); }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
