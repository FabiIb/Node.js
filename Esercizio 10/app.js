// Import necessary modules
const express = require('express');
require('dotenv').config();
const morgan = require('morgan');

// Create an Express application
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to log client requests using morgan
app.use(morgan('dev'));

// Dummy database with initial data
let planets = [
  {
    id: 1,
    name: 'Earth',
  },
  {
    id: 2,
    name: 'Mars',
  },
];

// Define a route to get all planets
app.get('/planets', (req, res) => {
  res.json(planets);
});

// Start the Express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
