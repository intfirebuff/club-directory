'use strict';
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
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

  apiRoutes.post('/club/edit', authenticate, ((req, res) => {
    let payload = req.body;
    let textPlaceholderArr = [];

    for (let [key, value] of Object.entries(payload)) {
      if (value !== '') {
        textPlaceholderArr.push(`<p><h3>${key}:</h3>${value}</p><br>`);
      }
    }

    const transport = nodemailer.createTransport({
      host: 'smtp.mailgun.org',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAILGUN_SMTP_LOGIN,
        pass: process.env.MAILGUN_SMTP_PASSWORD
      }
    });

    transport.sendMail({
        from: process.env.MAILGUN_SMTP_LOGIN,
        to: ['it@ifba.org'],
        subject: `Club Directory Update Request - ${payload.club_name}`,
        html: textPlaceholderArr.join('')
      }, (err) => {

        if (err) {
          return res.status(500).json({ error: err.message });
        }

        return res.sendStatus(200);
      }
    );

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

  apiRoutes.get('/ifba/officers', authenticate, ((req, res) => {
    DataHelpers.getIfbaOfficers((err, officers) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        return res.json(officers);
      }
    });
  }));

  /*
    UNUSED ROUTES

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

    apiRoutes.get('/club/inactive', authenticate, ((req, res) => {
      DataHelpers.getInactive((err, clubs) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        } else {
          return res.json(clubs);
        }
      });
    }));

  */

  return apiRoutes;

}