// const createError = require('http-errors');
// const cookieParser = require('cookie-parser');
import express from 'express';
import path from 'path';
import logger from 'morgan';
import register from './routes/register.js';
import passport from 'passport';
import {strategy} from './auth/passportConfig.js';
const PORT = 9000 || process.env.PORT;

import prismaClient from './config/prismaConfig.js'


const app = express();

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(session({
//   store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
//   secret:"abcd",
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//       maxAge : 1000 * 60 * 60
//   }
// }));
// app.use(passport.authenticate('session'));
app.use(passport.initialize())
// app.use(passport.session())
passport.use(strategy)
passport.serializeUser((user, done) => {
  done(null, { id: user.id });
});

passport.deserializeUser(async (user, done) => {
  try{
    const user = await prismaClient.users.findFirst({
      where: {
        userId: user.id,
      }
    });
    if(!user){
      done(null, false)
    }
    done(null,user)
  }catch(err){
    console.log('err while deserializing: ', err);
    done(err, false);
  }

});


app.use('/register', register);


app.listen(PORT, ()=>{
  console.log(`SERVER IS LISTENING IN PORT ${PORT}`)
})
