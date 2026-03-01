import express from "express";
import { handleLoadProducts, handleProductDetails } from "../controllers/productController.js";
import validateItemId from "../middlewares/validateId.js";
const productRoutes = express.Router();

/* Validating ProductId: */
productRoutes.param("productId", validateItemId)

/* User Load Product Route: */
productRoutes.get("/load", handleLoadProducts);

/* Product Detail Route: */
productRoutes.get("/:productId", handleProductDetails)

export default productRoutes