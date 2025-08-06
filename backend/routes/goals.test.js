const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');
const Goal = require('../models/Goal');
const jwt = require('jsonwebtoken');

describe('Goal API IDOR Protection', () => {
  let user1Token, user2Token;
  let user1Id, user2Id;
  let user1GoalId, user2GoalId;

  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Create User 1
    const user1 = new User({ name: 'User One', email: 'user1@example.com', password: 'password1' });
    await user1.save();
    user1Id = user1._id;
    user1Token = jwt.sign({ user: { id: user1Id } }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Create User 2
    const user2 = new User({ name: 'User Two', email: 'user2@example.com', password: 'password2' });
    await user2.save();
    user2Id = user2._id;
    user2Token = jwt.sign({ user: { id: user2Id } }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Create goals for User 1
    const goal1 = new Goal({ user: user1Id, title: 'User 1 Goal' });
    await goal1.save();
    user1GoalId = goal1._id;

    // Create goals for User 2
    const goal2 = new Goal({ user: user2Id, title: 'User 2 Goal' });
    await goal2.save();
    user2GoalId = goal2._id;
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Goal.deleteMany({});
  });

  // Test PUT /api/goals/:id
  it('should not allow user1 to update user2\'s goal', async () => {
    const res = await request(app)
      .put(`/api/goals/${user2GoalId}`)
      .set('x-auth-token', user1Token)
      .send({ title: 'Updated by User 1' });
    expect(res.statusCode).toEqual(401); // Or 403
  });

  // Test DELETE /api/goals/:id
  it('should not allow user1 to delete user2\'s goal', async () => {
    const res = await request(app)
      .delete(`/api/goals/${user2GoalId}`)
      .set('x-auth-token', user1Token);
    expect(res.statusCode).toEqual(401); // Or 403
  });
});