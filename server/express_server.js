const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');

const port = process.env.PORT || 3000;
const app = express();

const apisRouter = require('./routes/apiRoutes');
const usersRouter = require('./routes/userRoutes');

const pool = require('./database/connection');
const dbApis = require('./database/apis')(pool);
const dbUsers = require('./database/users')(pool);

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));

app.use('/api', apisRouter(dbApis));
app.use('/users', usersRouter(dbUsers));

app.listen(port, (err) => console.log(err || `listening on port ${port} 😎`));