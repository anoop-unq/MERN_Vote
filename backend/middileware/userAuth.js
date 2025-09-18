// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';

// dotenv.config();

// export const userAuthMiddleware = async (req, res, next) => {
//   console.log("Request Cookies:", req.cookies); 
//   const  token = req.cookies.token;
//   console.log("token",token)
//   if (!token) {
//     return res.json({
//       success: false,
//       message: "Not authorized. Please log in again.",
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.SECRET_KEY);

    
//     // Attach user ID to the request for future use
//     req.userId = decoded.id;

//     next(); // Proceed to the next middleware/controller
//   } catch (error) {
//     console.error("JWT verification failed:", error.message);
//     return res.json({
//       success: false,
//       message: "Invalid or expired token. Please log in again.",
//     });
//   }
// };



import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import userModel from '../models/user.js';
dotenv.config();

export const userAuthMiddleware = async (req, res, next) => {
  console.log("Request Cookies:", req.cookies); 
  const token = req.cookies.token;
  console.log("token", token);
  
  if (!token) {
    return res.json({
      success: false,
      message: "Not authorized. Please log in again.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    
    // Get the full user object from database
    const user = await userModel.findById(decoded.id).select('-password');
    console.log(user,"Middleware")
    if (!user) {
      return res.json({
        success: false,
        message: "User not found. Please log in again.",
      });
    }
    
    // Attach full user object to the request
    req.user = user;
    req.userId = decoded.id;
    console.log(decoded.id)
    console.log(user._id.toString())
    next(); // Proceed to the next middleware/controller
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};