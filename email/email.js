/*
Nodemailer is used to seend email. 
we use gmail account to snd email for free as we don't need tl setup SMTP Server
*/ 
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "",
    pass: "",
  },
});

module.exports = transporter;
