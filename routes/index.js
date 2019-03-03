'use strict';
const express = require('express');
const apiRoutes = express.Router();

module.exports = (DataHelpers) => {

  apiRoutes.get('/all', ((req, res) => {
    DataHelpers.getClubs((err, clubs) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(clubs);
      }
    });
  }));

  return apiRoutes;

}