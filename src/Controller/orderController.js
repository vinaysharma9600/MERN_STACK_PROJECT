const OrderModel = require("../models/ordermodel");
const ErrorHandler = require("../../Utils/Errorhandler");
const catchAsyncErrors = require("../../Middleware/catchAsyncErrors");
const productModel = require("../models/productmodel");


// Create new Order
exports.newOrder = catchAsyncErrors(async (req,res,next)=>{
    
    const {shippingInfo,orderItems,paymentInfo,itemPrice,taxPrice,shippingPrice,totalPrice}=req.body;

    const order =  await OrderModel.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user:req.user._id,
    })
    res.status(201).json({
        success:true,
        order,
    })
})

// Get  single order
exports.getSingleOrder = catchAsyncErrors(async (req,res,next)=>{
    const order = await OrderModel.findById(req.params.id).populate("user","name email");

    if(!order){
        return next(new ErrorHandler("Order not found with this id",404));
    }

    res.status(200).json({
        success:true,
        order,
    });
})

// get logged in user Orders
exports.myorders = catchAsyncErrors(async (req,res,next)=>{
    const order = await OrderModel.find({user:req.user._id});

   

    res.status(200).json({
        success:true,
        order,
    });
})

// get all orders

exports.Allorders = catchAsyncErrors(async (req,res,next)=>{
    
    const order = await OrderModel.find();

    let totalAmount=0;
    order.forEach(order=>{
        totalAmount+=order.totalPrice;
    })

    res.status(200).json({
        success:true,
        totalAmount,
        order,
    });
});

// update orderStatus
exports.updateOrder = catchAsyncErrors(async (req,res,next)=>{
    const order = await OrderModel.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("Order not found with this id",404));
    }
    if(order.orderStatus==="Delivered"){
        return next(new ErrorHandler("you have already this order",404))
    }
    if(req.body.status === "Shipped"){
        order.orderItems.forEach(async (o)=>{
            await updateStock(o.product,o.quantity);
        })
    }

    order.orderStatus=req.body.status;
    if(req.body.status==="Delivered"){
        order.deliveredAt = Date.now();
    }
    await order.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
        
    });
});

async function updateStock(id,quantity){
    const product = await productModel.findById(id);
    product.Stock -= quantity; 

    await product.save({validateBeforeSave:false});
}

// Delete order
exports.deleteOrder = catchAsyncErrors(async (req,res,next)=>{
    const order = await OrderModel.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("Order not found with this id",404));
    }
    await order.remove()
    res.status(200).json({
        success:true,
        
    });
});
