import React, { useState, useEffect } from 'react';
import { productAPI, orderAPI } from '../Service/apiService';
import './POSScreen.css';

function POSScreen() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productAPI.getAll();
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      alert('Không thể tải danh sách sản phẩm');
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ?  { ...item, quantity: item. quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.productId !== productId));
    } else {
      setCart(cart.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Giỏ hàng trống! ');
      return;
    }

    setLoading(true);
    try {
      const orderRequest = {
        items: cart. map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };

      const response = await orderAPI.createOrder(orderRequest);
      
      if (response.success) {
        alert(`Đơn hàng ${response.data.orderCode} đã được tạo thành công!`);
        setCart([]);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Không thể tạo đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pos-screen">
      <div className="pos-header">
        <h1>POS - Màn hình bán hàng</h1>
      </div>

      <div className="pos-content">
        {/* Danh sách sản phẩm */}
        <div className="products-section">
          <h2>Sản phẩm</h2>
          <div className="products-grid">
            {products. map(product => (
              <div key={product.name} className="product-card" onClick={() => addToCart(product)}>
                <h3>{product.name}</h3>
                <p className="price">{product.price. toLocaleString('vi-VN')} ₫</p>
              </div>
            ))}
          </div>
        </div>

        {/* Giỏ hàng */}
        <div className="cart-section">
          <h2>Giỏ hàng</h2>
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.productId} className="cart-item">
                <div className="item-info">
                  <span className="item-name">{item. name}</span>
                  <span className="item-price">{item.price.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="item-controls">
                  <button onClick={() => updateQuantity(item. productId, item.quantity - 1)}>-</button>
                  <span className="quantity">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                </div>
                <div className="item-total">
                  {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="total">
              <span>Tổng cộng:</span>
              <span className="total-amount">{getTotalAmount().toLocaleString('vi-VN')} ₫</span>
            </div>
            <button 
              className="checkout-btn" 
              onClick={handleCheckout}
              disabled={loading || cart.length === 0}
            >
              {loading ? 'Đang xử lý...' : 'Thanh toán'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default POSScreen;