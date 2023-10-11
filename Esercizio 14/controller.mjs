import pgPromise from "pg-promise";
import multer from "multer";
import express from "express";

const db =pgPromise()("postgres://postgres:123456@localhost:5432")
const app = express();
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



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
   
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });
app.post('/planets/:id/image', upload.single('planetImage'), async (req, res) => {
    const planetId = req.params.id;
    const imagePath = req.file ? req.file.path : null; 
    try {
      if (!imagePath) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
    
      await db.none('UPDATE planets SET image=$2 WHERE id=$1;', [planetId, imagePath]);
  
      res.json({ message: 'Image uploaded successfully' });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


export { getOneById, getAll, create, updateById, deleteById };