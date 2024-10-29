const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SUPPORT,
    pass: "Dibolamba#1",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;
