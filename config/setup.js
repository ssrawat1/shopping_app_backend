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
            pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
            description: "Please provide a valid email address"
          },
          password: {
            bsonType: "string",
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+=\-{}\[\]:;"'<>,.\/\\|`~])[A-Za-z\d@$!%*?&#^()_+=\-{}\[\]:;"'<>,.\/\\|`~]{8,}$/,
            description: "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character"
          }
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