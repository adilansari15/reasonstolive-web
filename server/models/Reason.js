import mongoose from "mongoose";

const ReasonSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Reason text is required"],
      trim: true,
      minlength: [3, "Reason text must be at least 3 characters long"],
    },
    category: {
      type: String,
      default: "Simple Pleasures",
      trim: true,
    },
    author: {
      type: String,
      default: "Anonymous",
      trim: true,
    },
    likes: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast retrieval and sorting
ReasonSchema.index({ likes: -1 });
ReasonSchema.index({ category: 1 });
ReasonSchema.index({ createdAt: -1 });
ReasonSchema.index({ text: "text", category: "text", author: "text" });

export default mongoose.models.Reason || mongoose.model("Reason", ReasonSchema);