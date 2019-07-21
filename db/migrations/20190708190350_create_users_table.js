exports.up = function(knex, Promise) {
    return new Promise(async (resolve, reject) => {
        try {
            await Promise.all([
                knex.schema.createTable('users', table => {
                    table.increments();
                    table.string('username').notNullable();
                    table.string('password_digest').notNullable();
                    table.timestamp('created_at').defaultTo(knex.fn.now());
                })
            ]);
            console.log('created users table');
            resolve();
        } catch(error) {
            reject(error);
        }
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('created users table');
};