import asyncHandler from "express-async-handler";
import User from "../../models/userModel";
import VerifyResetToken from "../../models/verifyResetTokenModel";
import sendEmail from "../../utils/sendEmail";
import { randomBytes } from "crypto";

const domainURL = process.env.DOMAIN_URL;

// $-title Resend verification email token
// $-path POST /api/v1/auth/resend_email_token
// $-auth public

const resendEmailVerificationToken = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if(!email) {
        res.status(400);
        throw new Error('An Email must be provided');
    }

    if(!user) {
        res.status(400);
        throw new Error('We were unable to find a user with that email.');
    }  
    if(user.isEmailVerified){
        res.status(400);
        throw new Error('This account is already verified. Please log in.');
    } 

    let verificationToken = await VerifyResetToken.findOne({ _userId: user._id });
    if(verificationToken) {
        await verificationToken.deleteOne();
    }
    const resentToken = (await import("crypto")).randomBytes(32).toString("hex");

    let emailToken = await new VerifyResetToken({
        _userId: user._id,
        token: resentToken
    }).save();

    const emailLink = `${domainURL}/api/v1/auth/verify/${emailToken.token}/${user._id}`;

    const payload ={
        name: user.firstName,
        link: emailLink
    }

    await sendEmail(user.email, 'Account Verification', payload, './emails/template/accountVerification.handlebars');

    res.json({
        success: true,
        message:`${user.firstName}, an email has been sent to your account, please verify within 15 minutes`

    })
})

export default resendEmailVerificationToken;