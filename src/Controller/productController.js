const ErrorHandler = require("../../Utils/Errorhandler");

const productModel = require("../models/productmodel");
const catchAsyncErrors = require("../../Middleware/catchAsyncErrors");
const ApiFeatures = require("../../Utils/ApiFeatures");
const { json } = require("express/lib/response");
const cloudinary = require("cloudinary");


// Create product--Admin
module.exports.createProduct = catchAsyncErrors(async function createProduct(
  req,
  res,
  next
) {

  

  let images = [];

  if(typeof req.body.images === "string"){//only single Image
    images.push(req.body.images);

  }else{// If lot's of Images array then above images array = req.body.images array 
    images = req.body.images;
  }

  const imageLink  = [];

  for (let i = 0; i < images.length; i++) {
    
    const  result = await cloudinary.v2.uploader.upload(images[i],{
      folder :"products",
    });

    

    imageLink.push({
      Public_id : result.public_id,
      url : result.secure_url,
    })
    
  }

  req.body.images = imageLink;

  req.body.user=req.user.id
  const product = await productModel.create(req.body);
  res.status(201).json({
    success: true,
    data: product,
  });
});

// Get all product
module.exports.getAllProduct = catchAsyncErrors(async function getAllProduct(
  req,
  res,
  next
) {
  
  const resultperPage = 8;
  const productscount=await productModel.countDocuments();

  const apifeatures = new ApiFeatures(productModel.find(), req.query)
    .search()
    .filter()
    let products = await apifeatures.query;
    let filteredProductsCount = products.length;

    apifeatures.pagination(resultperPage);
    
  res.status(200).json({
    message: "All products Retirved",
    data: products,
    productscount,
    resultperPage,
    filteredProductsCount
  });
});

//Get Admin Products
module.exports.getAdminProduct = catchAsyncErrors(async function getAllProduct(
  req,
  res,
  next
) {
  
const products = await productModel.find();
    
  res.status(200).json({
    message: "All products Retirved",
    success:true,
    data:products,
  });
});

// update product --Admin
module.exports.updateProduct = catchAsyncErrors(async function updateProduct(
  req,
  res
) {
  let product = await productModel.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      message: "product not found",
    });
  }

  let images = [];

  if(typeof req.body.images === "string"){//only single Image
    images.push(req.body.images);

  }else{// If lot's of Images array then above images array = req.body.images array 
    images = req.body.images;
  }

  if(images !== undefined){

      //deleting previous  Images from cloudinary
      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].Public_id);
      }

      //Add new Images

      const imageLink  = [];

      for (let i = 0; i < images.length; i++) {
        
        const  result = await cloudinary.v2.uploader.upload(images[i],{
          folder :"products",
        });

        

        imageLink.push({
          Public_id : result.public_id,
          url : result.secure_url,
        })
        
      }
      req.body.images = imageLink;
  }

  



  product = await productModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success:true,
    message: "Product successfully updated",
    data: product,
    
  });
});

// Delete product --admin
module.exports.deleteProduct = catchAsyncErrors(async function deleteProduct(
  req,
  res
) {
  
  const product = await productModel.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      message: "Product not found",
    });
  }

  //deleting Images from cloudinary
  for (let i = 0; i < product.images.length; i++) {
   await cloudinary.v2.uploader.destroy(product.images[i].Public_id);
  }

  await product.remove();
  res.status(200).json({
    success:true,
    message: "product has been deleted successfully",
  });
});

// Product details (single product)
module.exports.getProductDetails = catchAsyncErrors(
  async function getProductDetails(req, res, next) {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("product not found", 401));
    }
    res.status(200).json({
      message: "product has retrieved",
      data: product,
    });
  }
);

// Create new review or update the review---not working correctly if multiple users are login on my website then isReviewed is not work properlyfor update 
exports.createProductReview=catchAsyncErrors(async (req,res,next)=>{
  const {rating,comment,productId}=req.body;
  
  const review={
    user:req.user.id,
    name:req.user.name,
    rating:Number(rating),
    comment,

  };
  const product =await productModel.findById(productId);
  const isReviewed=product.reviews.find((review)=>review.user.toString()===req.user._id.toString());
  if(isReviewed){
    product.reviews.forEach((rev)=>{
      if(rev.user.toString()===req.user._id.toString()){
        rev.rating=rating,
        rev.comment=comment
      }
      
    });
  }
  else{
    product.reviews.push(review);
    product.numofReviews=product.reviews.length;
  }
  
  let avg=0;
  product.ratings=product.reviews.forEach(rev=>{
    avg+=rev.rating
  })
  product.ratings=avg/product.reviews.length;

  await product.save({
    validateBeforeSave:false
  });
  res.status(200).json({
    success:true,
  })
});

// Get all Reviews of a product---
exports.getProductReviews=catchAsyncErrors(async(req,res,next)=>{
  const product =await productModel.findById(req.query.id);
  
  if(!product){
    return next(new ErrorHandler("Product not found",404));

  }
  res.status(200).json({
    success:true,
    reviews:product.reviews,
  })
})
