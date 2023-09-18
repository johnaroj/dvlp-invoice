import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../../models/userModel';
import { CookieOptions, Request, Response } from 'express';

// $-title Get new access token from the refresh token
// $-path POST /api/v1/auth/new_access_token
// $-auth public,
// we are rotating the refresh token, deleting the old one and creating a new one

const newAccesToken = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if(!cookies.jwt) {
        res.sendStatus(401);
    }

    const refreshToken = cookies.jwt;

    const options: CookieOptions = {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: 'none'
    };
    res.clearCookie('jwt', options);

    const existingUser = await User.findOne({refreshToken}).exec();
    console.log('existingUser', existingUser)
    console.log(existingUser);
    if(!existingUser) {
        jwt.verify(
            refreshToken, 
            process.env.JWT_REFRESH_SECRET_KEY, 
            async (err:any, decoded:any) => {
                if(err) {
                    return res.sendStatus(403);
                }
                const hackedUser = await User.findOne({_id: decoded.id}).exec();
                hackedUser.refreshToken = [];
                await hackedUser.save();
            }
        ); 
           
        return res.sendStatus(403);    
    }

    const newRefreshTokenArray = existingUser.refreshToken.filter((token: any) => token !== refreshToken);
    jwt.verify(refreshToken, 
        process.env.JWT_REFRESH_SECRET_KEY, 
        async (err, decoded) => {
            if(err) {
                existingUser.refreshToken =[...newRefreshTokenArray];
                await existingUser.save();
            }
            if(err || existingUser._id.toString() !== decoded.id) {
                return res.sendStatus(403);
            }
            const accessToken = jwt.sign(
                {
                id: existingUser._id,
                roles: existingUser.roles,
            }
            , process.env.JWT_ACCESS_SECRET_KEY as string, {expiresIn: '1h'}
            );

            const newRefreshToken = jwt.sign({
                id: existingUser._id,
            },
                process.env.JWT_REFRESH_SECRET_KEY as string,
                {expiresIn: '1d'}
            )

            existingUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            await existingUser.save();

            const options = {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                secure: true,
                sameSite: 'none'
            } as CookieOptions;

            res.cookie('jwt', newRefreshToken, options);

            res.json({
                success: true,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                username: existingUser.username,
                provider: existingUser.provider,
                avatar: existingUser.avatar,
                accessToken,
            })
    })
}

export default newAccesToken;