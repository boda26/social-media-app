const expressAsyncHandler = require("express-async-handler");
const sgMail = require('@sendgrid/mail');
const emailMsg = require("../../model/emailMessaging/emailMessaging");
const Filter = require('bad-words');

const sendEmailMsgCtrl = expressAsyncHandler(async (req,res) => {
    const {to, subject, message} = req.body;
    // get the message and prevent profane words
    const emailMessage = subject + ' ' + message;
    const filter = new Filter();
    const isProfane = filter.isProfane(emailMessage);
    if (isProfane) throw new Error('Email sent failed, because it contains profane words!');
    try {
        //build up message
        const msg = {
            to,
            subject,
            text: message,
            from: 'boda2@illinois.edu'
        };
        //send msg
        await sgMail.send(msg);
        await emailMsg.create({
            sentBy: req?.user?._id,
            fromEmail: req?.user?.email,
            toEmail: to,
            message,
            subject
        });
        res.json('Mail sent!');
    } catch (error) {
        res.json(error);
    }
});

module.exports = {sendEmailMsgCtrl};