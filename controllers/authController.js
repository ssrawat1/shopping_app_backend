import { OTP } from "../models/otpModel.js";
import sentOtp from "../services/sendOtp.js"

/* Handle Send Otp Route: */
export const handleSendOtp = async (req, res, next) => {
  const { email } = req.body
  try {
    const otpResult = await sentOtp({ email });
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
  console.log({ otp, email })
  try {
    const isValidOtp = await OTP.findOneAndDelete({ email, otp });
    if (!isValidOtp) {
      return res.status(400).json({ success: false, error: "Invalid Or Expired OTP" })
    }
    return res.status(200).json({ success: true, message: "otp verified" })

  } catch (error) {
    console.log("Error while verifying the otp:", error.message)
    next(error)
  }
}

