const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

// The credentials come from dbConfig.json, which is gitignored and uploaded to the server by deployService.sh
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('glutenguard');

// Collections are created the first time a document is inserted into them
const users = db.collection('users');
const reviews = db.collection('reviews');

// index.js awaits this before it starts listening, so the web server never runs without a database.
// The ping makes a bad credential or a blocked IP show up right away in the logs, and the error is thrown to the caller to handle.
async function connect() {
  try {
    await db.command({ ping: 1 });
    // Two accounts can't share an email, even if two signups arrive at the same moment.
    // The findUser check in index.js gives a friendly message, and this index is what actually enforces it.
    await users.createIndex({ email: 1 }, { unique: true });
    console.log('Connected to the database');
  } catch (ex) {
    throw new Error(`Unable to connect to the database at ${config.hostname}: ${ex.message}`);
  }
}

module.exports = { connect, users, reviews };
