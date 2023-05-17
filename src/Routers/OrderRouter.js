const express = require("express");
const Orderrouter = express.Router();
const {protectRoute, isAuthorised}=require("../Controller/authcontroller");
const { newOrder, getSingleOrder, myorders, Allorders, updateOrder, deleteOrder } = require("../Controller/orderController");
require("../models/usermodel");
Orderrouter
.route("/new")
.post(protectRoute,newOrder)

Orderrouter
.route("/getsingleorder/:id")
.get(protectRoute,getSingleOrder)

Orderrouter
.route("/myorder/me")
.get(protectRoute,myorders)


Orderrouter
.route("/admin/orders")
.get(protectRoute,isAuthorised("admin"),Allorders)
Orderrouter
.route("/admin/orders/:id")
.put(protectRoute,isAuthorised("admin"),updateOrder)
.delete(protectRoute,isAuthorised("admin"),deleteOrder)





module.exports = Orderrouter;