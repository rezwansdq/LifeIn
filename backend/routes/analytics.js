const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Habit = require('../models/Habit');
const Goal = require('../models/Goal');
const CheckIn = require('../models/CheckIn');

// @route   GET api/analytics
// @desc    Get analytics data for a user
// @access  Private
router.get('/', auth, async (req, res, next) => {
  try {
    const habits = await Habit.find({ user: req.user.id });
    const goals = await Goal.find({ user: req.user.id });
    const checkins = await CheckIn.find({ user: req.user.id });

    // Basic stats for now, will be expanded
    const analyticsData = {
      habitsCount: habits.length,
      goalsCount: goals.length,
      checkinsCount: checkins.length,
      habits,
      goals,
      checkins,
    };

    res.json(analyticsData);
  } catch (err) {
    next(err);
  }
});

module.exports = router;