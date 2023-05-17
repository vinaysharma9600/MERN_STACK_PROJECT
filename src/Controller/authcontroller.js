const express = require("express");

const authRouter = express.Router();

const userModel = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const catchAsyncErrors = require("../../Middleware/catchAsyncErrors");
const ErrorHandler = require("../../Utils/Errorhandler");
const sendToken = require("../../Utils/jwttoken");
const sendEmail=require("../../Utils/sendEmail");
const crypto=require('crypto');
const cloudinary = require("cloudinary");



// Sign up user 
module.exports.signup = catchAsyncErrors(async (req, res) =>{
        
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder:"profileImages",
            width: 150,
            crop:"scale",
          
           
        })
        
    
        let {name,email,password} = req.body;
        let user = await userModel.create({
            name,
            email,
            password,
            profileImage:{
                Public_id:myCloud.public_id,
                url:myCloud.secure_url
            }
        })
        
        if (user) {
            sendToken(user,200,res);
        }
        else {
            res.json({
                message: "Error while signup"
            })
        }
   
    
})

// login  user   check login function if got some error
module.exports.login = catchAsyncErrors(async (req,res,next)=>{
    const {email,password}=req.body;
    // checking if user has given password and email both
    if(!email||!password){
        return next(new ErrorHandler("please Enter Email and password ",400));
    }
    const user=await userModel.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }
    const isPasswordMatched=await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",404));
    }
    sendToken(user,200,res); 

})


// Authrization
module.exports.isAuthorised  = (...roles)=>{
    return (req, res, next)=> {
        
        if (!roles.includes(req.user.role)) {
           return next(
               new ErrorHandler(`Role :${req.user.role}is not allowed to access this resource`,403)
           );
        }
        next();
        
    }
}

// ProtectRoute
module.exports.protectRoute = catchAsyncErrors(async (req, res, next)=>{
        
        let Token
        if (req.cookies.token) {
            Token = req.cookies.token;
            let payload = jwt.verify(Token, process.env.JWT_KEY);
            if (payload) {
                req.user = await userModel.findById(payload.id);
                
 
                next();
            }

            else {
                return res.json({

                    message: 'please login again'

                });
            }

        }
        else {
           return next(new ErrorHandler("Please login to access resource",401));
        }
}
    )
    


// Forget password
module.exports.forgetpassword=async function forgetpassword(req,res,next){
    let{email} =req.body;
    try{
        const user=await userModel.findOne({email:email});
        if(user){
            // create Reset token is used to create a new token
            const resetToken = user.createResetToken();
            // http://abc.com/resetpassword/resetToken
            await user.save({validateBeforeSave:false});
            let resetPasswordLink = `${req.protocol}://${req.get("host")}/password/resetpassword/${resetToken}`;
            // Send email to the user
            // nodemailer ---Send email via nodemailer
            const message=`Your reset password Token is :- \n\n ${resetPasswordLink} \n\n If you have not requested this email then please ignore it.`;
            try{
                await sendEmail({
                    email:user.email,
                    subject:"BeingHelpful Password Recovery",
                    message,
                });
                res.status(200).json({
                    success:true,
                    message:`Email send to ${user.email} succcessfully `
                })
            }catch(error){
                user.resetToken=undefined;
                user.resetTokenExpire=undefined;
                await user.save({validateBeforeSave:false});
                return next(new ErrorHandler(error.message,500));
            }
        }
        else{
            return next(new ErrorHandler("User not found",404));
        }
    }
    catch(err){
        res.status(500).json({
            message:err.message
        });
    }
}


// Reset password
module.exports.resetpassword= async function resetpassword(req,res,next){
    try{
        const token = req.params.token;
        const resetToken=crypto.createHash("sha256").update(token).digest("hex");
        let {password,confirmPassword}=req.body;
        const user =await userModel.findOne({
            resetToken,
            resetTokenExpire:{$gt:Date.now()},
            
        });
        if(user){
            // reset passwordhandler will update user in database
            if(password!=confirmPassword){
                return next(new ErrorHandler("password does not match",400));
            }
            user.password=password;
            user.confirmPassword=confirmPassword;
            user.resetToken=undefined;
            user.resetTokenExpire=undefined;
            await user.save();
            sendToken(user,200,res);
        }
        else{
           return next(new ErrorHandler("Reset Password Token is invalid or has been expired",404))
        }
    }catch(err){
        res.json({
            message:err.message
        });
    }
}  


// logout function
module.exports.logout=function logout(req,res){
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    });
    res.json({
        message:"user logout successfully"
    });
}

// Get user details
module.exports.getUserDetails=catchAsyncErrors(async(req,res,next)=>{
    const user=await userModel.findById(req.user.id);
    


    res.status(200).json({
        success:true,
        user,
    })
})

// Update user password
module.exports.updatePassword=catchAsyncErrors(async(req,res,next)=>{
    
    const user=await userModel.findById(req.user.id).select("+password");
    const isPasswordMatched=await user.comparePassword(req.body.oldPassword);

    

    if(!isPasswordMatched){
        return next(new ErrorHandler("old password ",401));
    }
 


    if(req.body.newPassword!=req.body.confirmPassword){
        return next(new ErrorHandler("password does not match",400));
    }
    user.password=req.body.newPassword;
    user.confirmPassword=req.body.confirmPassword;
    await user.save()

    sendToken(user,200,res);
})

// Update user profile
module.exports.updateProfile=catchAsyncErrors(async(req,res,next)=>{
    const newUserData={
        email:req.body.email,
        name:req.body.name,
    };
    
    //Add cloudinary
    if(req.body.avatar !==""){
        const user = await userModel.findById(req.user.id);
        

        const imageId = user.profileImage.url;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "profileImages",
        width: 150,
        crop: "scale",
        });

        newUserData.profileImage = {
        Public_id: myCloud.Public_id,
        url: myCloud.secure_url,
        };
    }
    
    const user =await userModel.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        // runValidators:true, i am commenting this but may be it can produce a new bug in my website
        userFindAndModify:false
    });
    
    res.status(200).json({
        success:true,
        message:" successfully changed"
    })
})


// get All user --admin
module.exports.getallUser=catchAsyncErrors(async (req,res,next)=>{
    const users=await userModel.find();
    res.status(200).json({
        success:true,
        users,
    })
})

// get user single user detail --admin
module.exports.getSingleUser=catchAsyncErrors(async (req,res,next)=>{

    
    const user=await userModel.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User does not exist with id ${req.params.id}`))
    }
    res.status(200).json({
        success:true,
        user,
    })
})


// Admin update user role
module.exports.updateuserRole=catchAsyncErrors(async(req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }
    const user =await userModel.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        // runValidators:true,
        userFindAndModify:false,
    });
    res.status(200).json({
        success:true,
        message:" successfully changed"
    })
})

// Admin delete the user
module.exports.deleteuserProfile=catchAsyncErrors(async(req,res,next)=>{
    const user=await userModel.findById(req.params.id)
    // we will remove cloudinary
    if(!user){
        return next(new ErrorHandler(`user does not exist with id ${rq.params.id}`));
    }
    await user.remove();
    res.status(200).json({
        success:true,
        message:" successfully deleted"
    })
})

// 