import express from "express";
import {
 approveBlogById,
 createBlog,
 deleteBlogById,
 getAllBlogs,
 getAllUnApprovedBlogs,
 getBlogById,
 getMyBlogs,
 likeBlog
} from "../Controllers/blog.controller.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

router.route("/create").post(isAuthenticated, singleUpload, createBlog);
router.route("/").get(getAllBlogs);
router.route("/getAllUnApprovedBlogs").get(getAllUnApprovedBlogs);
router.route('/getMyBlogs').get(isAuthenticated,getMyBlogs)
router
 .route("/:id")
 .get(getBlogById)
 .delete(isAuthenticated, authorizeAdmin, deleteBlogById)
 .put(isAuthenticated, authorizeAdmin, approveBlogById);

 router.route('/likeBlog/:id').put(isAuthenticated,likeBlog)


export { router as BlogRouter };
