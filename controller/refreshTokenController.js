import { publicKey, privateKey } from '../config/keyPair.js';
import prismaClient from '../config/prismaConfig.js';
import Jwt from 'jsonwebtoken';

const refreshTokenPOSTController = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies || !(cookies.jwt)) {
        return res.status(401).json({ 'success': false, 'message': 'No refresh tokens exist, login to get one' })
    }
    const oldRefreshToken = cookies.jwt;
    // clear the oldRefreshToken from the browser cookies
    // res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    // console.log(oldRefreshToken);
    try {
        const foundOldRefreshTokenData = await prismaClient.refreshTokens.findUnique({
            where: {
                refreshToken: oldRefreshToken,
            },
        })

        console.log(foundOldRefreshTokenData);

        // refresh token reuse detected --> if old token is not present in database
        if (!foundOldRefreshTokenData) {
            Jwt.verify(
                oldRefreshToken,
                publicKey,
                { algorithms: ['RS256'] },
                async (err, decodedData) => {
                    if (err) {
                        // forbidden request
                        return res.status(403).json({ 'success': false, 'message': 'JWT expired, but reused!!!' });
                    }
                    // forbidden request, but token not expired --> make the user safe
                    // by removing all refresh tokens
                    console.log('attempted refresh token reuse!')
                    const compromisedUser = await prismaClient.users.findUnique({
                        where: {
                            email: decodedData.email,
                        }
                    })
                    if (compromisedUser) {
                        const compromiseRespose = await prismaClient.refreshTokens.deleteMany({
                            where: {
                                rtMappedUserId: compromisedUser.userId
                            }
                        })
                        console.log(compromiseRespose);
                    }
                    return res.status(403).json({ 'success': false, 'message': 'JWT did not expire, but reused (user compromised)!!!' });
                }
            )
        } else {
            // remove the existing oldRefreshToken from database
            await prismaClient.refreshTokens.delete({
                where: {
                    refreshToken: oldRefreshToken,
                }
            })
            Jwt.verify(
                oldRefreshToken,
                publicKey,
                { algorithms: ['RS256'] },
                async (err, decodedData) => {
                    const foundUserWithOldRefreshToken = await prismaClient.users.findUnique({
                        where: {
                            userId: foundOldRefreshTokenData.rtMappedUserId
                        },
                    })
                    // console.log('foundUserWithOldRefreshToken: ' + JSON.stringify(foundUserWithOldRefreshToken));
                    // console.log('decodedData: ' + JSON.stringify(decodedData));
                    if (err || foundUserWithOldRefreshToken.email !== decodedData.email) {
                        // unauthorized user --> jwt not expired, still in db, but, assigned
                        // to different user coincidentally
                        return res.status(403).json({ 'success': false, 'message': 'JWT did not expire, but assigned to some different user' });
                    }

                    // oldRefreshToken is still valid --> reassign new token (rotation)
                    const accessToken = Jwt.sign(
                        {
                            'email': foundUserWithOldRefreshToken.email,
                            'id': foundUserWithOldRefreshToken.userId
                        },
                        privateKey,
                        { expiresIn: '1h', algorithm: 'RS256' }
                    );
                    const newRefreshToken = Jwt.sign(
                        {
                            'email': foundUserWithOldRefreshToken.email,
                            'id': foundUserWithOldRefreshToken.userId
                        },
                        privateKey,
                        { expiresIn: '1d', algorithm: 'RS256' }
                    );

                    // Saving newRefreshToken with foundUserWithOldRefreshToken
                    const newRefreshTokenResponse = await prismaClient.refreshTokens.create({
                        data: {
                            refreshToken: newRefreshToken,
                            rtMappedUserId: foundUserWithOldRefreshToken.userId
                        }
                    })
                    console.log(newRefreshTokenResponse);

                    // Creates Secure Cookie with refresh token
                    // res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

                    return res.status(200).json({ 'success': true, 'message': 'Refreshed tokens successfully', accessToken });
                }
            )
        }
    } catch (err) {
        console.error('Error finding token: ' + err)
        return res.status(401).json({ 'success': false, 'message': 'server error in finding old token data' });; // unauthorized user
    }
}

export default refreshTokenPOSTController;