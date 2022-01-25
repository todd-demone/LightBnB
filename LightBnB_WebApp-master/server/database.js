const { Pool } = require('pg');
const properties = require('./json/properties.json');
const users = require('./json/users.json');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const text = `SELECT * FROM users WHERE email=$1;`;
  const values = [email.toLowerCase()];
  
  return pool
    .query(text, values)
    .then(res => {
      if (res.rows[0]) {
        return res.rows[0]
      } else {
        return null;
      }
    })
    .catch(e => console.error(e.stack));
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const text = `SELECT * from USERS where id=$1;`;
  const values = [id];
  
  return pool
    .query(text, values)
    .then(res => {
      if (res.rows[0]) {
        console.log(res.rows[0])
        return res.rows[0];
      } else {
        console.log(null);
        return null;
      }
    })
    .catch(e => console.log(e.stack));
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const text = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`;
  const values = [user.name, user.email, user.password];
  
  return pool
    .query(text, values)
    .then(res => res.rows[0])
    .catch(e => console.error(e.stack));
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const text = `SELECT * FROM properties LIMIT $1;`;
  const values = [limit];
  
  // This works because .then always returns a promise. 
  // Even though we wrote the line return result.rows (where result.rows 
  // is an array of objects), .then automatically places that value in a promise.
  // .then returns a promise, which is returned as a result of the entire
  // getAllProperties function.
  return pool
    .query(text, values)
    .then(res => res.rows)
    .catch(e => console.error(e.stack));
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
