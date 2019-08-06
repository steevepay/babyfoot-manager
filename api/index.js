const { Pool } = require('pg')

// pools will use environment variables
// for connection information
const pool = new Pool()

module.exports = {
  query: (text, params, callback) =>  pool.query(text, params, callback)
}