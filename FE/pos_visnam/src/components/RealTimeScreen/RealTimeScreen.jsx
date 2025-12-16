import React, { useState, useEffect } from 'react';
import signalRService from '../Service/signalRService';
import { orderAPI } from '../Service/apiService';
import './RealTimeScreen.css';

function RealtimeScreen() {
  const [orders, setOrders] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Đang kết nối...');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadOrders(true);
    initSignalR();

    return () => {
      signalRService.stopConnection();
    };
  }, []);

  const loadOrders = async (showMainLoading = false) => {
    if (showMainLoading) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const response = await orderAPI.getRealtimeOrders();
      if (response.success) {
        setOrders(response.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      if (showMainLoading) setIsLoading(false);
      else setIsRefreshing(false);
    }
  };

  const initSignalR = async () => {
    const connected = await signalRService.startConnection();

    if (connected) {
      setConnectionStatus('Đã kết nối');

      // Lắng nghe order mới và tự động reload
      signalRService.onReceiveOrderUpdate(() => {
        loadOrders(false);
      });
    } else {
      setConnectionStatus('Lỗi kết nối');
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  const handleManualRefresh = () => loadOrders(false);

  return (
    <div className="realtime-screen">
      <div className="realtime-header">
        <div>
          <p className="eyebrow">Realtime Orders</p>
          <h1>Màn hình theo dõi đơn hàng</h1>
          <p className="subtext">Tự động cập nhật khi có đơn hàng mới</p>
        </div>
        <div className="header-actions">
          <div className={`connection-pill ${connectionStatus === 'Đã kết nối' ? 'ok' : 'err'}`}>
            <span className="dot" />
            {connectionStatus}
          </div>
          <button
            className="refresh-btn"
            onClick={handleManualRefresh}
            disabled={isRefreshing || isLoading}
          >
            {isRefreshing ? 'Đang tải...' : 'Tải lại'}
          </button>
        </div>
      </div>

      <div className="meta">
        <span>Đơn hàng: {orders.length}</span>
        <span> | </span>
        <span>Cập nhật: {lastUpdated ? lastUpdated.toLocaleString('vi-VN') : '—'}</span>
      </div>

      {isLoading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : (
        <div className="orders-grid">
          {orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🛒</div>
              <p>Chưa có đơn hàng nào</p>
              <small>Tạo đơn ở màn hình POS để xem realtime tại đây</small>
            </div>
          ) : (
            orders.map((order, index) => (
              <div key={`${order.orderCode}-${index}`} className="order-card">
                <div className="order-code">{order.orderCode}</div>
                <div className="order-amount">{formatCurrency(order.totalAmount)}</div>
                <div className="order-time">{formatDateTime(order.createdAt)}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default RealtimeScreen;