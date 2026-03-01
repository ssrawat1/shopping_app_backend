import { Cart } from "../models/cartModel.js";
import { Session } from "../models/sessionModel.js";

/* Get Cart Items: */
export const handleGetCartItems = async (req, res, next) => {
  const { sid } = req.signedCookies;
  try {
    const session = sid ? await Session.findById(sid).lean().select(" userId items").populate("items.productId") : null

    if (!session) {
      return res.json({
        success: true,
        cartItems: []
      });
    }

    /* Guest Cart Items: */
    if (!session.userId) {
      console.log("Guest...")
      const cartItems = session.items.map(({ productId, quantity }) => {
        const { _id, title, price, description, category, thumbnail, rating, availabilityStatus, discountPercentage, brand } = productId;
        return { id: _id.toString(), title, price, description, category, image: thumbnail, rating, quantity, availabilityStatus, discountPercentage, brand }
      })
      return res.json({
        success: true,
        cartItems
      });
    }

    /* Authorization Cart Items: */
    console.log("authorized....")
    const userCartItems = await Cart.findOne({ userId: session.userId }).lean().select("-_id,items").populate("items.productId");
    const cartItems = userCartItems?.items?.map(({ productId, quantity }) => {
      const { _id, title, price, description, category, thumbnail, rating, availabilityStatus, discountPercentage, brand } = productId;
      return { id: _id.toString(), title, price, description, category, image: thumbnail, rating, quantity, availabilityStatus, discountPercentage, brand }
    })

    return res.json({
      success: true,
      cartItems
    });


  } catch (error) {
    console.log("Error while getting cart items:", error.message);
    next(error)
  }
}

/* Add To Cart: */
export const handleAddToCart = async (req, res, next) => {
  const { itemId } = req.params;
  const { sid } = req.signedCookies;

  try {
    const existingSession = sid ? await Session.findById(sid) : null;

    if (!existingSession) {
      return res.status(404).json({ success: false, error: "Session doesn't exist" })
    }

    /* Guest Session: */
    if (!existingSession.userId) {
      const updated = await Session.findOneAndUpdate(
        {
          _id: sid,
          "items.productId": itemId
        },
        { $inc: { "items.$.quantity": 1 } },
        { new: true, runValidators: true }
      );

      if (!updated) {
        await Session.findOneAndUpdate(
          {
            _id: sid,
            "items.productId": { $ne: itemId }
          },
          {
            $push: { items: { productId: itemId, quantity: 1 } }
          },
          { new: true, runValidators: true }

        );
      }
    } else {
      const isItemUpdated = await Cart.findOneAndUpdate({ userId: existingSession.userId, "items.productId": itemId }, { $inc: { "items.$.quantity": 1 } }, { new: true, runValidators: true });

      if (!isItemUpdated) {
        await Cart.findOneAndUpdate({ userId: existingSession.userId, "items.productId": { $ne: itemId } }, { $push: { items: { productId: itemId, quantity: 1 } } }, { new: true, runValidators: true })
      }

    }
    return res.status(200).json({ success: true, message: "Item Add To Cart Successfully" })

  } catch (error) {
    console.log("Error while adding item to cart:", error.message)
    next(error)
  }
}

/* Increase Cart Item Quantity: */
export const handleIncreaseCartItemQuantity = async (req, res, next) => {
  const { sid } = req.signedCookies;
  const { itemId } = req.params;
  console.log({ sid, itemId })
  try {
    const session = sid ? await Session.findById(sid) : null

    if (!session) {
      return res.status(401).json({ success: false, error: "Invalid or Expired session" })
    }

    if (!session.userId) {
      await Session.findOneAndUpdate({ _id: sid, "items.productId": itemId }, {
        $inc: { "items.$.quantity": 1 }
      },
        { new: true, runValidators: true });
    } else {
      await Cart.findOneAndUpdate({ userId: session.userId, "items.productId": itemId },
        {
          $inc: {
            "items.$.quantity": 1
          }
        },
        { new: true, runValidators: true })
    }

    return res.status(200).json({ success: true, message: "Cart item quantity increased by 1" })


  } catch (error) {
    console.log("Error while decreasing item quantity:", error.message);
    next(error)
  }
}

/* Decrease Cart Item Quantity: */
export const handleDecreaseCartItemQuantity = async (req, res, next) => {
  const { sid } = req.signedCookies;
  const { itemId } = req.params;

  try {
    const session = sid ? await Session.findById(sid) : null

    if (!session) {
      return res.status(401).json({ success: false, error: "Invalid or Expired session" })
    }

    if (!session.userId) {
      await Session.findOneAndUpdate(
        {
          _id: sid,
          items: {
            $elemMatch: {
              productId: itemId,
              quantity: { $gt: 1 }
            }
          }
        },
        {
          $inc: { "items.$.quantity": -1 }
        },
        {
          new: true,
          runValidators: true
        }
      ).lean();

    } else {
      await Cart.findOneAndUpdate({
        userId: session.userId,
        items: {
          $elemMatch: {
            productId: itemId,
            quantity: { $gt: 1 }
          }
        }
      },
        {
          $inc: { "items.$.quantity": -1 }
        },
        {
          new: true,
          runValidators: true
        }
      ).lean()
    }

    return res.status(200).json({ success: true, message: "Cart item quantity decreased by 1" })

  } catch (error) {
    console.log("Error while decreasing item quantity:", error.message);
    next(error)
  }
}

/* Remove From Cart: */
export const handleRemoveCartItem = async (req, res, next) => {
  const { sid } = req.signedCookies;
  const { itemId } = req.params;
  try {
    const session = sid ? await Session.findById(sid) : null

    if (!session) {
      return res.status(401).json({ success: false, error: "Invalid or Expired session" })
    }
    if (!session.userId) {
      const existingSession = await Session.findByIdAndUpdate(sid, { $pull: { items: { productId: itemId } } }, { new: true, runValidators: true })
    } else {
      await Cart.findOneAndUpdate({ userId: session.userId }, { $pull: { items: { productId: itemId } } }, { new: true, runValidators: true })
    }

    return res.status(200).json({ success: true, message: "Remove cart has been removed" })

  } catch (error) {
    console.log("Error while removing cart item:", error.message);
    next(error)
  }
}

/* Remove All From Cart: */
export const handleRemoveAllCartItems = async (req, res, next) => {
  const { sid } = req.signedCookies;
  try {
    const session = sid ? await Session.findById(sid) : null

    if (!session) {
      return res.status(401).json({ success: false, error: "Invalid or Expired session" })
    }

    if (!session.userId) {
      session.items = []
      await session.save();
    } else {
      await Cart.findOneAndUpdate({ userId: session.userId }, { items: [] }, { new: true, runValidators: true })
    }

    return res.status(200).json({ success: true, message: "Remove All cart item" })
  } catch (error) {
    console.log("Error while removing all cart items from cart:", error.message);
    next(error)
  }
}