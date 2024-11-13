// src/OrderHistory.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OrderStatusTracker from './OrderStatusTracker';

const OrderHistory = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/${userId}`);
        setOrders(response.data);
      } catch (err) {
        setError('Error fetching order history');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Your Order History</h2>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="mb-4">
            <h5>Order ID: {order.id}</h5>
            <p>Total: ${order.totalAmount}</p>
            <p>Placed on: {new Date(order.orderDate.seconds * 1000).toLocaleString()}</p>
            {/* Display the status tracker */}
            <OrderStatusTracker statusHistory={order.statusHistory} />
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
