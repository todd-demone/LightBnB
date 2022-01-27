const { reject } = require('bcrypt/promises');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME
});

module.exports = {
  query: (text, params, fulfillmentHandler, rejectionHandler) => {
    return pool.query(text, params)
    .then(fulfillmentHandler)
    .catch(rejectionHandler);
  },
}