const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const apiRoutes = require('./routes/api.js');
const userRoutes = require('./routes/user.js');
const app = express();

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));

// /api/endpoints
const apiRouter = express.Router();
apiRoutes(apiRouter);
app.use('/api', apiRouter);

// /user/endpoints
const userRouter = express.Router();
userRoutes(userRouter);
app.use('/users', userRouter);

app.get("/test", (req, res) => {
  res.send("🤗");
});

const port = process.env.PORT || 3000;
app.listen(port, (err) => console.log(err || `listening on port ${port} 😎`));