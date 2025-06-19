const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
    console.log("Sending email to:", to);
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use SMTP for production
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
