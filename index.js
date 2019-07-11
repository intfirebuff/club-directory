'use strict';
require('dotenv').config();
const PORT = process.env.PORT || 8080;
const ENV = process.env.NODE_ENV || 'development';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const knexConfig  = require('./knexfile');
const knex = require('knex')(knexConfig[ENV]);
const morgan = require('morgan');
const knexLogger = require('knex-logger');
const cors = require('cors');
const cookieSession = require('cookie-session');
const flash = require('express-flash');

app.use(express.static('public'));
app.use(cors());
app.use(morgan('dev'));
app.use(knexLogger(knex));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(flash());
app.use(cookieSession({
  name: 'session',
  keys: ['key 1'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

const DataHelpers = require('./lib/data-helpers.js')(knex);
const apiRoutes = require('./routes/index');
const userRoutes = require('./routes/users');
app.use('/api', apiRoutes(DataHelpers));
app.use('/users', userRoutes(DataHelpers));

app.get('/', (req, res) => {
  let vars = {
    user: req.session.user
  };
  return res.render('index', vars);
});

app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
});