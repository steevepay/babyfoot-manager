const { Pool } = require('pg')

// pools will use environment variables
// for connection information
const pool = new Pool()

pool.query('SELECT NOW()');
if (pool.totalCount === 1) {
  console.log("Database connected!");
} else {
  throw new Error("Database not connected.")
}

module.exports = {
  query: (text, params, callback) =>  pool.query(text, params, callback)
}