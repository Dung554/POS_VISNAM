import React, { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import axios from 'axios';
import './RealTimeScreen.css';

const RealTimeScreen = () => {
  const [orders, setOrders] = useState([]);
  const [connection, setConnection] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Load đơn hàng ban đầu
    fetchOrders();

    // Thiết lập SignalR connection
    setupSignalRConnection();

    return () => {
      // Cleanup khi component unmount
      if (connection) {
        connection. stop();
      }
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Lỗi khi tải đơn hàng:', error);
    }
  };

  const setupSignalRConnection = async () => {
    try {
      // Tạo connection đến SignalR Hub
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:5000/orderhub') // Thay bằng URL SignalR Hub của bạn
        .withAutomaticReconnect()
        .build();

      // Lắng nghe sự kiện đơn hàng mới
      newConnection.on('NewOrder', (order) => {
        console.log('Đơn hàng mới:', order);
        setOrders(prevOrders => [order, ...prevOrders]);
        
        // Hiển thị thông báo
        showNotification(order);
      });

      // Lắng nghe sự kiện cập nhật đơn hàng
      newConnection.on('OrderUpdated', (order) => {
        console.log('Đơn hàng cập nhật:', order);
        setOrders(prevOrders =>
          prevOrders.map(o => o.orderId === order.orderId ? order : o)
        );
      });

      // Kết nối
      await newConnection.start();
      console.log('SignalR Connected! ');
      setIsConnected(true);
      setConnection(newConnection);

    } catch (error) {
      console.error('Lỗi kết nối SignalR:', error);
      setIsConnected(false);
      
      // Thử kết nối lại sau 5 giây
      setTimeout(setupSignalRConnection, 5000);
    }
  };

  const showNotification = (order) => {
    // Tạo hiệu ứng thông báo
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Đơn hàng mới!', {
        body: `Mã:  ${order.orderId} - ${formatCurrency(order.totalAmount)}`,
        icon: '/notification-icon.png'
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day:  '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const getOrderStatus = (order) => {
    // Logic để xác định trạng thái đơn hàng
    return order.status || 'Hoàn thành';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hoàn thành':  return '#4caf50';
      case 'Đang xử lý': return '#ff9800';
      case 'Đã hủy': return '#f44336';
      default:  return '#2196f3';
    }
  };

  return (
    <div className="realtime-screen">
      <div className="realtime-header">
        <h1>📊 Màn hình Đơn Hàng Realtime</h1>
        <div className="connection-status">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ?  '🟢 Đang kết nối' : '🔴 Mất kết nối'}
          </span>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Tổng đơn hàng</div>
          <div className="stat-value">{orders.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Doanh thu</div>
          <div className="stat-value">
            {formatCurrency(orders.reduce((sum, order) => sum + order.totalAmount, 0))}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Đơn hôm nay</div>
          <div className="stat-value">
            {orders.filter(o => {
              const orderDate = new Date(o.orderDate);
              const today = new Date();
              return orderDate. toDateString() === today.toDateString();
            }).length}
          </div>
        </div>
      </div>

      <div className="orders-container">
        <h2>Danh sách Đơn hàng</h2>
        
        {orders.length === 0 ? (
          <div className="no-orders">Chưa có đơn hàng nào</div>
        ) : (
          <div className="orders-list">
            {orders.map((order, index) => (
              <div key={order.orderId || index} className="order-card">
                <div className="order-header">
                  <span className="order-id">#{order.orderId}</span>
                  <span 
                    className="order-status"
                    style={{ backgroundColor: getStatusColor(getOrderStatus(order)) }}
                  >
                    {getOrderStatus(order)}
                  </span>
                </div>
                
                <div className="order-details">
                  <div className="detail-row">
                    <span className="detail-label">💰 Tổng tiền:</span>
                    <span className="detail-value amount">{formatCurrency(order. totalAmount)}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">🕐 Thời gian:</span>
                    <span className="detail-value">{formatDateTime(order.orderDate)}</span>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="order-items">
                      <div className="detail-label">📦 Sản phẩm:</div>
                      <ul>
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            {item.name} x {item.quantity} = {formatCurrency(item.price * item.quantity)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTimeScreen;