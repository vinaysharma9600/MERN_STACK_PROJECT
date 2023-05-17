const express  = require("express");
const router = express.Router();

const { protectRoute } = require("../Controller/authcontroller");
const { processPayment, sendStripeApiKey } = require("../Controller/paymentController");

router.route("/payment/process").post(protectRoute,processPayment)

router.route("/stripeapikey").get(protectRoute,sendStripeApiKey);

module.exports = router;

