import React, { useState } from 'react';
import POSScreen from './components/POSScreen/POSScreen';
import RealTimeScreen from './components/RealTimeScreen/RealTimeScreen';
import './App.css';

function App() {
  const [activeScreen, setActiveScreen] = useState('pos');

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">POS VISNAM</div>
        <div className="nav-buttons">
          <button 
            className={activeScreen === 'pos' ? 'active' : ''}
            onClick={() => setActiveScreen('pos')}
          >
            🛒 Bán hàng
          </button>
          <button 
            className={activeScreen === 'realtime' ?  'active' : ''}
            onClick={() => setActiveScreen('realtime')}
          >
            📊 Đơn hàng Realtime
          </button>
        </div>
      </nav>

      <div className="main-content">
        {activeScreen === 'pos' ? <POSScreen /> : <RealTimeScreen />}
      </div>
    </div>
  );
}

export default App;