import express from "express";
import { handleLogin, handleLogout, handleProfile, handleRegister } from "../controllers/userControllers.js"
const userRoutes = express.Router();

/* User Routes */
userRoutes.post("/register", handleRegister)
userRoutes.post("/login", handleLogin)
userRoutes.get("/profile", handleProfile)
userRoutes.post("/logout", handleLogout);

export default userRoutes