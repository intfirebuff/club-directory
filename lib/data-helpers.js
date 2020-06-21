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
                .orderBy('name', 'asc')
                .then((results) => {
                    callback(null, results);
                })
                .catch((error) => {
                    console.error('Something blew up');
                });
        },

        getPublicClubs: function(callback) {
            knex
                .select(
                    'name',
                    'region',
                    'city',
                    'state_code',
                    'website',
                    'facebook_url',
                    'instagram_handle',
                    'twitter_handle',
                    'canteen',
                    'museum',
                    'is_physical_address'
                    )
                .from('clubs')
                .where('active', 1)
                .orderBy('name', 'asc')
                .then((results) => {
                    callback(null, results);
                })
                .catch((error) => {
                    console.error('Something blew up');
                });
        },

        getOfficersByClubId: function(id, callback) {
            knex('officers')
                .innerJoin('club_officer_role', 'officers.id', 'club_officer_role.officer_id')
                .where('club_officer_role.club_id', id)
                .orderBy('club_officer_role.club_id', 'asc')
                .then((result) => {
                    callback(null, result);
                })
                .catch((error) => {
                    console.error('Something blew up');
                });
        },

        getIfbaOfficers: function(callback) {
            knex('ifba_officers')
                .orderBy('id', 'asc')
                .then((results) => {
                    callback(null, results);
                })
                .catch((error) => {
                    console.error('Something blew up');
                });
        },

        /*
            INACTIVE ENDPOINTS

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
        */
    };
}