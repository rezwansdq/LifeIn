const request = require('supertest');
const express = require('express');
const auth = require('./auth');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const app = express();
app.get('/test', auth, (req, res) => res.status(200).send('OK'));

describe('Auth middleware', () => {
  it('should return 401 if no token is provided', async () => {
    const res = await request(app).get('/test');
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 if token is invalid', async () => {
    const res = await request(app).get('/test').set('x-auth-token', 'invalidtoken');
    expect(res.statusCode).toEqual(401);
  });

  it('should call next if token is valid', async () => {
    const user = new User({ name: 'Test User', email: 'test@example.com', password: 'password' });
    await user.save();
    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const res = await request(app).get('/test').set('x-auth-token', token);
    expect(res.statusCode).toEqual(200);
  });
});