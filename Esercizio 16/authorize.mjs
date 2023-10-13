import passport from "passport";
import { Strategy } from "passport-strategy";
import { ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
dotenv.config()

console.log("Loaded environment variables:");
console.log("SECRET:", process.env.SECRET);

const opts = {
  secretOrKey: process.env.SECRET,
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
