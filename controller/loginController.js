import prismaClient from '../config/prismaConfig.js';
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import { privateKey } from '../config/keyPair.js';

export const loginGETController = (req, res) => {
    res.status(200).send(`<h1>Login Page...</h1>`)
}

export const loginPOSTController = async (req, res, next) => {
    // checking for the available cookies
    const cookies = req.cookies;
    console.log(cookies)
    // console.log(`cookie available at login: ${JSON.stringify(cookies)}`);

    const email = req.body.email
    const password = req.body.password
    console.log(email)
    console.log(password)
    /**
     * TODO 
     * Apply more validation to email and password field, either on frontend or backend.
     */
    if (!email || !password) {
        return res.status(400).json({ 'success': false, 'message': 'email and password both are required!' });
    }

    try {
        const foundUser = await prismaClient.users.findUnique({
            where: {
                email: email,
            },
        })
        if (!foundUser) {
            return res.status(404).json({ 'success': false, 'message': 'user doesn\'t exist' });
        }
        // console.log('foundUser: ' + JSON.stringify(foundUser));
        const foundPassword = foundUser.password.toString();

        const match = bcrypt.compare(password, foundPassword);

        if (match) {
            // generate JWTs --> access tokens and refresh tokens
            const accessToken = Jwt.sign(
                {
                    'email': foundUser.email,
                    'id': foundUser.userId
                },
                privateKey,
                { expiresIn: '2h', algorithm: 'RS256' }
            );
            const newRefreshToken = Jwt.sign(
                {
                    'email': foundUser.email,
                    'id': foundUser.userId
                },
                privateKey,
                { expiresIn: '3d', algorithm: 'RS256' }
            );

            // console.log('newRefreshToken: ' + newRefreshToken);

            if (cookies?.jwt) {
                // if jwt exists in the cookie, then check its existence in the db
                const response = await prismaClient.refreshTokens.findUnique({
                    where: { refreshToken: cookies.jwt }
                })

                // console.log('db response to cookie.jwt: ' + JSON.stringify(response));
                // if found, then it is asking for refresh, so only remove the current token
                // for the user
                if (response) {
                    // deleting the current token
                    await prismaClient.refreshTokens.delete({
                        where: {
                            refreshToken: cookies.jwt
                        }
                    })
                }
                // else if not found, then it is compromised and reuse is detected, hence
                // empty the tokens
                else {
                    // delete all the tokens associated with current user
                    await prismaClient.refreshTokens.deleteMany({
                        where: {
                            rtMappedUserId: foundUser.userId
                        }
                    })
                    res.clearCookie('jwt', { httpOnly: true, secure: true });
                }
            }


            // before saving check device limit
            /*
            const allTokens = await prismaClient.refreshTokens.findMany({
                where: {
                    rtMappedUserId: foundUser.userId
                }
            })
            if (allTokens.length >= 5) {
                return res.status(500).json({ 'success': false, 'message': 'More than 5 user logins not allowed!!!' });
            }
            */

            // Saving newRefreshToken with found user
            const newRefreshTokenResponse = await prismaClient.refreshTokens.create({
                data: {
                    refreshToken: newRefreshToken,
                    rtMappedUserId: foundUser.userId
                }
            })
            // console.log('newRefreshTokenResponse: ' + JSON.stringify(newRefreshTokenResponse));

            // Creates Secure Cookie with refresh token
            res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 });

            // Send access token to user
            return res.status(200).json({ 'success': true, 'message': 'logged in successfully', accessToken, id: foundUser.userId });
        } else {
            return res.status(401).json({ 'success': false, 'message': 'wrong password entered' });; // unauthorized user
        }

        // if user found match the entered password
    } catch (err) {
        console.error('Error finding user: ' + err)
        return res.status(401).json({ 'success': false, 'message': 'server error in logging in' });; // unauthorized user
    }
}