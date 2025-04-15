// server.js - Main entry point for Node.js Express backend

const express = require('express');
const cors = require('cors');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc } = require('firebase/firestore');

const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// Firebase configuration - replace with your own config
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
  };
  
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Collection reference
const auctionItemsCollection = collection(db, 'auctionItems');

// ROUTES

// Get all auction items
app.get('/api/items', async (req, res) => {
  try {
    const querySnapshot = await getDocs(auctionItemsCollection);
    const items = [];
    
    querySnapshot.forEach(doc => {
      items.push({ 
        id: doc.id, 
        ...doc.data() 
      });
    });
    
    res.status(200).json(items);
  } catch (error) {
    console.error('Error getting items:', error);
    res.status(500).json({ message: 'Failed to fetch items', error: error.message });
  }
});

// Get a single auction item
app.get('/api/items/:id', async (req, res) => {
  try {
    const itemDoc = doc(db, 'auctionItems', req.params.id);
    const docSnapshot = await getDoc(itemDoc);
    
    if (!docSnapshot.exists()) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.status(200).json({ 
      id: docSnapshot.id, 
      ...docSnapshot.data() 
    });
  } catch (error) {
    console.error('Error getting item:', error);
    res.status(500).json({ message: 'Failed to fetch item', error: error.message });
  }
});

// Create a new auction item


async function addNewItem(itemData) {
    const db = firebase.firestore();
    const itemsRef = db.collection('items');
    
    // Method 1: Let Firebase generate a random ID
    // Create a new document reference with auto-generated ID
    const newItemRef = itemsRef.doc();
    
    // Get the largest sale number from the collection
    const querySnapshot = await itemsRef.orderBy('saleNumber', 'desc').limit(1).get();
    let largestSaleNumber = 0;
    
    if (!querySnapshot.empty) {
      largestSaleNumber = querySnapshot.docs[0].data().saleNumber || 0;
    }
    
    // Increment the sale number
    const newSaleNumber = largestSaleNumber + 1;
    
    // Add the item with the new sale number
    return newItemRef.set({
      ...itemData,
      saleNumber: newSaleNumber,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
app.post('/api/items', async (req, res) => {
  try {
    const newItem = {
      saleNumber: req.body.saleNumber,
      title: req.body.title,
      description: req.body.description,
      consignor: req.body.consignor,
      estimate: {
        high: req.body.estimate.high,
        low: req.body.estimate.low
      },
      createdAt: new Date()
    };
    
    const docRef = await addDoc(auctionItemsCollection, newItem);
    
    res.status(201).json({
      id: docRef.id,
      ...newItem
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: 'Failed to create item', error: error.message });
  }
});

// Update an auction item
app.put('/api/items/:id', async (req, res) => {
  try {
    const itemDoc = doc(db, 'auctionItems', req.params.id);
    const docSnapshot = await getDoc(itemDoc);
    
    if (!docSnapshot.exists()) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    const updatedItem = {
      saleNumber: req.body.saleNumber,
      title: req.body.title,
      description: req.body.description,
      consignor: req.body.consignor,
      estimate: {
        high: req.body.estimate.high,
        low: req.body.estimate.low
      },
      updatedAt: new Date()
    };
    
    await updateDoc(itemDoc, updatedItem);
    
    res.status(200).json({
      id: req.params.id,
      ...updatedItem
    });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Failed to update item', error: error.message });
  }
});

// Delete an auction item
app.delete('/api/items/:id', async (req, res) => {
  try {
    const itemDoc = doc(db, 'auctionItems', req.params.id);
    const docSnapshot = await getDoc(itemDoc);
    
    if (!docSnapshot.exists()) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    await deleteDoc(itemDoc);
    
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Failed to delete item', error: error.message });
  }
});





// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});