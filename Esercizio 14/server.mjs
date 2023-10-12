import express from "express";
import "dotenv/config";
import morgan from "morgan";
import multer from "multer";

import {
  deleteById,
  getAll,
  getOneById,
  post,
  putById,
} from "./controller.mjs";

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });


app.use(express.json());
app.use(morgan("dev"));

app.get("/planets/:id", getOneById);
app.get("/planets", getAll);

app.post("/planets", post);

app.put("/planets/:id", putById);

app.delete("/planets/:id", deleteById);

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Nessun file caricato' });
  }

  res.status(200).json({ message: 'File caricato con successo' });
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
