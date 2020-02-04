const express = require('express');
const cors = require('cors');
const apis = require('./api');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());	// For not blocking CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//use sessions for tracking logins
app.use(session({
  secret: 'archimydes assignment',
  resave: false,
  saveUninitialized: true
}));

//fire controller
apis(app);

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Yo dawgs, you are listening to port ${port}`));
