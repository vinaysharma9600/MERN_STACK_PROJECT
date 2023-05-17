const mongoose=require('mongoose');
const emailValidator=require('email-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env=require('dotenv');
const cloudinary = require("cloudinary");
env.config();

const crypto=require('crypto');
const { hashSync } = require('bcrypt');
mongoose.connect(process.env.db_link)
.then(function(db){
    // console.log(db);
    console.log('db connected');
})
.catch(function(err){
    console.log(err);
})

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const userSchema=mongoose.Schema({
    name:{
        type: String,
        required:[true,"please Enter your Name"],
        maxlength:[20,"Name cannot exceed 20 character"],
        minLength:[4,"Name should have more than 4 character"]
    },
    
    email:{
        type:String,
        required:[true, "Enter your email"],
        unique:true,
        validate:function(){
            return emailValidator.validate(this.email);
        }
        
    },
    password:{
        type:String,
        required:true,
        minLength:[8,"Enter your password"],
        select:false,
    },
    // confirm password is redundaant data we don't wanna to save this so we are using hooks 
  
   role:{
       type:String,
       enum:['admin','user'],
       default:'user'
   },
   createdAt:{
    type:Date,
    default:Date.now,
   },
   profileImage:{

        Public_id:{
            type:String,
            // required:true
        },
        url:{
            type:String,
            required:true
        }
   },
   resetToken:String,
   resetTokenExpire:Date,
})

userSchema.pre('save',async function(){
    this.confirmPassword=undefined
});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password= await bcrypt.hash(this.password,10);
})
// JWT Token
userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_KEY,{
        expiresIn:process.env.JWT_EXPIRE,
    })
}

// Compare password
userSchema.methods.comparePassword=async function(enteredpassword){
    return await bcrypt.compare(enteredpassword,this.password);
}


userSchema.methods.createResetToken=function(){
    //creating unique token using npm i  Crypto 
    const resetToken=crypto.randomBytes(32).toString("hex");
    // hashing and to userschema
    this.resetToken=crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetTokenExpire=Date.now()+15*16*1000;
    return resetToken;
}




const userModel=mongoose.model('userModel',userSchema);

module.exports=userModel;
