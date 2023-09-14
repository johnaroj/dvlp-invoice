"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registerController_js_1 = __importDefault(require("../controllers/auth/registerController.js"));
const verifyEmailController_js_1 = __importDefault(require("../controllers/auth/verifyEmailController.js"));
const router = express_1.default.Router();
router.post("/register", registerController_js_1.default);
router.get("/verify/:emailToken/:userId", verifyEmailController_js_1.default);
exports.default = router;
