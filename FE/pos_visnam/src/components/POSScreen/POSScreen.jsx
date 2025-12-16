import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './POSScreen.css';

const POSScreen = ({ onOrderComplete }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  // Load danh sách sản phẩm từ API
  useEffect(() => {
    fetchProducts();
  }, []);

  // Tính tổng tiền khi giỏ hàng thay đổi
  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, [cart]);

  const fetchProducts = async () => {
    try {
      // Thay YOUR_API_URL bằng URL API backend của bạn
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response. data);
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
      // Mock data cho demo
      setProducts([
        { id: 1, name:  'Cà phê đen', price: 25000 },
        { id: 2, name: 'Cà phê sữa', price: 30000 },
        { id:  3, name: 'Trà sữa', price: 35000 },
        { id:  4, name: 'Sinh tố bơ', price: 40000 },
        { id: 5, name: 'Nước ép cam', price: 35000 },
      ]);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          :  item
      ));
    } else {
      setCart([... cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Giỏ hàng trống! ');
      return;
    }

    const order = {
      items: cart,
      totalAmount: total,
      orderDate: new Date().toISOString()
    };

    try {
      // Gửi đơn hàng đến API
      const response = await axios.post('http://localhost:5000/api/orders', order);
      
      alert(`Thanh toán thành công!\nMã đơn:  ${response.data.orderId}\nTổng tiền: ${formatCurrency(total)}`);
      
      // Reset giỏ hàng
      setCart([]);
      
      // Callback để cập nhật màn hình realtime
      if (onOrderComplete) {
        onOrderComplete(response.data);
      }
    } catch (error) {
      console.error('Lỗi thanh toán:', error);
      alert('Có lỗi xảy ra khi thanh toán! ');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style:  'currency',
      currency:  'VND'
    }).format(amount);
  };

  return (
    <div className="pos-screen">
      <div className="pos-header">
        <h1>🛒 Màn hình Bán Hàng - POS</h1>
      </div>

      <div className="pos-content">
        {/* Danh sách sản phẩm */}
        <div className="products-section">
          <h2>Danh sách Sản phẩm</h2>
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card" onClick={() => addToCart(product)}>
                <div className="product-name">{product.name}</div>
                <div className="product-price">{formatCurrency(product.price)}</div>
                <button className="add-btn">+ Thêm</button>
              </div>
            ))}
          </div>
        </div>

        {/* Giỏ hàng */}
        <div className="cart-section">
          <h2>Giỏ hàng</h2>
          
          {cart.length === 0 ? (
            <div className="empty-cart">Chưa có sản phẩm nào</div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-info">
                      <div className="item-name">{item.name}</div>
                      <div className="item-price">{formatCurrency(item.price)}</div>
                    </div>
                    <div className="item-controls">
                      <button onClick={() => updateQuantity(item. id, item.quantity - 1)}>-</button>
                      <span className="quantity">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      <button className="remove-btn" onClick={() => removeFromCart(item.id)}>🗑️</button>
                    </div>
                    <div className="item-total">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="total-row">
                  <span className="total-label">Tổng tiền:</span>
                  <span className="total-amount">{formatCurrency(total)}</span>
                </div>
                <button className="checkout-btn" onClick={handleCheckout}>
                  💳 Thanh toán
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default POSScreen;