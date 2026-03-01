import express from "express";
const authRoutes = express.Router();

import {handleSendOtp, handleVerifyOtp } from "../controllers/authController.js";

/* User Otp Routes: */
authRoutes.post("/send-otp", handleSendOtp);
authRoutes.post("/verify-otp", handleVerifyOtp)
 
export default authRoutes