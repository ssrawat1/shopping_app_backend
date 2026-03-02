import { OTP } from "../models/otpModel.js";
import sanitizeUserInput from "../sanitizer/sanitizeData.js";
import sentOtp from "../services/sendOtp.js"
import { validateSendOtpSchema, validateVerifyOtpSchema } from "../validators/validate.js";

/* Handle Send Otp Route: */
export const handleSendOtp = async (req, res, next) => {
  const data = req.body
  try {
    const sanitizedData = sanitizeUserInput(data)
    console.log(sanitizedData)
    const validatedEmail = validateVerifyOtpSchema(sanitizedData);
    console.log(validatedEmail)
    if (!validatedEmail.success) {
      return res.status(400).json()
    }
    const otpResult = await sentOtp({ email: validatedEmail.data.email });
    console.log("otpResult:", otpResult)
    if (!otpResult.success) {
      return res.status(404).json(otpResult)
    }
    return res.status(200).json(otpResult)
  } catch (error) {
    console.log("Error while getting otp request:", error.message)
    next(error)
  }
}

/* Handle Verify Otp Route: */
export const handleVerifyOtp = async (req, res, next) => {
  const { userOtp: otp, email } = req.body
  try {
    const sanitizedData = sanitizeUserInput({ otp, email })
    console.log(sanitizedData)
    const validatedOtp = validateSendOtpSchema(sanitizedData);
    if (!validatedOtp.success) {
      return res.status(400).json(validatedOtp)
    }
    const { data } = validatedOtp
    const isValidOtp = await OTP.findOneAndDelete({ email: data.email, otp: data.otp });
    if (!isValidOtp) {
      return res.status(400).json({ success: false, error: "Invalid Or Expired OTP" })
    }
    return res.status(200).json({ success: true, message: "otp verified" })

  } catch (error) {
    console.log("Error while verifying the otp:", error.message)
    next(error)
  }
}

