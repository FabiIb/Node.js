import express from "express";
import "dotenv/config";
import morgan from "morgan";
import pgPromise from "pg-promise";

const db =pgPromise()("postgres://postgres:123456@localhost:5432/postgres")
const setupDB=async()=>{
await db.none(`DROP TABLE IF EXISTS planets;
CREATE TABLE planets (
   id SERIAL NOT NULL PRIMARY KEY,
   name TEXT NOT NULL,
  image TEXT
)`)
await db.none(`INSERT INTO planets (name) VALUES ('Earth')`)
await db.none(`INSERT INTO planets (name) VALUES ('Mars')`)
await db.none(`INSERT INTO planets (name) VALUES ('Venus')`)

}
setupDB();
const app = express();
app.use(express.json());
app.use(morgan('dev'));


app.get('/', (req, res) => {
  res.status(200).send('Welcome to the Planet API');
});
app.get('/planets', async (req, res) => {
  try {
    const planets = await db.many('SELECT * FROM planets');
    res.status(200).json(planets);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});  

const getOneById = async(req, res) => {
  const { id } = req.params;
  const pianeta = await db.oneOrNone(`SELECT * FROM planets WHERE id=$1`,Number(id))
  res.status(200).json(pianeta);
};

const getAll = async(req, res) => {
  const pianeti = await db.many(`SELECT * FROM planets`)
  res.status(200).json(pianeti);
};

const post = async(req, res) => {
  const { name } = req.body;
  await db.none('INSERT INTO planets (name) VALUES ($1)',name)
  res.status(201).json({ msg: "Add" });
};

const putById = async(req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  await db.none('UPDATE planets SET name=$2 WHERE id=$1',[id,name])
  res.status(200).json({ msg: "Good" });
};



const deleteById = async(req, res) => {
  const { id } = req.params;
  await db.none(`DELETE FROM planets WHERE id=$1`,Number(id))
  res.status(200).json({ msg: "removed successfully" });
};

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


export { getOneById, getAll, post, putById, deleteById };