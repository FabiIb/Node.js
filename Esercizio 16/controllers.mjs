import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";
import { db } from "./db.mjs";
import { getUserByUsername, createUser } from "./userController.mjs";

const app = express();
const PORT = process.env.SERVER_PORT || 3000;
const SECRET = process.env.SECRET || "your_default_secret";

app.use(morgan("dev"));
app.use(bodyParser.json());

const jwtOptions = {
  secretOrKey: SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new Strategy(jwtOptions, async (payload, done) => {
    try {
      const user = await getUserByUsername(payload.username);
      return user ? done(null, user) : done(null, false);
    } catch (error) {
      done(error, false);
    }
  })
);

app.post("/users/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password." });
  }

  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    return res.status(400).json({ error: "Username already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await createUser(username, hashedPassword);

  res.json({ msg: "Registration successful. You can now log in." });
});

app.post("/users/login", (req, res) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({ error: "Invalid username or password." });
    }
    const token = jwt.sign({ username: user.username }, SECRET);

    res.json({ token, username: user.username });
  })(req, res);
});

app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
});
