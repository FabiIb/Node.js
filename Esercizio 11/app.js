
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const planetRouter = require('./planetsRouter'); 


const app = express();


app.use(express.json());

app.use(morgan('dev'));


app.use(planetRouter);


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
