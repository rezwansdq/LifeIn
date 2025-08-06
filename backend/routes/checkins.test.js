const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');
const CheckIn = require('../models/CheckIn');
const jwt = require('jsonwebtoken');

describe('Check-in API IDOR Protection', () => {
  let user1Token, user2Token;
  let user1Id, user2Id;
  let user1CheckInId, user2CheckInId;

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

    // Create check-ins for User 1
    const checkIn1 = new CheckIn({ user: user1Id, date: new Date(), rating: 5 });
    await checkIn1.save();
    user1CheckInId = checkIn1._id;

    // Create check-ins for User 2
    const checkIn2 = new CheckIn({ user: user2Id, date: new Date(), rating: 4 });
    await checkIn2.save();
    user2CheckInId = checkIn2._id;
  });

  afterEach(async () => {
    await User.deleteMany({});
    await CheckIn.deleteMany({});
  });

  // Test PUT /api/checkins/:id
  it('should not allow user1 to update user2\'s check-in', async () => {
    const res = await request(app)
      .put(`/api/checkins/${user2CheckInId}`)
      .set('x-auth-token', user1Token)
      .send({ rating: 1 });
    expect(res.statusCode).toEqual(401); // Or 403
  });

  // Test DELETE /api/checkins/:id
  it('should not allow user1 to delete user2\'s check-in', async () => {
    const res = await request(app)
      .delete(`/api/checkins/${user2CheckInId}`)
      .set('x-auth-token', user1Token);
    expect(res.statusCode).toEqual(401); // Or 403
  });
});