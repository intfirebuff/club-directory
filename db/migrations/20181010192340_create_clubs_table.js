exports.up = function(knex, Promise) {
    return new Promise(async (resolve, reject) => {
        try {
            await Promise.all([
                knex.schema.createTable('clubs', table => {
                    table.increments();
                    table.string('name').notNullable();
                    table.integer('region').unsigned().notNullable();
                    table.string('address_1').nullable();
                    table.string('address_2').nullable();
                    table.string('city').nullable();
                    table.string('state_code').nullable();
                    table.string('zip').nullable();
                    table.string('country').notNullable().defaultTo(false);
                    table.boolean('is_physical_address').notNullable().defaultTo(false);
                    table.boolean('canteen').notNullable().defaultTo(false);
                    table.string('website').nullable();
                    table.string('email').nullable();
                    table.string('facebook_url').nullable();
                    table.string('twitter_handle').nullable();
                    table.string('instagram_handle').nullable();
                    table.string('coordinates').nullable();
                    table.string('remarks').nullable();
                    table.integer('active').notNullable().defaultTo(1);
                    table.timestamp('created_at').defaultTo(knex.fn.now());
                })
            ]);
            console.log('clubs table created successfully');
            resolve();
        } catch(error) {
            reject(error);
        }
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('clubs');
};