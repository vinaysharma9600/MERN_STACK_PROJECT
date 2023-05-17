const mongoose=require('mongoose');
const env=require('dotenv');
const cloudinary = require("cloudinary");

env.config();
mongoose.connect(process.env.db_link)
.then(function(db){
    // console.log(db);
    console.log('db connected for product');
})
// .catch(function(err){
//     console.log(err);
// })
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const productSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter product Name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Please Enter product Description"]
    },
    price:{
        type:Number,
        required:[true,"Please enter product Price"],
        maxLength:[8,"Price cannot exceed 8 characters"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            Public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
            
        }
    ],
    category:{
        type:String,
        required:[true,"Please Enter product Category"],
    },
    Stock:{
        type:Number,
        required:[true,"Please Enter product Stock"],
        maxLength:[4,"Stock cannot exceed 4 character"]
    },
    numofReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true,
            },
            name:{
                type:String,
                required:true,
            },
            rating:{
                type:Number,
                required:true,

            },
            comment:{
                type:String,
                required:true,
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})
module.exports=mongoose.model("Product",productSchema);

