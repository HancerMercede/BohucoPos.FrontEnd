import { useState, useEffect } from 'react';
import { Background } from './components/Background';
import { TopBar } from './components/TopBar';
import { Toast } from './components/Toast/Toast';
import { WaiterView } from './views/WaiterView';
import { DisplayView } from './views/DisplayView';
import { OverviewView } from './views/OverviewView';
import { ProductsView } from './views/ProductsView/ProductsView';
import { ManagerDashboardView } from './views/ManagerDashboardView/ManagerDashboardView';
import { LoginView } from './views/LoginView/LoginView';
import { useAuthStore } from './stores/authStore';
import { useOrderStore } from './stores/orderStore';
import type { ViewId } from './types';
import './styles/variables.css';
import './styles/globals.css';

function App() {
  const [view, setView] = useState<ViewId>('waiter');
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loadSignalR = useOrderStore((state) => state.loadSignalR);
  const fetchProducts = useOrderStore((state) => state.fetchProducts);

  useEffect(() => {
    if (isAuthenticated) {
      loadSignalR();
      fetchProducts();
    }
  }, [isAuthenticated, loadSignalR, fetchProducts]);

  if (!isAuthenticated) {
    return (
      <>
        <Background />
        <LoginView />
      </>
    );
  }

  return (
    <>
      <Background />
      <TopBar view={view} setView={setView} />
      <Toast />
      <div style={{ position: 'relative', zIndex: 1, minHeight: 'calc(100vh - 58px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
          {view === 'waiter' && <WaiterView />}
          {view === 'kitchen' && <DisplayView dest="Kitchen" />}
          {view === 'bar' && <DisplayView dest="Bar" />}
          {view === 'overview' && <OverviewView />}
          {view === 'manager' && <ManagerDashboardView />}
          {view === 'products' && <ProductsView />}
        </div>
      </div>
    </>
  );
}

export default App;
