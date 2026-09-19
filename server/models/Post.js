import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Post content is required"],
      trim: true,
      minlength: [5, "Content must be at least 5 characters long"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    mood: {
      type: String,
      required: [true, "Mood is required"],
      trim: true,
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    heartCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "approved",
    },
    moderationStatus: {
      type: String,
      enum: ["approved", "pending", "rejected", "flagged"],
      default: "pending",
    },
    moderationReason: {
      type: String,
      default: "",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Optimize querying and filtering with indexes
PostSchema.index({ createdAt: -1 });
PostSchema.index({ category: 1 });
PostSchema.index({ mood: 1 });
PostSchema.index({ moderationStatus: 1 });
PostSchema.index({ isApproved: 1 });
PostSchema.index({ isApproved: 1, createdAt: -1 });

// Full-text search index on content and category
PostSchema.index({ content: "text", category: "text" });

export default mongoose.models.Post || mongoose.model("Post", PostSchema);