const Database = require("better-sqlite3");
const db = new Database(process.env.DB_URL, Database.OPEN_READWRITE, {
  verbose: (sql) => console.log(`Query: ${sql} ${Date.now()}`),
});

module.exports = db;
