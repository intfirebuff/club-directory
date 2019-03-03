let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
const expect = require('chai').expect;
let should = chai.should();

const knexConfig  = require('../knexfile');
const knex = require('knex')(knexConfig['test']); // hard-code knex env to test

chai.use(chaiHttp);

describe('API Routes', () => {

  beforeEach(() => knex.migrate.rollback()
    .then(() => knex.migrate.latest())
    .then(() => knex.seed.run())
  );

  afterEach(() => knex.migrate.rollback());

  describe('GET /api/all', () => {
    it('it should fetch an array of clubs', (done) => {
      chai.request(server)
        .get('/api/all')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.results.should.be.a('array');
          done();
        });
    });
  });

  describe('GET /api/all', () => {
    it('it should return a result with the expected columns', (done) => {
      chai.request(server)
        .get('/api/all')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.results[0].should.have.property('name');
          res.body.results[0].should.have.property('region');
          res.body.results[0].should.have.property('address_1');
          res.body.results[0].should.have.property('address_2');
          res.body.results[0].should.have.property('city');
          res.body.results[0].should.have.property('state_code');
          res.body.results[0].should.have.property('zip');
          res.body.results[0].should.have.property('country');
          res.body.results[0].should.have.property('is_physical_address');
          res.body.results[0].should.have.property('canteen');
          res.body.results[0].should.have.property('website');
          res.body.results[0].should.have.property('email');
          res.body.results[0].should.have.property('facebook_url');
          res.body.results[0].should.have.property('twitter_handle');
          res.body.results[0].should.have.property('instagram_handle');
          res.body.results[0].should.have.property('active');
          done();
        });
    });
  });
})