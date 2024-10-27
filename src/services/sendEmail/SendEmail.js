const transporter = require("../../config/nodemailer/nodemailer");

const SendEmail = async (from, to, subject, html, text) => {
  try {
    const infoEmail = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text,
    });
    return infoEmail;
  } catch (error) {
    throw error;
  }
};

module.exports = SendEmail;
