const nodemailer = require("nodemailer");
const to = require("await-to-js").default;
require("dotenv").config();

const currentDate = new Date();

const formattedDate = currentDate.toLocaleDateString("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const sendEmail = async (email, verificationCode) => {
  const transporter = nodemailer.createTransport({
    host: process.env.GMAIL_HOST,
    port: process.env.GMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
  const mailOptions = {
    from: `${process.env.SERVICE_NAME}`,
    to: email,
    date: formattedDate,
    subject: "Verification",
    text: `Your verification code is ${verificationCode}`,
  };
  const [error, info] = await to(transporter.sendMail(mailOptions));
  if (error) throw new Error(`Failed to send email: ${error.message}`);
  console.log(`Email sent: ${info.response}`);
};

module.exports = sendEmail;
