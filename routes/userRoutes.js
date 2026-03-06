import express from "express";
import { handleLogin, handleLogout, handleProfile, handleRegister } from "../controllers/userControllers.js"
import rateLimiter from "../utils/rateLimiter.js";
import { slowDown } from "../utils/throttle.js";

const userRoutes = express.Router();

/* Rate Limiter:  */
const limiter = rateLimiter({
  window: 15 * 60 * 1000,
  limit: 7,
  message: "Too Many Request"
})

const throttle = slowDown({
  waitTime: 2000,
  delayAfter: 1
})

/* User Routes */
userRoutes.post("/register", limiter, throttle, handleRegister)
userRoutes.post("/login", limiter, throttle, handleLogin)
userRoutes.get("/profile", handleProfile)
userRoutes.post("/logout", handleLogout);

export default userRoutes