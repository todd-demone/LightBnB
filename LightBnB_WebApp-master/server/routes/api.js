const db = require('../db');

module.exports = function(router) {

  router.get('/properties', (req, res) => {
    const options = req.query;
    const limit = 20;
    const params = [];
    let text = `
      SELECT properties.*, AVG(property_reviews.rating) AS avg_rating
      FROM properties
      JOIN property_reviews ON properties.id = property_id
    `;
    const addWhereOrAnd = function() {
      params.length === 0 ? text += `WHERE ` : text += `AND `;
    };
    
    if (options.city) {
      params.push(`%${options.city}%`);
      text += `WHERE properties.city LIKE $${params.length} `;
    }

    if (options.owner_id) {
      addWhereOrAnd();
      params.push(`${options.owner_id}`);
      text += `owner_id = $${params.length} `;
    }

    const minPrice = options.minimum_price_per_night * 100;
    const maxPrice = options.maximum_price_per_night * 100;
    
    if (minPrice && maxPrice) {
      addWhereOrAnd();
      params.push(minPrice, maxPrice);
      text += `cost_per_night >= $${params.length - 1} AND cost_per_night <= $${params.length} `;
    } else if (minPrice) {
      addWhereOrAnd();
      params.push(minPrice);
      text += `cost_per_night >= $${params.length} `;
    } else if (maxPrice) {
      addWhereOrAnd();
      params.push(maxPrice);
      text += `cost_per_night <= $${params.length} `;
    }

    text += `
      GROUP BY properties.id 
    `;

    if (options.minimum_rating) {
      params.push(Number(options.minimum_rating));
      text += `
        HAVING avg(property_reviews.rating) >= $${params.length} 
      `;
    }

    params.push(limit);
    text += `
      ORDER BY properties.cost_per_night
      LIMIT $${params.length};
    `;

    db.query(text, params, result => {
      const properties = result.rows;
      res.send({properties});
    })
    .catch(e => res.send(e));  

  });

  router.get('/reservations', (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      res.error("💩");
      return;
    }
    const limit = 10;
    const params = [userId, limit];
    const text = `
      SELECT properties.*, reservations.*, AVG(property_reviews.rating) as avg_rating
      FROM reservations
        JOIN properties ON properties.id = reservations.property_id
        JOIN property_reviews ON properties.id = property_reviews.property_id
      WHERE reservations.guest_id = $1
      GROUP BY properties.id, reservations.id 
      ORDER BY reservations.start_date
      LIMIT $2;
    `;

    db.query(text, params, result => {
      const reservations = result.rows;
      res.send({reservations});
    })
    .catch(e => res.send(e));
  });

  router.post('/properties', (req, res) => {
    const userId = req.session.userId;
    const property = {...req.body, owner_id: userId};
    const params = [];
    let propertyFieldsAndValues = [];
    let fieldsString = ``;
    let valuesString = ``;

    // convert property object to an array of arrays [[field1, value1], [field2, value2],...]
    for (const key in property) {
      propertyFieldsAndValues.push([key, property[key]]);
    }

    for (let i = 0; i < propertyFieldsAndValues.length; i++) {
      //  add the field (e.g., city) to fieldsString
      fieldsString += `${propertyFieldsAndValues[i][0]}`;

      // add a comma to fieldsString unless this is the last item in the array
      if (i < propertyFieldsAndValues.length - 1) fieldsString += `, `;

      // add the value (e.g., 'Vancouver') to the params array
      params.push(propertyFieldsAndValues[i][1]);

      // add a  placeholder (eg $1) to valuesString
      valuesString += `$${params.length}`;

      // add a comma to valuesString unless this is the last item in the array
      if (i < propertyFieldsAndValues.length - 1) valuesString += `, `;
    }

    const text = `
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

    db.query(text, params, result => {
      const property = result.rows[0];
      res.send(property);
    })
    .catch(e => res.send(e));
  });

  return router;
}