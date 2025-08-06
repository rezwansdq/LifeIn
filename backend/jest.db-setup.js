const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async () => {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  process.env.MONGO_URI = mongoUri;
  global.__MONGO_SERVER__ = mongoServer;
};