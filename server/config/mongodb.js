import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ MONGODB_URI environment variable is not defined.");
    console.error("Please set MONGODB_URI in your .env file.");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:");
    if (error.message && error.message.includes("Could not connect to any servers")) {
      console.error(
        "👉 Note: This usually happens if your IP address is not whitelisted in MongoDB Atlas.\n" +
        "   Go to https://cloud.mongodb.com -> Network Access -> Add IP Address -> Allow Access from Anywhere (0.0.0.0/0)."
      );
    } else {
      console.error(error.message || error);
    }
    process.exit(1);
  }
}