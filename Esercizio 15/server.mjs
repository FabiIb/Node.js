import express from "express";
import "dotenv/config";
import morgan from "morgan";
import multer from "multer"
import {
  deleteById,
  getAll,
  getOneById,
  post,
  patchById,
  db,
  login,
  logout
} from "./controller.mjs";
import autorizzazione from "./autorizzazioni.mjs";
import "./passport.mjs"
const port = process.env.port;
const host = process.env.host;
const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/users/:id", getOneById);
app.get("/users", getAll);
app.post("/login",login)
app.post("/users", post);
app.get("/logout",autorizzazione,logout)
app.patch("/users/:id", patchById);

app.delete("/users/:id", deleteById);


app.listen(port, () => console.log(`the server running to ${host}`));
