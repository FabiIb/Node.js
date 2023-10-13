import { db } from "./db.mjs";

async function getUserByUsername(username) {
  return db.oneOrNone('SELECT * FROM users WHERE username = $1', username);
}

async function createUser(username, password) {
  return db.none('INSERT INTO users(username, password) VALUES($1, $2)', [username, password]);
}

export{ getUserByUsername, createUser };

