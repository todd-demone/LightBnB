const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

module.exports = {
  query: (text, params, fulfillmentHandler) => {
    return pool
    .query(text, params)
    .then(fulfillmentHandler)
    .catch(e => console.error(e));
  },
}