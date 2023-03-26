import prismaClient from '../config/prismaConfig.js';
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';

export const loginGETController = (req, res) => {
    res.status(200).send(`<h1>Login Page...</h1>`)
}

export const loginPOSTController = async (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    /**
     * TODO 
     * Apply more validation to email and password field, either on frontend or backend.
     */
    if (!email || !password) {
        res.status(400);
        return res.json({ 'success': false, 'message': 'email and password both are required!' });
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
        console.log('foundUser: ' + JSON.stringify(foundUser));
        const foundPassword = foundUser.password.toString();

        const match = bcrypt.compare(password, foundPassword);

        if (match) {
            // generate JWTs --> access tokens and refresh tokens
            const accessToken = Jwt.sign(
                {
                    'email': foundUser.email,
                    'id': foundUser.userId
                },
                'secret',
                { expiresIn: '1h' }
            );
            const refreshToken = Jwt.sign(
                {
                    'email': foundUser.email,
                    'id': foundUser.userId
                },
                'secret',
                { expiresIn: '1d' }
            );

            // Saving refreshToken with found user
            const updatedUser = await prismaClient.users.update({
                where: { userId: foundUser.userId },
                data: { refreshToken: Buffer.from(refreshToken) }
            });
            console.log('updatedUser: ' + JSON.stringify(updatedUser));

            // Creates Secure Cookie with refresh token
            // res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

            // Send authorization roles and access token to user
            return res.status(200).json({ 'success': true, 'message': 'logged in successfully', accessToken });
        } else {
            return res.status(401).json({ 'success': false, 'message': 'wrong password entered' });; // unauthorized user
        }

        // if user found match the entered password
    } catch (err) {
        console.error('Error finding user: ' + err)
        return res.status(401).json({ 'success': false, 'message': 'server error in logging in' });; // unauthorized user
    }
}