import { Schema, model } from "mongoose";

const productSchema = new Schema({
  id: {
    type: Number,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  thumbnail: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: true
  },
  brand: {
    type: String,
  },
  images: {
    type: [String]
  },
  returnPolicy: {
    type: String,
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  tags: {
    type: [String]
  },
  warrantyInformation: {
    type: String,
  },
  shippingInformation: {
    type: String
  },
  availabilityStatus: {
    type: String,
    enum: ["In Stock", "Out of Stock", "Low Stock"],
    default: "In Stock"
  },
  reviews: {
    type: [
      {
        rating: {
          type: Number
        },
        comment: {
          type: String
        },
        date: {
          type: String
        },
        reviewerName: {
          type: String
        },
        reviewerEmail: {
          type: String
        }
      }
    ]
  },
  sku: {
    type: String
  },
  dimensions: {
    type: {
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
      depth: { type: Number, min: 0 }
    }
  },
  meta: {
    type: {
      createdAt: {
        type: Date
      },
      updatedAt: {
        type: Date
      },
      barcode: {
        type: String
      },
      qrCode: {
        type: String
      }
    },

  },
  weight: {
    type: Number
  },
  minimumOrderQuantity: {
    type: Number
  }
}, { strict: "throw", timestamps: true });

export const Product = model("Product", productSchema)