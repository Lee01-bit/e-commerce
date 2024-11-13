import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch cart data from the backend API
  useEffect(() => {
    axios.get('http://localhost:5000/api/cart')
      .then(response => {
        setCart(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching cart:', error);
        setError('Could not load cart items');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Remove item from the cart
  const removeFromCart = (id) => {
    axios.delete(`http://localhost:5000/api/cart/${id}`)
      .then(() => {
        setCart(cart.filter(item => item.id !== id));  // Update local state
      })
      .catch(error => console.error('Error removing item:', error));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul className="list-group">
          {cart.map(item => (
            <li key={item.id} className="list-group-item d-flex justify-content-between">
              <span>{item.name} - ${item.price}</span>
              <button className="btn btn-danger" onClick={() => removeFromCart(item.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
