import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
 {
  title: { type: String, required: true },
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  category: { type: String, required: true, default: "others" },
  author: { type: mongoose.Types.ObjectId, required: true },
  likedBy: [{ type: String }],
  isApproved: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  cover_image: {
   public_id: {
    type: String,
    required: true,
   },
   url: {
    type: String,
    required: true,
   },
  },
 },
 {
  timestamps: true,
 }
);

export const Blog = mongoose.model("Blog", BlogSchema);
