import mongoose from "mongoose";

/**
 * Stores the admin password hash (only one document ever exists)
 */
const AdminConfigSchema = new mongoose.Schema(
  {
    key: { type: String, default: "admin", unique: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.AdminConfig ||
  mongoose.model("AdminConfig", AdminConfigSchema);

