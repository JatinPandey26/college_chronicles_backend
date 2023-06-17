import express from "express";
import {
 changeUserRole,
 deleteUser,
 getAllUsers,
 getMyProfileController,
 getUserById,
 loginContoller,
 logoutController,
 registerContoller,
} from "../Controllers/user.controller.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(singleUpload, registerContoller);
router.route("/login").post(singleUpload, loginContoller);
router.route("/me").get(isAuthenticated, getMyProfileController);
router.route("/logout").get(logoutController); 
router.route("/getUserById/:id").get(getUserById);
router 
 .route("/admin/getAllUsers")
 .get(isAuthenticated, authorizeAdmin, getAllUsers);
router
 .route("/admin/changeUserRole")
 .get(isAuthenticated, authorizeAdmin, changeUserRole);
router
 .route("/admin/deleteUser")
 .delete(isAuthenticated, authorizeAdmin, deleteUser);

export { router as userRouter };
