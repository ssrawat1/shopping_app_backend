import mongoose from "mongoose";

/* DB connection URL */
const CONNECTION_URL = 'mongodb://sanjay:vicktoria@localhost:27017/shopeeApp?replicaSet=myReplicaSet&authSource=admin';


/* Making connection with MongoDB server */
export async function connectDb() {
  try {
    await mongoose.connect(CONNECTION_URL);
    console.log("connected with mongodb server successfully")
  } catch (error) {
    console.log("Error while connecting with mongodb", error.message);
    process.exit(1)
  }
};


/* Handle client disconnection gracefully: */
process.on("SIGINT", async () => {
  console.log("Client Disconnected Gracefully")
  await mongoose.disconnect();
  process.exit(0)
})