const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Habit = require('../models/Habit');

// @route   GET /api/habits
// @desc    Get all habits for a user
// @access  Private
router.get('/', auth, async (req, res, next) => {
  try {
    const habits = await Habit.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/habits
// @desc    Create a new habit
// @access  Private
router.post('/', auth, async (req, res, next) => {
  const { name } = req.body;

  try {
    const newHabit = new Habit({
      user: req.user.id,
      name,
    });

    const habit = await newHabit.save();
    res.json(habit);
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/habits/:id
// @desc    Update a habit
// @access  Private
router.put('/:id', auth, async (req, res, next) => {
  const { name, completed, streak } = req.body;

  // Build habit object
  const habitFields = {};
  if (name) habitFields.name = name;
  if (completed !== undefined) habitFields.completed = completed;
  if (streak !== undefined) habitFields.streak = streak;

  try {
    let habit = await Habit.findById(req.params.id);

    if (!habit) return res.status(404).json({ msg: 'Habit not found' });

    // Make sure user owns habit
    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    habit = await Habit.findByIdAndUpdate(
      req.params.id,
      { $set: habitFields },
      { new: true }
    );

    res.json(habit);
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/habits/:id
// @desc    Delete a habit
// @access  Private
router.delete('/:id', auth, async (req, res, next) => {
  try {
    let habit = await Habit.findById(req.params.id);

    if (!habit) return res.status(404).json({ msg: 'Habit not found' });

    // Make sure user owns habit
    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Habit.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Habit removed' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;