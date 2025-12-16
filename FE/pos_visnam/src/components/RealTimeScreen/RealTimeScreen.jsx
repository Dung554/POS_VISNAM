import React, { useState, useEffect } from 'react';
import signalRService from '../Service/signalRService';
import { orderAPI } from '../Service/apiService';
import './RealTimeScreen.css';

function RealtimeScreen() {
  const [orders, setOrders] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Đang kết nối.. .');

  useEffect(() => {
    loadOrders();
    initSignalR();

    return () => {
      signalRService.stopConnection();
    };
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderAPI.getRealtimeOrders();
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const initSignalR = async () => {
    const connected = await signalRService.startConnection();
    
    if (connected) {
      setConnectionStatus('Đã kết nối');
      
      // Lắng nghe order mới
      signalRService.onReceiveOrderUpdate((newOrder) => {
        console.log('Received new order:', newOrder);
        setOrders(prevOrders => [newOrder, ...prevOrders]);
        showNotification(newOrder);
      });
    } else {
      setConnectionStatus('Lỗi kết nối');
    }
  };

  const showNotification = (order) => {
    alert(`Đơn hàng mới: ${order.orderCode} - ${order.totalAmount.toLocaleString('vi-VN')} ₫`);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  return (
    <div className="realtime-screen">
      <div className="realtime-header">
        <h1>Màn hình theo dõi đơn hàng Realtime</h1>
        <div className={`connection-status ${connectionStatus === 'Đã kết nối' ? 'connected' : ''}`}>
          <span className="status-dot"></span>
          {connectionStatus}
        </div>
      </div>

      <div className="orders-container">
        <div className="orders-header">
          <div>Mã đơn hàng</div>
          <div>Tổng tiền</div>
          <div>Thời gian tạo</div>
        </div>

        <div className="orders-list">
          {orders.length === 0 ? (
            <div className="no-orders">Chưa có đơn hàng nào</div>
          ) : (
            orders.map((order, index) => (
              <div key={`${order.orderCode}-${index}`} className="order-item">
                <div className="order-code">{order.orderCode}</div>
                <div className="order-amount">{order.totalAmount.toLocaleString('vi-VN')} ₫</div>
                <div className="order-time">{formatDateTime(order.createdAt)}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default RealtimeScreen;