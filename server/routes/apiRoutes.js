const express = require('express');
const router = express.Router();

module.exports = (dbApis) => {

  // GET /apis/properties
  router.get('/properties', (req, res) => {
    const options = req.query;
    const limit = 20;
    
    dbApis
      .getAllProperties(options, limit)
      .then(properties => res.send({properties}))
      .catch(error => res.send(error));
  });


  // GET /apis/reservations
  router.get('/reservations', (req, res) => {
    const userId = req.session.userId;
    const limit = 10;
    
    if (!userId) {
      res.error("💩");
      return;
    }

    dbApis
      .getAllReservations(userId, limit)
      .then(reservations => res.send({reservations}))
      .catch(error => res.send(error));
  });


  // POST /apis/properties
  router.post('/properties', (req, res) => {
    const userId = req.session.userId;
    const property = {...req.body, owner_id: userId};
    
    dbApis
      .addProperty(property)
      .then(property => res.send(property))
      .catch(error => res.send(error));
  });

  return router;
};