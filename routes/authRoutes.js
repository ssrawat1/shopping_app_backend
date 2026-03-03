import express from "express";
const authRoutes = express.Router();

import { handleSendOtp, handleVerifyOtp } from "../controllers/authController.js";
import rateLimiter from "../utils/rateLimiter.js";

/* Rate Limiter:  */
const limiter = rateLimiter({
  window: 15 * 60 * 1000,
  limit: 7,
  message: "Too Many Request"
})

/* User Otp Routes: */
authRoutes.post("/send-otp", limiter, handleSendOtp);
authRoutes.post("/verify-otp", handleVerifyOtp)

export default authRoutes