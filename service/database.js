const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

// The credentials come from dbConfig.json, which is gitignored and uploaded to the server by deployService.sh
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('glutenguard');

// Collections are created the first time a document is inserted into them
const users = db.collection('users');
const reviews = db.collection('reviews');

// Ping on startup so a bad credential or a blocked IP shows up right away in the logs.
// If the connection fails the service exits instead of running and failing on every request.
(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log('Connected to the database');
  } catch (ex) {
    console.log(`Unable to connect to the database at ${config.hostname}: ${ex.message}`);
    process.exit(1);
  }
})();

module.exports = { users, reviews };
