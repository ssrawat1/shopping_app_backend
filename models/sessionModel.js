import { Schema, model } from "mongoose";

const sessionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  items: {
    type: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
      }
    }],
    default: []
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    index: { expires: 0 }
  }
}, { strict: "throw", timestamps: true });

export const Session = model("Session", sessionSchema)
