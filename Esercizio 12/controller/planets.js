

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

exports.getAll = (req, res) => {
  res.json(planets);
};

exports.getOneById = (req, res) => {
  const planetId = parseInt(req.params.id);
  const planet = planets.find((p) => p.id === planetId);

  if (!planet) {
    return res.status(404).json({ error: 'Planet not found' });
  }

  res.json(planet);
};

exports.create = (req, res) => {
  const { id, name } = req.body;
  const newPlanet = { id, name };

  planets.push(newPlanet);
  res.status(201).json({ msg: 'Planet created successfully' });
};

exports.updateById = (req, res) => {
  const planetId = parseInt(req.params.id);
  const { name } = req.body;

  const updatedPlanets = planets.map((planet) =>
    planet.id === planetId ? { ...planet, name } : planet
  );

  planets = updatedPlanets;
  res.json({ msg: 'Planet updated successfully' });
};

exports.deleteById = (req, res) => {
  const planetId = parseInt(req.params.id);
  const updatedPlanets = planets.filter((planet) => planet.id !== planetId);

  if (updatedPlanets.length === planets.length) {
    return res.status(404).json({ error: 'Planet not found' });
  }

  planets = updatedPlanets;
  res.json({ msg: 'Planet deleted successfully' });
};
