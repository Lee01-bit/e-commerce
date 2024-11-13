// src/CartContext.js
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';


const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Add item to cart
  const addItemToCart = (product) => {
    axios.post('http://localhost:5000/api/cart', product)
      .then(() => {
        // Add to local cart state
        setCart((prevCart) => {
          const existingItem = prevCart.find(item => item.id === product.id);
          if (existingItem) {
            return prevCart.map(item =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
          }
          return [...prevCart, { ...product, quantity: 1 }];
        });
      })
      .catch(error => console.error('Error adding item to cart:', error));
  };
  

  // Remove item from cart
  const removeItemFromCart = (id) => {
    axios.delete(`http://localhost:5000/api/cart/${id}`)
    .then(() => {
      // Remove from local state
      setCart(cart.filter(item => item.id !== id));
    })
    .catch(error => console.error('Error removing item:', error));
};
  

  // Update item quantity in cart
  const updateItemQuantity = (id, quantity) => {
    if (quantity <= 0) return removeItemFromCart(id);
    setCart((prevCart) =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cart, addItemToCart, removeItemFromCart, updateItemQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

