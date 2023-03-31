import prismaClient from '../config/prismaConfig.js';

export const logoutPOSTController = async (req, res) => {
    // On client, also delete the accessToken
    const cookies = req.cookies;
    if (!cookies || !(cookies.jwt)) {
        console.log('No refresh tokens exist, login to get one');
        return res.status(511).json({ 'success': false, 'message': 'No refresh tokens exist, login to get one' })
    }

    try {
        res.clearCookie('jwt', { httpOnly: true, secure: true });
        // Check refreshToken existence in DB, if not present just logout, else clear from DB
        const foundUser = await prismaClient.refreshTokens.findUnique({
            where: {
                refreshToken: `${cookies.jwt}`
            }
        })
        console.log('LogoutController: ' + JSON.stringify(foundUser));
        if (!foundUser) {
            return res.status(505).json({ 'success': true, 'message': 'Logged Out, successfully' });
        } else {
            await prismaClient.refreshTokens.delete({
                where: {
                    refreshToken: `${cookies.jwt}`
                }
            })
            return res.status(505).json({ 'success': true, 'message': 'Logged Out, successfully' });
        }
    } catch (err) {
        console.log('Err in logoutController: ' + err);
        return res.status(505).json({ 'success': false, 'message': 'Internal server error' })
    }
}

