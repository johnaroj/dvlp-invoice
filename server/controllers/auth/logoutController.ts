import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../../models/userModel';

const logoutUser = asyncHandler(async (req, res) => {
    const cookies = req.cookies;
    if(!cookies){
        res.status(204);
        throw new Error('No cookies found');
    }

    const refreshToken = cookies.jwt;

    const existingUser = await User.findOne({refreshToken});
    if(!existingUser){
        res.clearCookie("jwt",{
            httpOnly: true,
            secure:true,
            sameSite:'none'
        })

        res.sendStatus(204);
    }
    existingUser.refreshToken = existingUser.refreshToken.filter(token => token !== refreshToken);

    await existingUser.save();

    res.clearCookie("jwt",{
        httpOnly: true,
        secure:true,
        sameSite:'none'
    });

    res.status(200).json({
        success:true,
        message:`${existingUser.firstName} has been logged out`
    })

})

export default logoutUser;