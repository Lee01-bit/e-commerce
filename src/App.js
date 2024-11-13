// src/App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CartProvider } from './CartContext';
import ProductList from './ProductList';
import Cart from './cart';

function App() {
  return (
    <CartProvider>
      <div className="App">
        <header className="App-header">
          <h1 className="text-center">Welcome to the Shopping Cart App</h1>
        </header>
        <ProductList />
        <Cart />
      </div>
    </CartProvider>
  );
}

export default App;
