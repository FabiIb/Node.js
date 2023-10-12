import dotenv from "dotenv";
dotenv.config()
const {SECRET}= process.env
import passport from "passport";
import passportJWT from "passport-jwt"
import { db } from "./controller.mjs";

passport.use(
    new passportJWT.Strategy({
        secretOrKey:SECRET,
        jwtFromRequest:passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    },async(payload,done)=>{
        const user = await db.one("SELECT * FROM users WHERE id=$1",payload.id)
        console.log(user);

        try {
            return user ? done(null,user): done(new Error("User not Found"))
        } catch (error) {
            done(error)
        }
    })
)
  