import passport from "passport";
import bcrypt from "bcrypt";
import { LocalStrategy } from "passport-local";
import prismaClient from "../config/prismaConfig";

const verify = async (email, password, done) => {
  const user = await prismaClient.users.findFirst({
    where: {
      email: email,
    },
  });
  if (!user) {
    return done(null, false, {
      message: "Incorrect Username or user does not exist",
    });
  }

  bcrypt.compare(password, user.password, (err, result) => {
    // result == true
    if (err) console.log(err);
    if (result === true) {
        return done(null, user);
    } else {
        return done(null, false, { message: "Incorrect password." });
    }
  });
};

export const strategy = new LocalStrategy(verify);

// passport.use(strategy);
