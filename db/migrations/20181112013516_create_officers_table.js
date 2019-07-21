exports.up = function(knex, Promise) {
    return new Promise(async (resolve, reject) => {
        try {
            await Promise.all([
                knex.schema.createTable('officers', table => {
                    table.increments();
                    table.string('name').notNullable();
                    table.string('position').nullable();
                    table.string('address_1').nullable();
                    table.string('address_2').nullable();
                    table.string('city').nullable();
                    table.string('state_code').nullable();
                    table.string('zip').nullable();
                    table.string('email_1').nullable();
                    table.string('email_2').nullable();
                    table.string('email_3').nullable();
                    table.string('phone_1').nullable();
                    table.string('phone_2').nullable();
                    table.string('facebook_url').nullable();
                    table.timestamp('created_at').defaultTo(knex.fn.now());
                })
            ]);
            console.log('created officers table');
            resolve();
        } catch(error) {
            reject(error);
        }
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('dropped officers table');
};