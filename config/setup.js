import mongoose from "mongoose";
import { connectDb } from "./db.js";

await connectDb()
const client = mongoose.connection.getClient();
const db = mongoose.connection.db;
const command = "collMod"
const dbSchema = [
  {
    [command]: "users",
    validator: {
      $jsonSchema: {
        required: ["_id", "name", "email", "password"],
        bsonType: "object",
        properties: {
          _id: {
            bsonType: "objectId"
          },
          name: {
            bsonType: "string",
            description: "should be 2 character long",
            minLength: 2
          },
          email: {
            bsonType: "string",
            pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
            description: "Please provide a valid email address"
          },
          password: {
            bsonType: "string",
            pattern: '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$',
            description: "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character"
          },
          createdAt: { bsonType: 'date' },
          updatedAt: { bsonType: 'date' },
          __v: {
            bsonType: 'int',
          },
        },
        additionalProperties: false, // ensure only the filed in the schema are allowed
      }
    },
    validationAction: "error", // if validation failed then decide the operation should succeed or not
    validationLevel: "strict"// decide when validation should apply to the document while insertion and updation
  }
];


try {
  await Promise.all(dbSchema.map(schema => db.command(schema)))
} catch (error) {
  console.log("Error while creating setting up db schema:", error.message)
} finally {
  await client.close()
}