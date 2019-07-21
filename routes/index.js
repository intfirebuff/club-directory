'use strict';
const express = require('express');
const apiRoutes = express.Router();

module.exports = (DataHelpers) => {

  const authenticate = ((req, res, next) => {
    return req.session.user ? next() : res.status(401).json({ error: 'unauthorized' });
  });

  apiRoutes.get('/club/all', authenticate, ((req, res) => {
    DataHelpers.getAllClubs((err, clubs) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        return res.json(clubs);
      }
    });
  }));

  apiRoutes.get('/club/inactive', authenticate, ((req, res) => {
    DataHelpers.getInactive((err, clubs) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        return res.json(clubs);
      }
    });
  }));

  apiRoutes.get('/club/:id', authenticate, ((req, res) => {
    let id = req.params.id;
    DataHelpers.getClubById(id, (err, clubs) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        return res.json(clubs);
      }
    });
  }));

  apiRoutes.post('/club/edit', authenticate, ((req, res) => {
    console.log(req.body)
  }));

  apiRoutes.get('/officers/:id', authenticate, ((req, res) => {
    let id = req.params.id;
    DataHelpers.getOfficersByClubId(id, (err, officers) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        return res.json(officers);
      }
    });
  }));

  apiRoutes.get('/region/:id', authenticate, ((req, res) => {
    let region = req.params.id;
    DataHelpers.getClubsByRegion(region, (err, clubs) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        return res.json(clubs);
      }
    });
  }));

  apiRoutes.get('/state/:id', authenticate, ((req, res) => {
    let state = req.params.id;
    DataHelpers.getClubsByState(state, (err, clubs) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        return res.json(clubs);
      }
    });
  }));

  return apiRoutes;

}