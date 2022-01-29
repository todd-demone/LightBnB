module.exports = (pool) => {

    const getProperties = (options, limit) => {
      const params = [];
      let whereClause = ``;
      let havingClause = ``;
      
      const concatToClause = (option, isWhereOption, isString, message) => {
        if (option) {
          if (isWhereOption) {
            params.length === 0 ? whereClause += `WHERE ` : whereClause += `AND `;
          }
          isString ? params.push(`%${option}%`) : params.push(Number(option));
          isWhereOption ? whereClause += `${message}$${params.length} ` : havingClause += `${message}$${params.length} `;
        }
      };

      concatToClause(options.city, true, true, `properties.city LIKE `);
      concatToClause(options.owner_id, true, false, `owner_id = `);
      concatToClause(options.minimum_price_per_night * 100, true, false, `cost_per_night >= `);
      concatToClause(options.maximum_price_per_night * 100, true, false, `cost_per_night <= `);
      concatToClause(options.minimum_rating, false, false, `HAVING avg(property_reviews.rating) >= `);
      
      params.push(limit);

      const text = `
        SELECT properties.*, AVG(property_reviews.rating) AS avg_rating
        FROM properties
        JOIN property_reviews ON properties.id = property_id
        ${whereClause}
        GROUP BY properties.id 
        ${havingClause}
        ORDER BY properties.cost_per_night
        LIMIT $${params.length};
      `;

      return pool
        .query(text, params)
        .then(result => result.rows)
        .catch(error => console.error(error.message));

    };

    const getReservations = (userId, limit) => {
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

      return pool
        .query(text, params)
        .then(result => result.rows)
        .catch(error => console.error(error.message));
    };

    const addNewProperty = (property) => {
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

      return pool
        .query(text, params)
        .then(result => result.rows[0])
        .catch(error => console.error(error.message));
    };

    return {
      getProperties,
      getReservations,
      addNewProperty
    };

};