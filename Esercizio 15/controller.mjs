import pgPromise from "pg-promise";
import multer from "multer";
const upload = multer();
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()
const {SECRET}= process.env

const db =pgPromise()("postgres://postgres:123456@localhost:5432/postgres")

 const setupDB=async()=>{
  db.any(`DROP TABLE IF EXISTS users;
  CREATE TABLE users (
    id SERIAL NOT NULL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    token TEXT
  )` )
  await db.none("INSERT INTO users (username, password, token) VALUES ($1, $2, $3)", ["user1", "password1", null]);
  await db.none("INSERT INTO users (username, password, token) VALUES ($1, $2, $3)", ["user2", "password2", null]);

  console.log("Tabella users creata e dati di esempio inseriti.");
}
setupDB() 

const getOneById = async(req, res) => {
  const { id } = req.params;
  const user = await db.oneOrNone(`SELECT * FROM users WHERE id=$1`,Number(id))
  res.status(200).json(user);
};

const getAll = async(req, res) => {
  const users = await db.many(`SELECT * FROM users`)
  res.status(200).json(users);
};

const post = async(req, res) => {
  const { username,password } = req.body;
  const user = await db.oneOrNone("SELECT * FROM users WHERE username=$1",username)

  try {
    if (!user) {
      const {id} = await db.one('INSERT INTO users (username,password) VALUES ($1,$2) RETURNING id',[username,password])
      res.status(201).json({ id,msg: `user added` });
    } else {
      res.status(400).json({msg:"Utente già registrato"})
    }
    
  } catch (error) {
    console.log(error);
  }
 
};

const patchById = async(req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  await db.none('UPDATE users SET password=$2 WHERE id=$1',[id,password])
  res.status(200).json({ msg: "ok" });
};



const deleteById = async(req, res) => {
  const { id } = req.params;
  await db.none(`DELETE FROM users WHERE id=$1`,Number(id))
  res.status(200).json({ msg: "ok" });
};

const login =async(req,res)=>{
  const tkn ="logged"
  try {
    const {username,password}= req.body;
    
    const user = await db.oneOrNone("SELECT * FROM users WHERE username=$1",username)
    console.log(user);
    if (!user) {
      return res.status(404).json({msg:"User not found"})
    } else {
      if(user.password===password){
        const payload={
          id:user.id,
          username
        }
        const token = jwt.sign(payload,SECRET)
        await db.none("UPDATE users SET token=$2 WHERE id=$1",[user.id,token])
        res.status(200).json({id:user.id,username,token})
      }else{
        return res.status(400).json({msg:"password sbagliata"})
      }
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({msg:"INTERNAL ERROR"})
  }
}

const logout = async(req,res)=>{
   const user = req.user
   await db.none("UPDATE users SET token=$2 WHERE id=$1",[user.id,null])
   res.status(200).json({msg:"Hai effettuato il logout"})
}

export {db,login,logout,getOneById, getAll, post, patchById, deleteById };
