import pgPromise from "pg-promise";

const db =pgPromise()("postgres://postgres:123456@localhost:5432")

const setupDB=async()=>{
await db.none(`DROP TABLE IF EXISTS planets;
               CREATE TABLE planets (
                  id SERIAL NOT NULL PRIMARY KEY,
                  name TEXT NOT NULL
);`)
await db.none(`INSERT INTO planets (name) VALUES ('Earth')`)
await db.none(`INSERT INTO planets (name) VALUES ('Mars')`)
await db.none(`INSERT INTO planets (name) VALUES ('Venus')`)

}
setupDB()
let planets = [
  {
    id: 1,
    name: 'Earth',
  },
  {
    id: 2,
    name: 'Mars',
  },
  {
    id: 2,
    name: 'Venus',
  },
];

const getOneById = async(req, res) => {
  const planetId = parseInt(req.params.id);
  const planet = planets.find((p) => p.id === planetId);

  if (!planet) {
    return res.status(404).json({ error: 'Planet not found' });
  }
  res.json(planet);
};

const getAll = async(req, res) => {
  res.json(planets);
};

const updateById = async(req, res) => {
  const { name } = req.body;
  await db.none('INSERT INTO planets (name) VALUES ($1)',name)
  res.status(201).json({ msg: "obj added" });
};

const create = async(req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  await db.none('UPDATE planets SET name=$2 WHERE id=$1',[id,name])
  res.status(200).json({ msg: "ok" });
};



const deleteById = async(req, res) => {
  const { id } = req.params;
  await db.none(`DELETE FROM planets WHERE id=$1`,Number(id))
  res.status(200).json({ msg: "ok" });
};



export { getOneById, getAll, create, updateById, deleteById };