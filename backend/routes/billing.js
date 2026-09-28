"use strict";

const express = require("express");
const controller = require("../controllers/billingController");
const { chatRateLimit } = require("../middleware/chatRateLimit");

const router = express.Router();

router.post("/checkout", chatRateLimit, controller.checkout);
router.get("/confirm", chatRateLimit, controller.confirm);

module.exports = router;
