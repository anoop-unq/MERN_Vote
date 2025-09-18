import express from 'express'
import {  changeUserData, getUserById, login, logout, register, resetOtp, resetPassword, searchUsers, sendOtp, updateProfile, updateProfilePhoto, userAuthenticate, verifyEmail, verifyOtp } from '../controllers/userController.js'
import {  userAuthMiddleware } from '../middileware/userAuth.js'
import { handleMulterErrorsImage, uploadImage } from '../middlewares/imageUploader.js'
const route = express.Router()

route.post("/register",uploadImage.single('photo'),handleMulterErrorsImage, register)
route.post("/login",login)
route.post("/logout",logout)
route.post("/verify-otp",userAuthMiddleware,sendOtp)
route.post("/verify-email",userAuthMiddleware,verifyEmail)
route.get("/user-auth",userAuthenticate)
route.post("/user-reset-otp",resetOtp)
route.post("/user-verify-otp", verifyOtp);
route.post("/user-reset-password",resetPassword)
route.put("/user/:userId",userAuthMiddleware,changeUserData)
route.put('/users/edit/:userId',userAuthMiddleware,updateProfile)
route.put("/users/edit/:userId/photo",userAuthMiddleware,uploadImage.single('photo'),handleMulterErrorsImage,updateProfilePhoto)
route.get("/user-details/:userId",getUserById)

export default route;