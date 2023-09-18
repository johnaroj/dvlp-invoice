import asyncHandler from "express-async-handler";
import User from "../../models/userModel";
import VerificationToken from "../../models/verifyResetTokenModel";
import sendEmail from "../../utils/sendEmail";

const domainUrl = process.env.DOMAIN_URL;

// $-title Send password reset email link
// $-path POST /api/v1/auth/reset_password_request
// $-auth Public

const resetPasswordRequest = asyncHandler(async (req, res) => {
    const {email} = req.body;

    if(!email){
        res.status(400);
        throw new Error('An Email must be provided');
    }

    const existingUser = await User.findOne({email}).select('-passwordConfirm');

    if(!existingUser){
        res.status(400);
        throw new Error('That email is not associated with your account.');
    }

    let verificationToken=await VerificationToken.findOne({_userId: existingUser._id});

    if(verificationToken){
        await verificationToken.deleteOne();
    }

    const resetToken = (await import('crypto')).randomBytes(32).toString('hex');

    let newVerificationToken = await new VerificationToken({
        _userId: existingUser._id,
        token: resetToken,
        createdAt: Date.now()
    }).save();

    if(existingUser && existingUser.isEmailVerified){
        const emailLink = `${domainUrl}/auth/reset_password?emailToken=${newVerificationToken.token}&userId=${existingUser._id}`;

        const payload ={
            name: existingUser.firstName,
            link: emailLink
        }

        await sendEmail(existingUser.email, 'Password Reset Request', payload, './emails/template/requestResetPassword.handlebars');
    }
        res.status(200).json({
            success:true,
            message:`Hey ${existingUser.firstName}, an email has been send to your account, please reset your password within 15 minutes`
        })

    });


    // $-title Reset user password
    // $-path POST /api/v1/auth/reset_password  
    // $-auth Public

    const resetPassword = asyncHandler(async (req, res) => {
        const {password, passwordConfirm, userId, emailToken} = req.body;

        if(!password){
            res.status(400);
            throw new Error('Password is required');
        }

        if(!passwordConfirm){
            res.status(400);
            throw new Error('Confirm password is required');
        }   

        if(password !== passwordConfirm){
            res.status(400);
            throw new Error('Passwords do not match');
        }

        if(password.length < 8){
            res.status(400);
            throw new Error('Password must be at least 8 characters');
        }   

        const passwordResetToken = await VerificationToken.findOne({_userId:userId});
        if(!passwordResetToken){
            res.status(400);
            throw new Error('Invalid token! Token may have expired');
        }

        const user = await User.findOne({_id: passwordResetToken._userId}).select('-passwordConfirm');
        if(user && passwordResetToken){
            user.password = password;

            await user.save();
            const payload ={
                name: user.firstName,
            }

            await sendEmail(user.email, 'Password Reset Confirmation', payload, './emails/template/resetPassword.handlebars');

            res.status(200).json({
                success:true,
                message:`Hey ${user.firstName}, your password has been reset successfully, An email has been sent to your account confirming the password reset.`
            })
        }
    });

    export {
        resetPasswordRequest,
        resetPassword
    }
