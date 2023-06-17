import cloudinary from "cloudinary";
import { Blog } from "../Model/blog.model.js";
import { getDataUri } from "../utils/getDataUri.js";
export const getAllBlogs = async (req, res, next) => {
 const { sortBy, category, search } = req.query;
 const query = {};
 if (category) {
  query.category = category;
 }
 if (search) {
  // Use a regular expression to perform a case-insensitive search
  query.title = new RegExp(search, "i");
 }
 // get approved blogs only
 query.isApproved = true;
 const blogs = await Blog.find(query).sort({ [sortBy]: -1 });

 res.status(200).json({
  success: true,
  blogs,
 });
};

export const getAllUnApprovedBlogs = async (req, res, next) => {
 const blogs = await Blog.find({ isApproved: false });

 res.status(200).json({
  success: true,
  blogs,
 });
};

export const getBlogById = async (req, res, next) => {
 const { id } = req.params;

 if (!id)
  return res.status(404).json({ success: false, message: "Invalid id" });

 const blog = await Blog.findById({ _id: id, isApproved: true });
 if (!blog)
  return res.status(404).json({
   success: false,
   message: `Blog with id = ${id} not found or not approved`,
  });

 res.status(200).json({
  success: true,
  blog,
 });
};
export const getMyBlogs = async (req, res, next) => {
 try {
  const myBlogs = await Blog.find({ author: req.user._id });
  res.status(200).json({
   success: true,
   myBlogs,
  });
 } catch (error) {
  console.log(error);
 }
};

export const likeBlog = async (req, res, next) => {
 try {
  const id = req.params.id;
  if (!id)
   return res.status(400).json({ success: false, message: "invalid id" });
  const blog = await Blog.findById(id);
  const userId = req.user._id;
  let likedBy = blog.likedBy;
  let likes = blog.likes;
  if (likedBy?.includes(userId)) {
   likedBy = likedBy.filter((id) => id.toString() !== userId.toString());
   likes--;
  } else {
   likedBy = [...likedBy, userId];
   likes++;
  }

  await Blog.findByIdAndUpdate(id, { likedBy, likes });
  res.status(200).json({
   success: true,
   message: "Blog updated",
  });
 } catch (error) {
  console.log(error);
 }
};

export const approveBlogById = async (req, res, next) => {
 const { id } = req.params;
 if (!id)
  return res.status(404).json({ success: false, message: "Invalid id" });

 const blog = await Blog.findById(id);
 if (!blog)
  return res.status(404).json({
   success: false,
   message: `Blog with id = ${id} not found`,
  });

 await Blog.findByIdAndUpdate(id, { isApproved: true });
 res.status(200).json({
  success: true,
  message: "Blog with id = ${id} is published",
 });
};
export const deleteBlogById = async (req, res, next) => {
 const { id } = req.params;
 if (!id)
  return res.status(404).json({ success: false, message: "Invalid id" });

 const blog = await Blog.findById(id);
 if (!blog)
  return res.status(404).json({
   success: false,
   message: `Blog with id = ${id} not found`,
  });
 await Blog.findByIdAndDelete(id);
 res.status(200).json({
  success: true,
  message: `Blog with id = ${id} deleted successfully`,
 });
};
export const createBlog = async (req, res, next) => {
 const { title, shortDescription, category, description } = req.body;
 const file = req.file;
 if (!title || !shortDescription || !description || !file) {
  return res
   .status(401)
   .json({ success: false, message: "Please provide all fields" });
 }
 try {
  const fileUri = getDataUri(file);
  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);

  let blog = await Blog.create({
   title,
   shortDescription,
   category,
   description,
   author: req?.user?._id,
   cover_image: {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
   },
  });
  res.status(201).json({
   success: true,
   message: "Blog created successfully",
  });
 } catch (error) {
  console.log(error);
  return res.status(500).json({ success: false, message: "error.message" });
 }
};
