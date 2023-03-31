// const createError = require('http-errors');
// const cookieParser = require('cookie-parser');
import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import verifyJWT from './middleware/verifyJWT.js';
import corsOptions from './config/corsOptions.js';
import credentials from './middleware/credentials.js';
import login from './routes/login.js';
import register from './routes/register.js';
import fallback from './routes/fallback.js';
import refresh from './routes/refresh.js';
import main from './routes/main.js';
import logout from './routes/logout.js';
import ping from './routes/ping.js';
import errorHandler from './middleware/errorHandler.js'


const app = express();

// middleware to prevent browser caching always
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

// middleware for logging purposes
app.use(logger('tiny'));

// middleware for Access Control Allow Origin, to be called before cors
app.use(credentials);

// middleware to allow cors only to specific whitelisted origins based on options
app.use(cors(corsOptions));

// middleware to handle incoming json payload
app.use(express.json());

// middleware to handle incoming url encoded form data
app.use(express.urlencoded({ extended: false }));

// middleware to handle cookies being sent and received
app.use(cookieParser());

// public routes
app.use('/login', login);
app.use('/register', register);

// refresh token route, hidden route
app.use('/refresh', refresh);


// protected routes
app.use('/app', verifyJWT, main);

app.use('/logout', verifyJWT, logout);

// hidden route requiring authentication --> to check user login status when idle
app.use('/ping', verifyJWT, ping);

// fallback route
app.all('*', fallback);

// middleware to handle errors
app.use(errorHandler);

const PORT = 9000 || process.env.PORT;

app.listen(PORT, () => {
  console.log(`SERVER IS LISTENING IN PORT ${PORT}`)
})
