import { Schema, model } from "mongoose";
import argon2 from "argon2"

/* User Schema */
const userSchema = new Schema({
  name: {
    type: String,
    minLength: 2,
    required: [true, "name is required"],
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    match: [
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      "Please provide a valid email address"
    ],
    required: [true, "email is required"],
    lowercase: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+=\-{}\[\]:;"'<>,.\/\\|`~])[A-Za-z\d@$!%*?&#^()_+=\-{}\[\]:;"'<>,.\/\\|`~]{8,}$/,
      "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character"
    ],
    required: [true, "password is required"],
    trim: true
  }
}, { strict: "throw", timestamps: true })


/* Password Hashing while registration */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return
  this.password = await argon2.hash(this.password)
})

/* Password compare while login: */
userSchema.methods.verifyPassword = async function (userPassword) {
  console.log("comparing password:", this);
  return await argon2.verify(this.password, userPassword)
}


/* User Model (Collection) */
export const User = model("User", userSchema)