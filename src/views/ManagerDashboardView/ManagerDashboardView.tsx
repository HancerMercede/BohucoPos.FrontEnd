import { useState, useEffect, useMemo } from 'react';
import { getAuthHeaders } from '../../utils/api';
import { Pagination } from '../../components/Pagination';
import { API_URL } from '../../config';
import styles from './ManagerDashboardView.module.css';

const ITEMS_PER_PAGE = 5;

interface SalesData {
  startDate: string;
  endDate: string;
  totalRevenue: number;
  totalOrders: number;
  averageTicket: number;
  dailySales: Array<{
    date: string;
    totalRevenue: number;
    orderCount: number;
    averageTicket: number;
  }>;
  topProducts: Array<{
    productName: string;
    quantitySold: number;
    revenue: number;
  }>;
  waiterPerformance: Array<{
    waiterName: string;
    orderCount: number;
    totalRevenue: number;
  }>;
  paymentBreakdown: Array<{
    method: string;
    count: number;
    total: number;
  }>;
}

interface LowInventoryItem {
  id: number;
  name: string;
  price: number;
  category: string;
  destination: string;
  productType: string;
  stockQuantity: number | null;
  emoji: string;
  isActive: boolean;
}

type TimeRange = 'today' | 'week' | 'month';

export function ManagerDashboardView() {
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [lowInventory, setLowInventory] = useState<LowInventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [activeSection, setActiveSection] = useState<'sales' | 'inventory'>('sales');
  const [productsPage, setProductsPage] = useState(1);
  const [waitersPage, setWaitersPage] = useState(1);

  const fetchSalesData = async (range: TimeRange) => {
    setIsLoading(true);
    setProductsPage(1);
    setWaitersPage(1);
    try {
      let startDate: string;
      const endDate = new Date().toISOString();
      
      switch (range) {
        case 'today':
          startDate = new Date().toISOString().split('T')[0];
          break;
        case 'week':
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          break;
        case 'month':
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          break;
      }

      const response = await fetch(
        `${API_URL}/api/dashboard/sales?startDate=${startDate}&endDate=${endDate}`,
        { headers: getAuthHeaders() }
      );
      
      if (response.ok) {
        const data = await response.json();
        setSalesData(data);
      }
    } catch (error) {
      console.error('Failed to fetch sales data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLowInventory = async () => {
    try {
      const response = await fetch(`${API_URL}/api/dashboard/low-inventory?threshold=10`, {
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        const data = await response.json();
        setLowInventory(data);
      }
    } catch (error) {
      console.error('Failed to fetch low inventory:', error);
    }
  };

  useEffect(() => {
    fetchSalesData(timeRange);
    fetchLowInventory();
  }, [timeRange]);

  const stats = useMemo(() => {
    if (!salesData) return null;
    return [
      { label: 'Ingresos Totales', value: `$${salesData.totalRevenue.toFixed(2)}`, icon: '💰', gradient: 'linear-gradient(135deg, #10B981, #059669)' },
      { label: 'Órdenes', value: salesData.totalOrders.toString(), icon: '📋', gradient: 'linear-gradient(135deg, #3B82F6, #6366F1)' },
      { label: 'Ticket Promedio', value: `$${salesData.averageTicket.toFixed(2)}`, icon: '📊', gradient: 'linear-gradient(135deg, #8B5CF6, #6366F1)' },
      { label: 'Productos Bajo Stock', value: lowInventory.length.toString(), icon: '⚠️', gradient: 'linear-gradient(135deg, #F97316, #EF4444)' },
    ];
  }, [salesData, lowInventory]);

  const paginatedProducts = useMemo(() => {
    if (!salesData?.topProducts) return [];
    const start = (productsPage - 1) * ITEMS_PER_PAGE;
    return salesData.topProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [salesData?.topProducts, productsPage]);

  const paginatedWaiters = useMemo(() => {
    if (!salesData?.waiterPerformance) return [];
    const start = (waitersPage - 1) * ITEMS_PER_PAGE;
    return salesData.waiterPerformance.slice(start, start + ITEMS_PER_PAGE);
  }, [salesData?.waiterPerformance, waitersPage]);

  const productsTotalPages = Math.ceil((salesData?.topProducts?.length || 0) / ITEMS_PER_PAGE);
  const waitersTotalPages = Math.ceil((salesData?.waiterPerformance?.length || 0) / ITEMS_PER_PAGE);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Panel de Gerente</h2>
        <div className={styles.timeSelector}>
          <button
            className={`${styles.timeButton} ${timeRange === 'today' ? styles.active : ''}`}
            onClick={() => setTimeRange('today')}
          >
            Hoy
          </button>
          <button
            className={`${styles.timeButton} ${timeRange === 'week' ? styles.active : ''}`}
            onClick={() => setTimeRange('week')}
          >
            Semana
          </button>
          <button
            className={`${styles.timeButton} ${timeRange === 'month' ? styles.active : ''}`}
            onClick={() => setTimeRange('month')}
          >
            Mes
          </button>
        </div>
      </div>

      <div className={styles.sectionTabs}>
        <button
          className={`${styles.sectionTab} ${activeSection === 'sales' ? styles.activeTab : ''}`}
          onClick={() => setActiveSection('sales')}
        >
          📊 Análisis de Ventas
        </button>
        <button
          className={`${styles.sectionTab} ${activeSection === 'inventory' ? styles.activeTab : ''}`}
          onClick={() => setActiveSection('inventory')}
        >
          ⚠️ Inventario Bajo
        </button>
      </div>

      {isLoading ? (
        <p className={styles.loading}>Cargando...</p>
      ) : (
        <>
          {stats && (
            <div className={styles.statsGrid}>
              {stats.map((stat, i) => (
                <div key={stat.label} className={styles.statCard} style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className={styles.statIcon} style={{ background: stat.gradient }}>
                    {stat.icon}
                  </div>
                  <div className={styles.statValue}>{stat.value}</div>
                  <div className={styles.statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'sales' && salesData && (
            <div className={styles.salesSection}>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Productos Más Vendidos</h3>
                <div className={styles.productList}>
                  {paginatedProducts.length === 0 ? (
                    <p className={styles.empty}>No hay datos</p>
                  ) : (
                    paginatedProducts.map((product, i) => (
                      <div key={product.productName} className={styles.productItem}>
                        <span className={styles.rank}>#{((productsPage - 1) * ITEMS_PER_PAGE) + i + 1}</span>
                        <span className={styles.productName}>{product.productName}</span>
                        <span className={styles.productQty}>{product.quantitySold} uds</span>
                        <span className={styles.productRevenue}>${product.revenue.toFixed(2)}</span>
                      </div>
                    ))
                  )}
                </div>
                <Pagination
                  currentPage={productsPage}
                  totalPages={productsTotalPages}
                  onPageChange={setProductsPage}
                />
              </div>

              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Rendimiento de Meseros</h3>
                <div className={styles.waiterList}>
                  {paginatedWaiters.length === 0 ? (
                    <p className={styles.empty}>No hay datos</p>
                  ) : (
                    paginatedWaiters.map((waiter) => (
                      <div key={waiter.waiterName} className={styles.waiterItem}>
                        <span className={styles.waiterName}>
                          {waiter.waiterName.includes('@') 
                            ? waiter.waiterName.split('@')[0] 
                            : waiter.waiterName.split(' ')[0]}
                        </span>
                        <span className={styles.waiterOrders}>{waiter.orderCount} órdenes</span>
                        <span className={styles.waiterRevenue}>${waiter.totalRevenue.toFixed(2)}</span>
                      </div>
                    ))
                  )}
                </div>
                <Pagination
                  currentPage={waitersPage}
                  totalPages={waitersTotalPages}
                  onPageChange={setWaitersPage}
                />
              </div>

              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Métodos de Pago</h3>
                <div className={styles.paymentList}>
                  {salesData.paymentBreakdown.length === 0 ? (
                    <p className={styles.empty}>No hay datos</p>
                  ) : (
                    salesData.paymentBreakdown.map((payment) => (
                      <div key={payment.method} className={styles.paymentItem}>
                        <span className={styles.paymentMethod}>
                          {payment.method === 'CASH' && '💵'}
                          {payment.method === 'CARD' && '💳'}
                          {payment.method === 'TRANSFER' && '📲'}
                          {' '}{payment.method}
                        </span>
                        <span className={styles.paymentCount}>{payment.count} transacciones</span>
                        <span className={styles.paymentTotal}>${payment.total.toFixed(2)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'inventory' && (
            <div className={styles.inventorySection}>
              {lowInventory.length === 0 ? (
                <div className={styles.emptyInventory}>
                  <span className={styles.emptyIcon}>✅</span>
                  <p>Todos los productos tienen stock suficiente</p>
                </div>
              ) : (
                <div className={styles.inventoryList}>
                  {lowInventory.map((item) => (
                    <div key={item.id} className={styles.inventoryItem}>
                      <span className={styles.itemEmoji}>{item.emoji || '📦'}</span>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemCategory}>{item.category}</span>
                      <span className={`${styles.itemStock} ${item.stockQuantity === 0 ? styles.outOfStock : ''}`}>
                        {item.stockQuantity === 0 ? 'Sin Stock' : `${item.stockQuantity} unidades`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
