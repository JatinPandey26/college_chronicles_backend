import jwt from "jsonwebtoken";
import { User } from "../Model/user.model.js";
export const isAuthenticated = async (req, res, next) => {
try {
  const { token } = req.cookies;
  if (!token) return res.send("Not logged in").status(401);
 
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decode._id);
} catch (error) {
  console.log(error);
}
 next();
};

export const authorizeAdmin = (req, res, next) => {
 if (!req.user.isAdmin)
  return res
   .json({
    success: false,
    message: `you are not authorized to access this content`,
   })
   .status(403);
 
 next(); // to next middleware
};
