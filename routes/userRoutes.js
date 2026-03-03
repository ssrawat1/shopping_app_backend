import express from "express";
import { handleLogin, handleLogout, handleProfile, handleRegister } from "../controllers/userControllers.js"
import rateLimiter from "../utils/rateLimiter.js";
const userRoutes = express.Router();

/* Rate Limiter:  */
const limiter = rateLimiter({
  window: 15 * 60 * 1000,
  limit: 7,
  message: "Too Many Request"
})


/* User Routes */
userRoutes.post("/register", limiter, handleRegister)
userRoutes.post("/login", limiter, handleLogin)
userRoutes.get("/profile", handleProfile)
userRoutes.post("/logout", handleLogout);

export default userRoutes