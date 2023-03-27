import Jwt from 'jsonwebtoken';
import { publicKey } from '../config/keyPair.js';

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    // if authHeader does not exist return 401 unauthorized error
    if (!authHeader || !(authHeader.startsWith('Bearer '))) {
        return res.status(401);
    } else {
        const token = authHeader.split(' ')[1];
        // asynchronous version --> callback specified
        Jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
            if (err) {
                return res.status(403); // invalid token
            } else {
                req.id = decoded.id;
                req.email = decoded.email;
                next();
            }
        }
        );
    }
}

export default verifyJWT;