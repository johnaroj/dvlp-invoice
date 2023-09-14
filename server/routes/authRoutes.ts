import express from "express";
import { Request, Response } from "express";
import registerUser from "../controllers/auth/registerController";
import verifyUserEmail from "../controllers/auth/verifyEmailController";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify/:emailToken/:userId", verifyUserEmail);

export default router;
