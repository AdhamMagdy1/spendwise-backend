const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
// console.log(uri);

let db;

async function connectToDatabase() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'SpendWise',
    });
    console.log('Connected to the database');
    db = mongoose.connection;
  } catch (error) {
    console.error('Error connecting to the database', error);
  }
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

module.exports = {
  connectToDatabase,
  getDb,
};
