import express from "express";
import { handleAddToCart, handleDecreaseCartItemQuantity, handleGetCartItems, handleIncreaseCartItemQuantity, handleRemoveAllCartItems, handleRemoveCartItem } from "../controllers/cartController.js";
import validateItemId from "../middlewares/validateId.js";
 
const cartRoutes = express.Router();

/* ID validator: */
cartRoutes.param("itemId", validateItemId)

/* Get Cart Items: */
cartRoutes.get("/items", handleGetCartItems)

/* Add To Cart Route */
cartRoutes.post("/items/:itemId", handleAddToCart);

/* Increase Quantity Route */
cartRoutes.patch("/items/:itemId/increase", handleIncreaseCartItemQuantity);

/* Decrease Quantity Route */
cartRoutes.patch("/items/:itemId/decrease", handleDecreaseCartItemQuantity);

/* Remove From Cart Route */
cartRoutes.delete("/items/:itemId", handleRemoveCartItem);

/* Clear Cart Route */
cartRoutes.delete("/items", handleRemoveAllCartItems);


export default cartRoutes
