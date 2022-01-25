const { Pool } = require('pg');

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
  const queryString = `SELECT * FROM users WHERE email=$1;`;
  const queryParams = [email.toLowerCase()];
  
  return pool
    .query(queryString, queryParams)
    .then(res => {
      if (res.rows[0]) {
        return res.rows[0];
      } else {
        return null;
      }
    })
    .catch(e => console.error(e.stack));
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const queryString = `SELECT * from USERS where id=$1;`;
  const queryParams = [id];
  
  return pool
    .query(queryString, queryParams)
    .then(res => {
      if (res.rows[0]) {
        console.log(res.rows[0]);
        return res.rows[0];
      } else {
        console.log(null);
        return null;
      }
    })
    .catch(e => console.log(e.stack));
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const queryString = `
    INSERT INTO users (name, email, password) 
    VALUES ($1, $2, $3) 
    RETURNING *;
  `;
  const queryParams = [user.name, user.email, user.password];
  
  return pool
    .query(queryString, queryParams)
    .then(res => res.rows[0])
    .catch(e => console.error(e.stack));
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guestId The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guestId, limit = 10) {
  const queryString = `
    SELECT properties.*, reservations.*, AVG(property_reviews.rating) as avg_rating
    FROM reservations
      JOIN properties ON properties.id = reservations.property_id
      JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    GROUP BY properties.id, reservations.id 
    ORDER BY reservations.start_date
    LIMIT $2;
  `;
  const queryParams = [guestId, limit];
  
  return pool
    .query(queryString, queryParams)
    .then(res => res.rows)
    .catch(e => console.error(e.stack));
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  
  const queryParams = [];

  const minPrice = options.minimum_price_per_night * 100;
  const maxPrice = options.maximum_price_per_night * 100;

  let queryString = `
    SELECT properties.*, AVG(property_reviews.rating) AS avg_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
  `;
  
  const addWhereOrAnd = function() {
    queryParams.length === 0 ? queryString += `WHERE ` : queryString += `AND `;
  };
  
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE properties.city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    addWhereOrAnd();
    queryParams.push(`${options.owner_id}`);
    queryString += `owner_id = $${queryParams.length} `;
  }

  
  if (minPrice && maxPrice) {
    addWhereOrAnd();
    queryParams.push(minPrice, maxPrice);
    queryString += `cost_per_night >= $${queryParams.length - 1} AND cost_per_night <= $${queryParams.length} `;
  } else if (minPrice) {
    addWhereOrAnd();
    queryParams.push(minPrice);
    queryString += `cost_per_night >= $${queryParams.length} `;
  } else if (maxPrice) {
    addWhereOrAnd();
    queryParams.push(maxPrice);
    queryString += `cost_per_night <= $${queryParams.length} `;
  }

  queryString += `
    GROUP BY properties.id
  `;

  if (options.minimum_rating) {
    queryParams.push(Number(options.minimum_rating));
    queryString += `
    HAVING avg(property_reviews.rating) >= $${queryParams.length} 
    `;
  }

  queryParams.push(limit);
  queryString += `
    ORDER BY properties.cost_per_night
    LIMIT $${queryParams.length};
  `;

  // This works because .then always returns a promise.
  // Even though we wrote the line return result.rows (where result.rows
  // is an array of objects), .then automatically places that value in a promise.
  // .then returns a promise, which is returned as a result of the entire
  // getAllProperties function.
  return pool
    .query(queryString, queryParams)
    .then(res => res.rows)
    .catch(e => console.error(e.stack));
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  
  const queryParams = [];
  let propertyFieldsAndValues = [];
  let fieldsString = ``;
  let valuesString = ``;

  // convert property object to an array of arrays [[field1, value1], [field2, value2],...]
  for (const key in property) {
    propertyFieldsAndValues.push([key, property[key]]);
  }

  // add text to the fields portion and values portion of queryString; add params to queryParams
  for (let i = 0; i < propertyFieldsAndValues.length; i++) {
    //  add the field (eg city) to fieldsString
    fieldsString += `${propertyFieldsAndValues[i][0]}`;

    // add a comma unless this is the last field in the array
    if (i < propertyFieldsAndValues.length - 1) fieldsString += `, `;

    // add the value (eg 'Vancouver') to queryParams array
    queryParams.push(propertyFieldsAndValues[i][1]);

    // add a  placeholder (eg $1) to paramsString
    valuesString += `$${queryParams.length}`;

    // add a comma unless this is the last field in the array
    if (i < propertyFieldsAndValues.length - 1) valuesString += `, `;
  }

  const queryString = `
    INSERT INTO properties
    (
    ${fieldsString}
    )
    VALUES 
    (
    ${valuesString}
    ) 
    RETURNING *;
  `;

  return pool
    .query(queryString, queryParams)
    .then(res => res.rows[0])
    .catch(e => console.error(e.stack));
};
exports.addProperty = addProperty;
