const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const VaultItem = require('../models/VaultItem');

// Get all vault items for user
router.get('/', auth, async (req, res) => {
  try {
    const items = await VaultItem.find({ userId: req.user.userId })
      .sort({ updatedAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create vault item
router.post('/', auth, async (req, res) => {
  try {
    const { encryptedData, iv } = req.body;

    const item = new VaultItem({
      userId: req.user.userId,
      encryptedData,
      iv
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update vault item
router.put('/:id', auth, async (req, res) => {
  try {
    const { encryptedData, iv } = req.body;

    let item = await VaultItem.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.encryptedData = encryptedData;
    item.iv = iv;
    item.updatedAt = Date.now();

    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete vault item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await VaultItem.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;