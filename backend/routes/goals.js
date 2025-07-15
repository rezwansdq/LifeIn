const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Goal = require('../models/Goal');

// @route   GET /api/goals
// @desc    Get all goals for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/goals
// @desc    Create a new goal
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, progress, target } = req.body;

  try {
    const newGoal = new Goal({
      user: req.user.id,
      title,
      progress,
      target,
    });

    const goal = await newGoal.save();
    res.json(goal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/goals/:id
// @desc    Update a goal
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, progress, target } = req.body;

  // Build goal object
  const goalFields = {};
  if (title) goalFields.title = title;
  if (progress !== undefined) goalFields.progress = progress;
  if (target) goalFields.target = target;

  try {
    let goal = await Goal.findById(req.params.id);

    if (!goal) return res.status(404).json({ msg: 'Goal not found' });

    // Make sure user owns goal
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    goal = await Goal.findByIdAndUpdate(
      req.params.id,
      { $set: goalFields },
      { new: true }
    );

    res.json(goal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/goals/:id
// @desc    Delete a goal
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let goal = await Goal.findById(req.params.id);

    if (!goal) return res.status(404).json({ msg: 'Goal not found' });

    // Make sure user owns goal
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Goal.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Goal removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;