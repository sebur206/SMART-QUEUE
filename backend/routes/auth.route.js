import express from "express";
import {
    StaffLogin,
    logoutUser,
    updateUserPassword,
    sendPasswordResetOTP,
    verifyPasswordResetOTP,
    resetUserPassword
} from "../controller/auth.controller.js";
import { authenticateUser } from "../middleware/userAuth.js";

const router = express.Router();

router.post("/staff/login", StaffLogin);
router.post("/logout", logoutUser);
router.post("/update", authenticateUser, updateUserPassword);
router.post("/forgot", sendPasswordResetOTP);
router.post("/verify", verifyPasswordResetOTP);
router.post("/reset", resetUserPassword);

export default router;