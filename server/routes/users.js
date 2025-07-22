const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Add to favorites
router.post('/favorites/:productId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const productId = req.params.productId;
    
    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
    }
    
    res.json({ message: 'Product added to favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove from favorites
router.delete('/favorites/:productId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.favorites = user.favorites.filter(id => id.toString() !== req.params.productId);
    await user.save();
    
    res.json({ message: 'Product removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get favorites
router.get('/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add to cart
router.post('/cart', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const user = await User.findById(req.user.userId);
    
    const existingItem = user.cart.find(item => item.product.toString() === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }
    
    await user.save();
    res.json({ message: 'Product added to cart' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get cart
router.get('/cart', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('cart.product');
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update cart item
router.put('/cart/:productId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user.userId);
    
    const cartItem = user.cart.find(item => item.product.toString() === req.params.productId);
    if (cartItem) {
      cartItem.quantity = quantity;
      await user.save();
    }
    
    res.json({ message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove from cart
router.delete('/cart/:productId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.cart = user.cart.filter(item => item.product.toString() !== req.params.productId);
    await user.save();
    
    res.json({ message: 'Product removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;