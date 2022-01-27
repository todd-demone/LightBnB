const db = require('../db');
const bcrypt = require('bcrypt');

module.exports = function(router) {

  // Create a new user
  router.post('/', (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 12);
    const text = `
      INSERT INTO users (name, email, password) 
      VALUES ($1, $2, $3) 
      RETURNING *;
    `;
    const params = [user.name, user.email, user.password];
    db.query(text, params, result => {
      const user = result.rows[0];
      if (!user) {
        res.send({error: "error"});
        return;
      }
      req.session.userId = user.id;
      res.send("🤗");
    }, 
    e => res.send(e));
  });

  router.post('/login', (req, res) => {
    const {email, password} = req.body;
    const text = `
      SELECT * 
      FROM users 
      WHERE email=$1;
    `;
    const params = [email.toLowerCase()];
    db.query(text, params, result => {
      const user = result.rows[0];
      // if a user is returned && passwords match
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.userId = user.id;
        res.send({user: {name: user.name, email: user.email, id: user.id}});
      } else {
        res.send({error: "error"});
        return;
      }
    },
    e => res.send(e));
  });
  

  router.post('/logout', (req, res) => {
    req.session.userId = null;
    res.send({});
  });


  router.get("/me", (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      res.send({message: "not logged in"});
      return;
    }
    const text = `
      SELECT * 
      FROM users
      WHERE id=$1;
    `;
    const params = [userId];
    db.query(text, params, result => {
      const user = result.rows[0];
      if (!user) {
        res.send({error: "no user with that id"});
        return;
      }
      res.send({user: {name: user.name, email: user.email, id: userId}});
    },
    e => res.send(e));
  });

  return router;
}