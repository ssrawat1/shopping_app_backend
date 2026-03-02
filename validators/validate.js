import { z } from "zod";

const schema = z.strictObject({
  name: z.string("invalid name type").min(2, "Must be two character long"),
  email: z.email("invalid email type"),
  password: z.string("invalid password type").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "Password must contain uppercase, lowercase, number, special character and be at least 8 characters long"
  ),
  otp: z.string("Invalid Otp").length(6, "Invalid Otp")
});

function getValidatedData(result) {
  if (result.success) {
    return result
  }
  const errorObj = {}
  result.error.issues.forEach(({ path, message }) => {
    errorObj[path.toString() || "unrecognizedKey"] = message
  });
  return { success: false, ...errorObj }
}

/* validating Register Schema */
export function validateRegisterSchema(userData) {
  const registerSchema = schema.omit({ otp: true })
  const result = registerSchema.safeParse(userData);
  return getValidatedData(result)
}

/* Validating Login Schema: */
export function validateLoginSchema(userData) {
  console.log(userData)
  const loginSchema = schema.pick({ email: true, password: true });
  const result = loginSchema.safeParse(userData)
  return getValidatedData(result)
}

/* Validate Otp Data: */
export function validateVerifyOtpSchema(userData) {
  const mailSchema = schema.pick({ email: true })
  const result = mailSchema.safeParse(userData)
  return getValidatedData(result)
}

/* Validate User Otp: */
export function validateSendOtpSchema(userData) {
  console.log(userData)
  const otpSchema = schema.pick({ otp: true, email: true });
  const result = otpSchema.safeParse(userData);
  return getValidatedData(result)
}


