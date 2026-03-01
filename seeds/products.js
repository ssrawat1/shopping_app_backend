import { Product } from "../models/productModel.js";
import products from "./product.json"  with {type: "json"};

export default async function loadProducts() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(products);
      console.log("Products loaded successfully");
    } else {
      console.log("Products already exist");
    }
  } catch (error) {
    console.log("Error while loading products:", error.message);
  }
}


