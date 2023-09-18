import asyncHanlder from 'express-async-handler';
import User from '../../models/userModel';
import { Request, Response } from 'express';


// $-title Get user profile
// $-path GET /api/v1/users/profile
// $-auth Private

const getUserProfile = asyncHanlder(async (req:any, res:Response) => {
    const userId = req.user._id 

    const userProfile = await User.findById(userId,{
        refreshToken:0,
        roles:0,
        _id:0,
    }).lean();

    if(!userProfile){
        res.status(204);
        throw new Error('User Profile not found');
    }

    res.status(200).json({
        success:true,
        userProfile
    })

})

export default getUserProfile;