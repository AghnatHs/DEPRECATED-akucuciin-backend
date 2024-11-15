const Database = require("better-sqlite3");
const path = require("path");
const db = new Database(path.resolve(process.env.DB_URL), Database.OPEN_READWRITE, {
  verbose: (sql) => console.log(`Query: ${sql} ${Date.now()}`),
});

module.exports = db;
