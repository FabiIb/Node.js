const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const {
  getAll,
  getOneById,
  create,
  updateById,
  deleteById,
} = require('./planets'); 

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/api/planets', getAll);
app.get('/api/planets/:id', getOneById);
app.post('/api/planets', create);
app.put('/api/planets/:id', updateById);
app.delete('/api/planets/:id', deleteById);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
