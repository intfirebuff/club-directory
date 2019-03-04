'use strict';
const express = require('express');
const apiRoutes = express.Router();

module.exports = (DataHelpers) => {

  apiRoutes.get('/club/all', ((req, res) => {
    DataHelpers.getAllClubs((err, clubs) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(clubs);
      }
    });
  }));

  apiRoutes.get('/club/inactive', ((req, res) => {
    DataHelpers.getInactive((err, clubs) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(clubs);
      }
    });
  }));

  apiRoutes.get('/club/:id', ((req, res) => {
    let id = req.params.id;
    DataHelpers.getClubById(id, (err, clubs) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(clubs);
      }
    });
  }));

  apiRoutes.get('/region/:id', ((req, res) => {
    let region = req.params.id;
    DataHelpers.getClubsByRegion(region, (err, clubs) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(clubs);
      }
    });
  }));

  apiRoutes.get('/state/:id', ((req, res) => {
    let state = req.params.id;
    DataHelpers.getClubsByState(state, (err, clubs) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(clubs);
      }
    });
  }));

  return apiRoutes;

}