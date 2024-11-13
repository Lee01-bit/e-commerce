// src/Checkout.js
import React, { useState } from 'react';
import axios from 'axios';
import { useCart } from '../CartContext'; 

const Checkout = () => {
  const { cart } = useCart();
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    const order = {
      userId: '9gLsjJQWqAZFIJuErc0EHi6BljO2', 
      items: cart,
      totalAmount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      shippingAddress,
      paymentMethod,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/orders', order);
      alert('Order placed successfully: ' + response.data);
    } catch (err) {
      setError('Error placing order. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <div>
        <label>Shipping Address</label>
        <input
          type="text"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
        />
      </div>
      <div>
        <label>Payment Method</label>
        <input
          type="text"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
      </div>
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Checkout;
