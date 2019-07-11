'use strict';

const express = require('express');
const userRoutes = express.Router();
const bcrypt = require('bcrypt');

module.exports = (DataHelpers) => {

    userRoutes.post('/login', (req, res) => {
        let { username, password } = req.body;
        if (!username || !password) {
            req.flash('danger', 'Please check your username and/or password and try again.');
            return res.redirect('/');
        };

        DataHelpers.getUser(username, (err, userCb) => {
            if (err) {
                throw err
            }

            if (!isValidUser(userCb, password)) {
                req.flash('danger', 'Please check your username and/or password and try again.');
                return res.redirect('/');
            }

            req.session.user = userCb.username;
            return res.redirect('/');
        });
    });

    function isValidUser(userCb, password) {
        return userCb && bcrypt.compareSync(password, userCb.password_digest);
    }

    userRoutes.post('/logout', (req, res) => {
        req.session = null;
        return res.redirect('/');
    });

    return userRoutes;
};