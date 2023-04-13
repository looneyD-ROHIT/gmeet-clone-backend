import allowedOrigins from './allowedOrigins.js';

const corsOptions = {
    origin: (origin, done) => {
        console.log(origin);
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            console.log('cors:' + origin);
            done(null, true);
        } else {
            done(new Error('Not allowed due to CORS...'));
        }
    },
    optionsSuccessStatus: 200
}

export default corsOptions;