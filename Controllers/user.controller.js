import cloudinary from "cloudinary";
import mongoose from "mongoose";
import { User } from "../Model/user.model.js";
import { getDataUri } from "../utils/getDataUri.js";
import { sendToken } from "../utils/sendToken.js";

export const registerContoller = async (req, res, next) => {
 const { username, email, password, profession } = req.body;
 const file = req.file;
 if (!username || !email || !password || !profession || !file) {
  return res
   .json({
    success: false,
    message: "Please enter all fields",
   })
   .status(400);
 }
 let user = await User.findOne({ email });

 if (user)
  return res
   .json({
    success: false,
    message: "User with same email already exists",
   })
   .status(409); // 409 conflict in request

 // upload to cloudinary

 const fileUri = getDataUri(file);

 const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);
 user = await User.create({
  username,
  email,
  password,
  profession,
  avatar: {
   public_id: myCloud.public_id,
   url: myCloud.secure_url,
  },
 });

 sendToken(res, user, "Registered Successfully", 201);
};

export const loginContoller = async (req, res, next) => {
 const { email, password } = req.body;

 if (!email || !password)
  return res
   .json({ success: false, message: "Please enter all fields" })
   .status(400);

 const user = await User.findOne({ email }).select("+password"); // as by default we restricted to get password in model but for login purpose we accessing that

 if (!user)
  return res
   .json({ success: false, message: "Incorrect email or password" })
   .status(401); // 401 not found

 const isMatch = await user.comparePassword(password);

 if (!isMatch)
  return res
   .json({ success: false, message: "Incorrect email or password" })
   .status(401); // 401 not found
 console.log(user);
 sendToken(
  res,
  user,
  "Login Successfully , welcome back " + user.username,
  200
 );
};

export const logoutController = async (req, res, next) => {
 res.status(200).cookie("token", null).json({
  success: true,
  message: "logout Successfully",
 });
};

export const getUserById = async (req, res, next) => {
 const id = req.params.id
 ;

 if(id === undefined){ return res.status(404).json({ success: false, message: "Invalid id" });}
 if (!id)
  return res.status(404).json({ success: false, message: "Invalid id" });
 try {
  const user = await User.findById(new mongoose.Types.ObjectId(id));
  if (!user)
   return res
    .status(404)
    .json({ success: false, message: `User with id = ${id} not found` });

  res.status(200).json({
   success: true,
   user,
  });
 } catch (error) {
  console.log(error);
 }
};

export const getMyProfileController = async (req, res, next) => {
 if (!req.user)
  return res.status(401).json({ success: false, message: "user not found" });
 const user = await User.findById(req?.user?._id);
 if (!user) return res.status(404).send("user not found");
 res.status(200).json({
  success: true,
  user,
 });
};

export const getAllUsers = async (req, res, next) => {
 const users = await User.find().select("-password");
 return res.status(200).json({ success: true, message: users });
};

export const changeUserRole = async (req, res, next) => {
 try {
  const { userId } = req.query;
  if (!userId)
   return res
    .status(401)
    .json({ success: false, message: "user id is not valid or missing" });
  const user = await User.findById(userId);
  if (!user)
   return res.status(404).json({ success: false, message: "user not found" });
  await User.findByIdAndUpdate(userId, { isAdmin: !user.isAdmin });
  return res
   .status(200)
   .json({ success: true, message: "user role updated successfully" });
 } catch (error) {
  return res
   .status(401)
   .json({ success: false, message: "something went wrong" });
 }
};

export const deleteUser = async (req, res, next) => {
 try {
  const { userId } = req.query;
  if (!userId)
   return res
    .status(401)
    .json({ success: false, message: "user id is not valid or missing" });
  const user = await User.findById(userId);
  if (!user)
   return res.status(404).json({ success: false, message: "user not found" });
  await User.findByIdAndDelete(userId);
  return res
   .status(200)
   .json({ success: true, message: "user deleted successfully" });
 } catch (error) {
  return res
   .status(401)
   .json({ success: false, message: "something went wrong" });
 }
};
