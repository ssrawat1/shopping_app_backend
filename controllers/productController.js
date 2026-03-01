import { Product } from "../models/productModel.js"
import { Session } from "../models/sessionModel.js";

/* Handle Load Products:  */
export const handleLoadProducts = async (req, res, next) => {
  const { sid } = req.signedCookies;
  try {
    const products = await Product.find({});
    if (!products.length) {
      return res.status(404).json({ success: false, error: "Products are not available" })
    }

    /* Creating Guest Session: */
    let session = sid ? await Session.exists({ _id: sid }) : null;
    console.log("session ->", session)

    if (!session) {
      const newSession = await Session.create({});
      res.cookie("sid", newSession.id, {
        httpOnly: true,
        secure: true,
        signed: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
      });
    }

    return res.status(200).json(products);

  } catch (error) {
    console.log("Error while loading products", error.message)
    next(error)
  }
}

/* Handle Product Details: */
export const handleProductDetails = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const productDetails = await Product.findById(productId).lean();
    if (!productDetails) {
      return res.status(404).json({ success: false, error: "Product Not Found" })
    };
    return res.status(200).json({ success: true, productDetails })
  } catch (error) {
    console.log("Error while handling product details request:", error.message);
    next(error)
  }
}
