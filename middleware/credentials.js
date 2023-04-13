import allowedOrigins from '../config/allowedOrigins.js';

const credentials = (req, res, next) => {
    if (allowedOrigins.includes(req.headers.origin)) {
        // allowings the Access Control Allow Credentials --> to expose response data to
        // frontend js
        console.log(req.headers.origin);
        res.header('Access-Control-Allow-Credentials', true);
        // res.header('Access-Control-Allow-Origin', 'https://admin.socket.io');

    }
    next();
}

export default credentials;