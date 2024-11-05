const Database = require("better-sqlite3");
const db = new Database(process.env.DB_URL, Database.OPEN_READWRITE, {
  verbose: console.log,
});

module.exports = db;
