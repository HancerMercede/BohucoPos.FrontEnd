import { useState } from 'react';
import { Background } from './components/Background';
import { TopBar } from './components/TopBar';
import { WaiterView } from './views/WaiterView';
import { DisplayView } from './views/DisplayView';
import { OverviewView } from './views/OverviewView';
import type { ViewId } from './types';
import './styles/variables.css';
import './styles/globals.css';

function App() {
  const [view, setView] = useState<ViewId>('waiter');

  return (
    <>
      <Background />
      <TopBar view={view} setView={setView} />
      <div style={{ position: 'relative', zIndex: 1, minHeight: 'calc(100vh - 58px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
          {view === 'waiter' && <WaiterView />}
          {view === 'kitchen' && <DisplayView dest="Kitchen" />}
          {view === 'bar' && <DisplayView dest="Bar" />}
          {view === 'overview' && <OverviewView />}
        </div>
      </div>
    </>
  );
}

export default App;
