const express = require('express');
const Joi = require('joi');

const router = express.Router();

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


const planetSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
});


router.get('/api/planets', (req, res) => {
  res.json(planets);
});


router.get('/api/planets/:id', (req, res) => {
  const planetId = parseInt(req.params.id);
  const planet = planets.find((p) => p.id === planetId);

  if (!planet) {
    return res.status(404).json({ error: 'Planet not found' });
  }

  res.json(planet);
});


router.post('/api/planets', (req, res) => {
  const { id, name } = req.body;

  const { error } = planetSchema.validate({ id, name });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  planets.push({ id, name });
  res.status(201).json({ msg: 'Planet created successfully' });
});


router.put('/api/planets/:id', (req, res) => {
  const planetId = parseInt(req.params.id);
  const { name } = req.body;

  const planet = planets.find((p) => p.id === planetId);

  if (!planet) {
    return res.status(404).json({ error: 'Planet not found' });
  }

  const { error } = planetSchema.validate({ id: planetId, name });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  planet.name = name;
  res.json({ msg: 'Planet updated successfully' });
});


router.delete('/api/planets/:id', (req, res) => {
  const planetId = parseInt(req.params.id);
  const planetIndex = planets.findIndex((p) => p.id === planetId);

  if (planetIndex === -1) {
    return res.status(404).json({ error: 'Planet not found' });
  }

  planets.splice(planetIndex, 1);
  res.json({ msg: 'Planet deleted successfully' });
});

module.exports = router;
