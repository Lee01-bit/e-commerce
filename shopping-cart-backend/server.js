// shopping-cart-backend/server.js
const express = require('express');
const firebaseAdmin = require('firebase-admin');
const cors = require('cors');

// Initialize Firebase Admin SDK
const serviceAccount = require('./e-commerce-35229-firebase-adminsdk-a5xx5-2d39f757f3.json');
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

const db = firebaseAdmin.firestore();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/cart', async (req, res) => {
  try {
    const cartRef = db.collection('cart');
    const snapshot = await cartRef.get();
    let cart = [];
    snapshot.forEach(doc => {
      cart.push({ id: doc.id, ...doc.data() });
    });
    res.json(cart);
  } catch (err) {
    res.status(500).send('Error fetching cart data');
  }
});

// Order API Endpoints

// Create a new order
app.post('/api/orders', async (req, res) => {
  try {
    const order = req.body; 
    if (!order.items || !order.totalAmount || !order.userId) {
      return res.status(400).send('Invalid order data');
    }

    const orderRef = await db.collection('orders').add({
      userId: order.userId,
      items: order.items,
      totalAmount: order.totalAmount,
      orderDate: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      statusHistory: [
        { status: 'Pending', timestamp: firebaseAdmin.firestore.FieldValue.serverTimestamp() }
      ],      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
    });

    res.status(201).send(`Order created with ID: ${orderRef.id}`);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).send('Error creating order');
  }
});

// Get order history for a user
app.get('/api/orders/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const ordersRef = db.collection('orders');
    const snapshot = await ordersRef.where('userId', '==', userId).get();

    if (snapshot.empty) {
      return res.status(404).send('No orders found for this user');
    }

    let orders = [];
    snapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).send('Error fetching orders');
  }
});

// Update order status
app.put('/api/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).send('Status is required');
    }

    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();
    if (!orderDoc.exists) {
      return res.status(404).send('Order not found');
    }

    await orderRef.update({ 
      statusHistory: firebaseAdmin.firestore.FieldValue.arrayUnion({
        status,
        timestamp: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      })
     });
    res.status(200).send('Order status updated');
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).send('Error updating order status');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
