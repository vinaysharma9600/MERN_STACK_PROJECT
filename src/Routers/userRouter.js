const express = require("express");
const userRouter=express.Router();
const {signup,login,isAuthorised,protectRoute,forgetpassword,resetpassword,logout, getUserDetails, updatePassword, updateProfile, getallUser, getSingleUser, updateuserRole, deleteuserProfile}=require('../Controller/authcontroller');


userRouter
.route('/signup')
.post(signup)


userRouter
.route('/login')
.post(login)

userRouter
.route('/forgetpassword')
.post(forgetpassword)


userRouter
.route('/resetpassword/:token')
.put(resetpassword)

userRouter
.route('/logout')
.get(logout)

userRouter
.route("/me")
.get(protectRoute,getUserDetails)

userRouter
.route("/password/update")
.put(protectRoute,updatePassword)

userRouter
.route("/me/update")
.put(protectRoute,updateProfile)

userRouter
.route("/admin/users")
.get(protectRoute,isAuthorised("admin"),getallUser)

userRouter
.route("/admin/users/:id")
.get(protectRoute,isAuthorised("admin"),getSingleUser)
.put(protectRoute,isAuthorised("admin"),updateuserRole)
.delete(protectRoute,isAuthorised("admin"),deleteuserProfile)








module.exports=userRouter;
