import { model, Schema } from "mongoose";

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
    unique: true,
    required: true,
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
        default: 1,
        min: 1,
        required: true
      }
    }],
    default: []
  }
}, { strict: "throw", timestamps: true });

export const Cart = model("Cart", cartSchema)