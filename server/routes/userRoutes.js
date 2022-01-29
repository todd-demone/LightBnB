const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');

module.exports = (dbUsers) => {

  // POST /users
  router.post('/', (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 12);
    
    dbUsers
      .addUser(user)
      .then(user => {
        if (!user) {
          res.send({error: "error"});
        } else {
          req.session.userId = user.id;
          res.send("🤗");
        }
      })
      .catch(error => res.send(error));
  });

  // POST /users/login
  router.post('/login', (req, res) => {
    const {email, password} = req.body;
    
    dbUsers
      .getUserWithEmail(email)
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          req.session.userId = user.id;
          res.send({user: {name: user.name, email: user.email, id: user.id}});
        } else {
          res.send({error: "error"});
          return;
        }
      })
      .catch(error => res.send(error));
  });


  // POST /users/logout
  router.post('/logout', (req, res) => {
    req.session.userId = null;
    res.send({});
  });


  // GET /users/me
  router.get("/me", (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      res.send({message: "not logged in"});
      return;
    }
    
    dbUsers
      .getUserWithId(userId)
      .then(user => {
        if (!user) {
          res.send({error: "no user with that id"});
        } else {
          res.send({user: {name: user.name, email: user.email, id: userId}});
        }
      })
      .catch(error => res.send(error));
  });

  return router;
};