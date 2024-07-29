const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// Register user
router.post('/register', async (req, res) => {
  try {
    const { idNumber, phoneNumber, firstName, lastName } = req.body;
    const uniqueId = uuidv4();

    const newUser = new User({ idNumber, phoneNumber, firstName, lastName, uniqueId });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Confirm receipt of a gift
router.post('/users/:id/confirm-gift', async (req, res) => {
  try {
    const { giftId } = req.body;
    const user = await User.findById(req.params.id);

    const gift = user.gifts.id(giftId);
    if (gift) {
      gift.confirmed = true;
      await user.save();

      // Check if the user who sent the gift can advance to the next level
      const giftingUser = await User.findById(gift.giftingUserId);
      const allGiftsConfirmed = giftingUser.gifts.every(g => g.confirmed);

      if (allGiftsConfirmed) {
        giftingUser.level += 1;
        await giftingUser.save();
      }

      res.json(user);
    } else {
      res.status(404).json({ message: 'Gift not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a referral
router.post('/users/:id/referrals', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const newReferral = new User(req.body);
    await newReferral.save();
    user.referrals.push(newReferral._id);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user details along with gifted users' phone numbers
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('giftedUsers', 'firstName lastName phoneNumber')
      .populate('referrals', 'firstName lastName phoneNumber');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
