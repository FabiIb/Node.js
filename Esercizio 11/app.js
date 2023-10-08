// Import necessary modules
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const planetRouter = require('./planetsRouter'); // Import your planet router

// Create an Express application
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to log client requests using morgan
app.use(morgan('dev'));

// Use the planet router
app.use(planetRouter);

// ...

// Start the Express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
