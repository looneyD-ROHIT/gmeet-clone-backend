// const createError = require('http-errors');
// const cookieParser = require('cookie-parser');
import express from 'express';
import path from 'path';
import logger from 'morgan';
const PORT = 9000 || process.env.PORT;


const app = express();

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());




app.listen(PORT, ()=>{
  console.log(`SERVER IS LISTENING IN PORT ${PORT}`)
})
