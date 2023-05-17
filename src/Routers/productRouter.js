const express=require("express");
const { protectRoute, isAuthorised } = require("../Controller/authcontroller");
const {getAllProduct,createProduct,updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews,  deleteReviews, getAdminProduct}=require("../Controller/productController");
const productRouter=express.Router();


productRouter
.route("/products")
.get(getAllProduct)

productRouter
.route("/admin/products")
.get(protectRoute,isAuthorised("admin"),getAdminProduct);

productRouter
.route("/create")
.post(protectRoute,isAuthorised("admin"),createProduct)

productRouter
.route("/:id")
.patch(protectRoute,isAuthorised("admin"),updateProduct)
.delete(protectRoute,isAuthorised("admin"),deleteProduct)

productRouter
.route("/product/:id")
.get(getProductDetails)

productRouter
.route("/review")
.put(protectRoute,createProductReview)

productRouter
.route("/reviews")
.get(getProductReviews)





module.exports=productRouter;