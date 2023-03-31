import Jwt from 'jsonwebtoken';
import { publicKey } from '../config/keyPair.js';

const verifyJWT = (req, res, next) => {
    console.log('verifying jwt authorization headers...')
    const authHeader = req.headers.authorization || req.headers.Authorization;
    console.log(authHeader);
    // if authHeader does not exist return 401 unauthorized error
    if (!authHeader || !(authHeader.startsWith('Bearer '))) {
        // unauthorized to access resource (not authenticated, need valid credentials)
        return res.status(401).json({ 'success': false, 'message': 'Unauthorized' });
    } else {
        const token = authHeader.split(' ')[1];
        // asynchronous version --> callback specified
        Jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
            if (err) {
                // forbidden access to resource (authenticated, but not enough permissions)
                console.log('verifyJWTErr: ' + err);
                return res.status(403).json({ 'success': false, 'message': 'Forbidden' }); // invalid token
            } else {
                // check if refresh tokens exist or not
                if(!(req?.cookies?.jwt)) return res.status(505).json({'success': false, 'message': 'Client Error, Jwt removed!!!'});
                req.id = decoded.id;
                req.email = decoded.email;
                // console.log(decoded);
                next();
            }
        }
        );
    }
}

export default verifyJWT;