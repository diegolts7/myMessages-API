const sgEmail = require("@sendgrid/mail");
sgEmail.setApiKey(process.env.SENDGRID_API_KEY);

const SendEmail = async (from, to, subject, html, text) => {
  try {
    const infoEmail = await sgEmail.send({
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
