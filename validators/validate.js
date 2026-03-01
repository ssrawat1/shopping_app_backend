import { z } from "zod";

const schema = z.strictObject({
  name: z.string("invalid name type").min(2, "Must be two character long"),
  email: z.email("invalid email type"),
  password: z.string("invalid password type").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "Password must contain uppercase, lowercase, number, special character and be at least 8 characters long"
  )
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
  const result = schema.safeParse(userData);
  return getValidatedData(result)
}

/* Validating Login Schema: */
export function validateLoginSchema(userData) {
  const loginSchema = schema.omit({ name: true });
  const result = loginSchema.safeParse(userData)
  return getValidatedData(result)
}





