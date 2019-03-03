exports.seed = function(knex, Promise) {
  return knex('clubs').del()
    .then(function () {
      return knex('clubs').insert([
        {id: 1, name: 'Test Club 1', region: 1, address_1: 'Attn: Joe Blow', address_2: '123 Congress St', city: 'Boston', state_code: 'MA', zip: '12345', country: 'United States', website: 'testclub1.com', email: 'noreply@ifba.org', facebook_url: 'testclub1', twitter_handle: 'testclub1', instagram_handle: 'testclub1', is_physical_address: true, canteen: true, active: 1},
        {id: 2, name: 'Test Club 2', region: 1, address_2: '123 Fake St', city: 'Medford', state_code: 'MA', zip: '67890', country: 'United States', website: 'testclub2.org', facebook_url: 'testclub2', twitter_handle: 'testclub2', instagram_handle: 'testclub2', is_physical_address: true, canteen: true, active: 1},
        {id: 3, name: 'Test Club 3', region: 1, city: 'Portland', state_code: 'ME', country: 'United States', is_physical_address: false, canteen: false, active: 1}
      ]);
    });
};