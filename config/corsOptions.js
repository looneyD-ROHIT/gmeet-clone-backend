import allowedOrigins from './allowedOrigins.js';

const corsOptions = {
    origin: (origin, done) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            done(null, true)
        } else {
            done(new Error('Not allowed due to CORS...'));
        }
    },
    optionsSuccessStatus: 200
}

export default corsOptions;