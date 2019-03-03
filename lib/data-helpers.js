"use strict";

module.exports = function makeDataHelpers(knex) {
    return {
        getAllClubs: function (callback) {
            knex('clubs')
                .where('active', 1)
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