module.exports = (pool) => {
    
  const createUser = (user) => {
    const text = `
      INSERT INTO users (name, email, password) 
      VALUES ($1, $2, $3) 
      RETURNING *;
    `;
    const params = [user.name, user.email, user.password];
    
    return pool
      .query(text, params)
      .then(result => result.rows[0])
      .catch(error => console.error(error.message));
  };

  const getUserByEmail = (email) => {
    const text = `
      SELECT * 
      FROM users 
      WHERE email=$1;
    `;
    const params = [email.toLowerCase()];

    return pool
      .query(text, params)
      .then(result => result.rows[0])
      .catch(error => console.error(error.message));
  };

  const getUserById = (userId) => {
    const text = `
      SELECT * 
      FROM users
      WHERE id=$1;
    `;
    const params = [userId];

    return pool
      .query(text, params) 
      .then(result => result.rows[0])
      .catch(error => console.error(error.message));
  };

  return {
    createUser,
    getUserByEmail,
    getUserById
  };

};