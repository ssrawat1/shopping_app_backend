import { Cart } from "../models/cartModel.js";
import { Session } from "../models/sessionModel.js";
import { User } from "../models/userModel.js";
import sanitizeUserInput from "../sanitizer/sanitizeData.js";
import { validateLoginSchema, validateRegisterSchema } from "../validators/validate.js";

/* Handle User Register request and response */
export const handleRegister = async (req, res, next) => {
  const userData = req.body;
  try {
    /* Sanitizing User Data: */
    const sanitizedData = sanitizeUserInput(userData);
    /* Validating User Data using Zod: */
    const validatedData = validateRegisterSchema(sanitizedData)
    console.log({ validatedData })
    if (!validatedData.success) {
      return res.status(400).json(validatedData)
    }
    const { data } = validatedData
    const createStatus = await User.create(data);
    console.log(createStatus)
    res.status(200).json({ message: "User Registered Successfully" })
  } catch (error) {
    console.log("Error while registering the user:", error.message);
    next(error)
  }
}

/* Handle User Login request and response */
export const handleLogin = async (req, res, next) => {
  const data = req.body
  const { sid } = req.signedCookies
  try {
    const sanitizedData = sanitizeUserInput(data)
    const validatedData = validateLoginSchema(sanitizedData)
    if (!validatedData.success) {
      return res.status(400).json(validatedData)
    }
    const { email, password } = validatedData.data
    const existingUser = await User.findOne({ email }).select("_id password")

    if (!existingUser) {
      return res.status(401).json({ success: false, error: "Invalid Credentials" })
    }
    const isValidPassword = await existingUser.verifyPassword(password)
    console.log({ isValidPassword });

    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: "Invalid Credentials" })
    }

    /* Upgrade Guest Session & Authorize logged In Session :
          (1) -> Update UserId 
          (2) -> Extend Expiry Data
          (3) -> Issue the new cookie with updated time
          (4) -> Move the session items into the cart
    */

    let session = sid ? await Session.findById(sid) : null;

    if (!session) {
      session = await Session.create({});
    }

    /* Migrating items from  Guest -> Cart */

    if (!session.userId) {
      const existingCart = await Cart.findOne({ userId: existingUser._id })

      if (!existingCart) {
        await Cart.create({
          userId: existingUser._id,
          items: session.items
        })
      } else {
        session?.items?.forEach(sItem => {
          const cItem = existingCart.items.find(
            i => i.productId.toString() === sItem.productId.toString()
          )

          if (cItem) cItem.quantity += sItem.quantity
          else existingCart.items.push(sItem)
        })
        await existingCart.save()
      }
    }

    session.userId = existingUser._id;
    session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    session.items = undefined;
    await session.save();

    res.cookie("sid", session.id, {
      httpOnly: true,
      sameSite: "lax",
      signed: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
    })

    return res.status(200).json({ success: true, message: "User Login Successfully" })

  } catch (error) {
    console.log("Error while login:", error.message)
    next(error)
  }
}

/* Responsible for handling profile request */
export const handleProfile = async (req, res, next) => {
  const { sid } = req.signedCookies
  try {
    let session = sid ? await Session.findById(sid) : null;
    if (!session || !session.userId) {
      return res.status(401).json({ success: false, error: "User is not logged in" })
    }
    const user = await User.findById(session.userId).lean().select("-_id name email");

    if (!user) {
      return res.status(401).json({ success: false, error: "User doesn't exist" })
    }
    return res.status(200).json(user)
  } catch (error) {
    console.log("Error while making profile request:", error.message)
    next(error)
  }
}

/* Handle User logout request and response */
export const handleLogout = async (req, res, next) => {
  const { sid } = req.signedCookies;
  try {
    await Session.findByIdAndDelete(sid);
    return res.status(200).json({ success: true, message: "Logout user" })
  } catch (error) {
    console.log("Error while logout the user:", error.message);
    next(error)
  }
}



