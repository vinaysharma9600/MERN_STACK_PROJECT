const express = require("express");
const app=express();
const cors = require('cors');
const env=require('dotenv');
const cookieparser=require('cookie-parser');
const { cookie } = require("express/lib/response");
const errorMiddleware=require("./Middleware/error");
const port = 4000;
const path = require("path");

const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const formidable = require("express-formidable");

// Handling Uncaught Exception
process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`);
    console.log("Shutting down the server due to Uncaught Exception ");

})

app.use(cors())
app.use(express.json({ limit: "50mb" }));
app.use(cookieparser());
app.use(bodyParser.urlencoded({ limit: "50mb",extended:true}))
app.use(fileUpload());

if(process.env.NODE_ENV !== "PRODUCTION"){

    env.config();
}

require("./src/models/usermodel");
const userRouter=require('./src/Routers/userRouter');
const productRouter=require('./src/Routers/productRouter');
const Orderrouter = require('./src/Routers/OrderRouter')
const paymentRouter = require('./src/Routers/paymentRoutes');
app.use('/user',userRouter)
app.use('/products',productRouter)
app.use('/order',Orderrouter)
app.use('/payments',paymentRouter)


app.use(express.static(path.join(__dirname,"./frnted/build")));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./frnted/build/index.html"));
  });
// Middle Ware for errors
app.use(errorMiddleware)




const server=app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});

// Unhandeled  Promise Rejection 
process.on("unhandledRejection",err=>{
    console.log(`Error:${err.message}`);
    console.log("Shutting down the server due to unhandeled promise Rejection");
    server.close(()=>{
        process.exit(1);
    });
})