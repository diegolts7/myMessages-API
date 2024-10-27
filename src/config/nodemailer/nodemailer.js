const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SUPPORT,
    pass: process.env.KEY_SUPPORT,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;
