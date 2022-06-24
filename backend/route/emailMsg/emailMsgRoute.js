const express = require("express");
const { sendEmailMsgCtrl } = require("../../controllers/emailMsg/emailMsgCtrl");
const authMiddleware = require("../../middleware/auth/authMiddleware");
const emailMsgRoute = express.Router();

emailMsgRoute.post("/", authMiddleware, sendEmailMsgCtrl);

module.exports = emailMsgRoute;
