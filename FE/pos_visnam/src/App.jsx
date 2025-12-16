import React, { useState } from 'react';
import POSScreen from './components/POSScreen/POSScreen';
import RealtimeScreen from './components/RealTimeScreen/RealTimeScreen';
import './App.css';

function App() {
  const [activeScreen, setActiveScreen] = useState('pos');

  return (
    <div className="App">
      <nav className="app-nav">
        <button 
          className={activeScreen === 'pos' ? 'active' : ''}
          onClick={() => setActiveScreen('pos')}
        >
          Màn hình POS
        </button>
        <button 
          className={activeScreen === 'realtime' ?  'active' : ''}
          onClick={() => setActiveScreen('realtime')}
        >
          Màn hình Realtime
        </button>
      </nav>

      {activeScreen === 'pos' && <POSScreen />}
      {activeScreen === 'realtime' && <RealtimeScreen />}
    </div>
  );
}

export default App;