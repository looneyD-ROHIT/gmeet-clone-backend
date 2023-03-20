import passport from "passport";
import bcrypt from "bcrypt"
import { LocalStrategy } from 'passport-local';
import PrismaClient from '../config/prismaConfig'

const saltround = 12


const verify = (username, password, cb) => {
    db.get('SELECT * FROM users WHERE username = ?', [ username ], function(err, row) {
        if (err) { return cb(err); }
        if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }

        // crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
        // if (err) { return cb(err); }
        // if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
        //     return cb(null, false, { message: 'Incorrect username or password.' });
        // }
        // return cb(null, row);
        // });
        bcrypt.compare(password, row.password, function(err, result) {
            // result == true
            if(err) console.log(err)
            if(result == true){
                return cb(null,row)
            }
            else{
                return cb(null, false, { message: 'Incorrect username or password.' })
            }
        });
    });
}

const strategy = new LocalStrategy()