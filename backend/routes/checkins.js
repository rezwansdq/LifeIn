const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const CheckIn = require('../models/CheckIn');

// @route   GET /api/checkins
// @desc    Get all check-ins for a user
// @access  Private
router.get('/', auth, async (req, res, next) => {
  try {
    const checkins = await CheckIn.find({ user: req.user.id }).sort({ date: -1 });
    res.json(checkins);
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/checkins
// @desc    Create a new check-in
// @access  Private
router.post('/', auth, async (req, res, next) => {
  const { date, rating, notes } = req.body;

  try {
    const newCheckIn = new CheckIn({
      user: req.user.id,
      date,
      rating,
      notes,
    });

    const checkin = await newCheckIn.save();
    res.json(checkin);
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/checkins/:id
// @desc    Update a check-in
// @access  Private
router.put('/:id', auth, async (req, res, next) => {
  const { date, rating, notes } = req.body;

  // Build check-in object
  const checkInFields = {};
  if (date) checkInFields.date = date;
  if (rating) checkInFields.rating = rating;
  if (notes) checkInFields.notes = notes;

  try {
    let checkin = await CheckIn.findById(req.params.id);

    if (!checkin) return res.status(404).json({ msg: 'Check-in not found' });

    // Make sure user owns check-in
    if (checkin.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    checkin = await CheckIn.findByIdAndUpdate(
      req.params.id,
      { $set: checkInFields },
      { new: true }
    );

    res.json(checkin);
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/checkins/:id
// @desc    Delete a check-in
// @access  Private
router.delete('/:id', auth, async (req, res, next) => {
  try {
    let checkin = await CheckIn.findById(req.params.id);

    if (!checkin) return res.status(404).json({ msg: 'Check-in not found' });

    // Make sure user owns check-in
    if (checkin.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await CheckIn.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Check-in removed' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;