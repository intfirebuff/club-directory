"use strict";

module.exports = function makeDataHelpers(knex) {
    return {
        getUser: function(username, callback) {
            knex('users')
                .where('username', username)
                .first()
                .then((result) => {
                    callback(null, result);
                })
                .catch((error) => {
                    console.error('Something blew up');
                });
        },

        getAllClubs: function(callback) {
            knex('clubs')
                .where('active', 1)
                .orderBy('id', 'asc')
                .then((results) => {
                    callback(null, results);
                })
                .catch((error) => {
                    console.error('Something blew up');
                });
        },

        getClubById: function(id, callback) {
            knex('clubs')
                .where('id', id)
                .then((result) => {
                    callback(null, result);
                })
                .catch((error) => {
                    console.error('Something blew up');
                });
        },

        getOfficersByClubId: function(id, callback) {
            knex('officers')
                .where('club_id', id)
                .orderBy('id', 'asc')
                .then((result) => {
                    callback(null, result);
                })
                .catch((error) => {
                    console.error('Something blew up');
                });
        },

        getClubsByRegion: function(region, callback) {
            knex('clubs')
                .where('region', region)
                .where('active', 1)
                .then((result) => {
                    callback(null, result);
                })
                .catch((error) => {
                    console.error('Something blew up');
                });
        },

        getClubsByState: function(state, callback) {
            knex('clubs')
                .where('state_code', state)
                .where('active', 1)
                .then((result) => {
                    callback(null, result);
                })
                .catch((error) => {
                    console.error('Something blew up');
                });
        },

        getInactive: function (callback) {
            knex('clubs')
                .where('active', 0)
                .orderBy('id', 'asc')
                .then((results) => {
                    callback(null, results);
                })
                .catch((error) => {
                    console.error('Something blew up');
                });
        }
    };
}