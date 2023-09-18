import express from "express";
import registerUser from "../controllers/auth/registerController";
import verifyUserEmail from "../controllers/auth/verifyEmailController";
import { loginLimiter } from "../middleware/apiLimiter";
import loginUser from "../controllers/auth/loginController";
import newAccesToken from "../controllers/auth/refreshTokenController";
import resendEmailVerificationToken from "../controllers/auth/resenVerifyEmailController";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify/:emailToken/:userId", verifyUserEmail);
router.post("/login", loginLimiter, loginUser);
router.get("/new_access_token", newAccesToken);
router.post("/resend_email_token", resendEmailVerificationToken);
export default router;
