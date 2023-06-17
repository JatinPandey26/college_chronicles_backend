import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
 {
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  profession: { type: String, required: true },
  myBlogs: [{ type: String }],
  likedBlogs: [{ type: String }],
  isAdmin: { type: Boolean, default: false },
  avatar: {
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

UserSchema.pre("save", async function (next) {
 if (!this.isModified("password")) return next(); // password not changed dont hash or you will hash the hashed password
 const hashedPassword = await bcrypt.hash(this.password, 10);
 this.password = hashedPassword;
 next();
});

UserSchema.methods.getJWTToken = function () {
 return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
  expiresIn: "15d",
 });
};

UserSchema.methods.comparePassword = async function (password) {
 return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", UserSchema);
